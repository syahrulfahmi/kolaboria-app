import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useWorkspaceActivityInvalidation } from '~/composables/useWorkspaceActivityInvalidation'
import { useWorkspaceProjectInfoQuery } from '~/composables/useWorkspaceProjectInfo'
import { WorkspaceService } from '~/services/workspace.service'
import type {
  CompleteWorkspaceProjectInput,
  WorkspaceProjectCompletion,
  WorkspaceProjectInfoViewModel
} from '~/types/workspace-info'
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/error'

interface CompletionGateway {
  refreshInfo(): Promise<void>
  complete(slug: string, request: CompleteWorkspaceProjectInput): Promise<WorkspaceProjectCompletion>
}

export const createWorkspaceProjectCompletionController = (
  slug: Ref<string>,
  accountId: Ref<string | null>,
  info: Ref<WorkspaceProjectInfoViewModel | null>,
  gateway: CompletionGateway
) => {
  const open = ref(false)
  const reviewing = ref(false)
  const saving = ref(false)
  const resultSummary = ref('')
  const reviewBasis = ref('')
  const error = ref<string | null>(null)
  const needsRefresh = ref(false)
  let generation = 0
  const canConfirm = computed(() => {
    const project = info.value
    if (!project?.closure) return false
    return open.value && !reviewing.value && !saving.value && !needsRefresh.value &&
      !!project?.canCompleteProject && project.closure.eligible && !!resultSummary.value.trim() &&
      resultSummary.value.length <= 5000 && reviewBasis.value.length <= 5000 &&
      (project.closure.task_summary.total_tasks > 0 || !!reviewBasis.value.trim())
  })

  const requestReview = async () => {
    if (reviewing.value || saving.value || (!info.value?.canCompleteProject && !(open.value && needsRefresh.value))) return
    const current = generation
    reviewing.value = true
    error.value = null
    try {
      await gateway.refreshInfo()
      if (current !== generation) return
      needsRefresh.value = false
      if (info.value?.project.status === 'completed') open.value = false
      else if (!info.value?.closure) {
        open.value = false
        error.value = 'Data penutupan proyek belum tersedia. Muat ulang informasi proyek untuk mencoba kembali.'
      } else if (info.value.canCompleteProject && info.value.closure.eligible) open.value = true
      else error.value = 'Selesaikan atau tutup seluruh task dengan alasan perubahan scope sebelum meninjau penutupan.'
    } catch (cause) {
      if (current === generation) error.value = getApiErrorMessage(cause, 'Ringkasan penutupan terbaru belum dapat dimuat.')
    } finally {
      if (current === generation) reviewing.value = false
    }
  }

  const cancel = () => {
    if (saving.value || reviewing.value) return
    open.value = false
    error.value = null
  }

  const confirm = async () => {
    const project = info.value
    if (!project?.closure || !canConfirm.value) return
    const current = generation
    const mutationSlug = slug.value
    saving.value = true
    error.value = null
    try {
      const completion = await gateway.complete(mutationSlug, {
        version: project.project.version,
        task_version: project.closure.task_summary.version,
        result_summary: resultSummary.value.trim(),
        review_basis: reviewBasis.value.trim()
      })
      if (current !== generation) return
      // Publish the server-confirmed decision without another GET.
      info.value = {
        ...project,
        project: { ...project.project, status: 'completed', statusLabel: 'Selesai', version: completion.project_version },
        canCompleteProject: false,
        canStartProject: false,
        closure: { eligible: false, task_summary: completion.task_summary, completion }
      }
      open.value = false
      resultSummary.value = ''
      reviewBasis.value = ''
    } catch (cause) {
      if (current !== generation) return
      if (getApiErrorStatus(cause) === 409) {
        needsRefresh.value = true
        // Never retry a stale decision automatically. Keep the owner's text.
        try {
          await gateway.refreshInfo()
          if (current === generation) needsRefresh.value = false
        } catch {
          // Keep confirmation disabled until an explicit refresh succeeds.
        }
        if (current !== generation) return
        if (info.value?.project.status === 'completed') open.value = false
        error.value = 'Data proyek atau task berubah. Periksa ringkasan terbaru sebelum mengonfirmasi kembali.'
      } else {
        error.value = getApiErrorMessage(cause, 'Penutupan proyek belum dapat disimpan.')
      }
    } finally {
      if (current === generation) saving.value = false
    }
  }

  const reset = () => {
    generation++
    open.value = false
    reviewing.value = false
    saving.value = false
    resultSummary.value = ''
    reviewBasis.value = ''
    error.value = null
    needsRefresh.value = false
  }
  watch([slug, accountId], reset)
  onScopeDispose(reset)
  return { open, reviewing, saving, resultSummary, reviewBasis, error, needsRefresh, canConfirm, requestReview, cancel, confirm }
}

export const useWorkspaceProjectCompletion = (
  slug: Ref<string>,
  info: Ref<WorkspaceProjectInfoViewModel | null>,
  refreshInfo: () => Promise<void>
) => {
  const { user } = useAuth()
  const accountId = computed(() => user.value?.id ?? null)
  const query = useWorkspaceProjectInfoQuery(slug)
  const activity = useWorkspaceActivityInvalidation(accountId)
  return createWorkspaceProjectCompletionController(slug, accountId, info, {
    refreshInfo: async () => {
      await refreshInfo()
      if (!info.value) throw new Error('Informasi proyek terbaru belum tersedia. Coba muat ulang.')
    },
    complete: async (projectSlug, request) => {
      const actor = accountId.value
      const projectId = info.value?.project.id
      const result = await WorkspaceService.completeProject(projectSlug, request)
      if (actor === accountId.value) {
        query.acceptCompletion(projectSlug, result)
        activity.markDirty({ slug: projectSlug, id: projectId })
      }
      return result
    }
  })
}
