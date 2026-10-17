import { useWorkspaceActivityInvalidation } from '~/composables/useWorkspaceActivityInvalidation'
import { computed, ref, watch, type Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { WorkspaceService } from '~/services/workspace.service'
import type { WorkspaceProjectCompletion, WorkspaceProjectInfoDTO, WorkspaceProjectInfoViewModel } from '~/types/workspace-info'
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/error'
import { mapWorkspaceProjectInfo } from '~/utils/workspace-project-info'

const PROJECT_INFO_TTL_MS = 15_000

type CachedProjectInfo = {
  data: WorkspaceProjectInfoDTO
  fetchedAt: number
}

const projectInfoRequests = new Map<string, Promise<WorkspaceProjectInfoDTO>>()

/** Shares fresh project info and in-flight requests between Workspace routes. */
export const useWorkspaceProjectInfoQuery = (slug: Ref<string>) => {
  const { user } = useAuth()
  const cache = useState<Record<string, CachedProjectInfo>>(
    'workspace-project-info-cache',
    () => ({})
  )
  const epochs = useState<Record<string, number>>('workspace-project-info-epochs', () => ({}))
  const projectKey = (projectSlug: string, accountId = user.value?.id ?? 'anonymous') =>
    `${encodeURIComponent(accountId)}::${encodeURIComponent(projectSlug.trim())}`
  const key = computed(() => projectKey(slug.value))
  const data = computed(() => cache.value[key.value]?.data ?? null)

  const invalidate = (projectSlug = slug.value) => {
    const requestKey = projectKey(projectSlug)
    epochs.value = { ...epochs.value, [requestKey]: (epochs.value[requestKey] ?? 0) + 1 }
    cache.value = Object.fromEntries(Object.entries(cache.value).filter(([entryKey]) => entryKey !== requestKey))
    projectInfoRequests.delete(requestKey)
  }

  const acceptCompletion = (projectSlug: string, completion: WorkspaceProjectCompletion) => {
    const requestKey = projectKey(projectSlug)
    const previous = cache.value[requestKey]?.data
    invalidate(projectSlug)
    if (!previous) return
    const data: WorkspaceProjectInfoDTO = {
      ...previous,
      project: { ...previous.project, status: 'completed', version: completion.project_version },
      closure: { eligible: false, completion, task_summary: completion.task_summary },
      viewer: { ...previous.viewer, capabilities: { ...previous.viewer.capabilities,
        can_start_project: false, can_create_task: false, can_complete_project: false } }
    }
    cache.value = { ...cache.value, [requestKey]: { data, fetchedAt: Date.now() } }
  }

  watch(() => user.value?.id, (accountId, previousAccountId) => {
    if (!previousAccountId || accountId === previousAccountId) return
    const prefix = `${encodeURIComponent(previousAccountId)}::`
    cache.value = Object.fromEntries(
      Object.entries(cache.value).filter(([entryKey]) => !entryKey.startsWith(prefix))
    )
    epochs.value = Object.fromEntries(Object.entries(epochs.value).filter(([entryKey]) => !entryKey.startsWith(prefix)))
  })

  const getInfo = async (projectSlug = slug.value, force = false) => {
    const normalizedSlug = projectSlug.trim()
    if (!normalizedSlug) throw new Error('Slug proyek tidak tersedia.')

    const accountId = user.value?.id ?? 'anonymous'
    const requestKey = projectKey(normalizedSlug, accountId)
    const cached = cache.value[requestKey]
    if (!force && cached && Date.now() - cached.fetchedAt < PROJECT_INFO_TTL_MS) {
      return cached.data
    }

    const pending = projectInfoRequests.get(requestKey)
    if (pending) return pending

    const requestEpoch = epochs.value[requestKey] ?? 0

    const request = WorkspaceService.getProjectInfo(normalizedSlug).then((result) => {
      // Keep the result under its account/project key. The active view reads
      // only its current key, even if navigation changed while this request ran.
      if ((user.value?.id ?? 'anonymous') === accountId && (epochs.value[requestKey] ?? 0) === requestEpoch) {
        const now = Date.now()
        const retained = Object.fromEntries(
          Object.entries(cache.value).filter(([, entry]) => now - entry.fetchedAt < PROJECT_INFO_TTL_MS * 4)
        )
        cache.value = { ...retained, [requestKey]: { data: result, fetchedAt: now } }
      }
      return result
    }).finally(() => {
      if (projectInfoRequests.get(requestKey) === request) projectInfoRequests.delete(requestKey)
    })
    projectInfoRequests.set(requestKey, request)
    return request
  }

  return { data, getInfo, invalidate, acceptCompletion }
}

export interface WorkspaceProjectInfoGateway {
  getInfo(slug: string, signal?: AbortSignal, force?: boolean): Promise<WorkspaceProjectInfoDTO>
  startProject(projectId: string, request: { version: number; confirm_underfilled_positions: boolean }): Promise<void>
}

export const createWorkspaceProjectInfoController = (
  slug: Ref<string>,
  gateway: WorkspaceProjectInfoGateway
) => {
  const data = ref<WorkspaceProjectInfoViewModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const startError = ref<string | null>(null)
  const starting = ref(false)
  const confirmingStart = ref(false)
  let requestVersion = 0
  let activeRequest: AbortController | null = null

  const canStart = computed(() => !!data.value?.canStartProject && data.value.project.status === 'open')
  const hasUnderfilledPositions = computed(() => (data.value?.positionCapacitySummary.totalRemainingCapacity ?? 0) > 0)

  const load = async (force = false) => {
    const projectSlug = slug.value.trim()
    const currentRequest = ++requestVersion
    activeRequest?.abort()
    activeRequest = null
    data.value = null
    error.value = null
    if (!projectSlug) {
      loading.value = false
      error.value = 'Slug proyek tidak tersedia.'
      return
    }

    const controller = new AbortController()
    activeRequest = controller
    loading.value = true
    try {
      const response = await gateway.getInfo(projectSlug, controller.signal, force)
      if (currentRequest !== requestVersion || controller.signal.aborted) return
      data.value = mapWorkspaceProjectInfo(response)
    } catch (cause) {
      if (currentRequest !== requestVersion || controller.signal.aborted) return
      error.value = getApiErrorMessage(cause, 'Informasi proyek belum dapat dimuat.')
    } finally {
      if (currentRequest === requestVersion) {
        loading.value = false
        activeRequest = null
      }
    }
  }

  const requestStart = () => {
    if (!canStart.value || starting.value) return
    startError.value = null
    confirmingStart.value = true
  }

  const cancelStart = () => {
    if (!starting.value) confirmingStart.value = false
    startError.value = null
  }

  const confirmStart = async () => {
    const current = data.value
    if (!current || !canStart.value || starting.value) return
    starting.value = true
    startError.value = null
    try {
      await gateway.startProject(current.project.id, {
        version: current.project.version,
        confirm_underfilled_positions: current.positionCapacitySummary.totalRemainingCapacity > 0
      })
      confirmingStart.value = false
      await load(true)
    } catch (cause) {
      if (getApiErrorStatus(cause) === 409) {
        await load(true)
        if (!canStart.value) confirmingStart.value = false
        startError.value = 'Informasi proyek berubah. Periksa kuota terbaru sebelum melanjutkan.'
      } else {
        startError.value = getApiErrorMessage(cause, 'Proyek belum dapat dimulai.')
      }
    } finally {
      starting.value = false
    }
  }

  watch(slug, () => {
    confirmingStart.value = false
    startError.value = null
    void load()
  }, { immediate: true })

  return {
    data,
    loading,
    error,
    startError,
    starting,
    confirmingStart,
    canStart,
    hasUnderfilledPositions,
    load,
    requestStart,
    cancelStart,
    confirmStart
  }
}

export const useWorkspaceProjectInfo = (slug: Ref<string>) => {
  const activityInvalidation = useWorkspaceActivityInvalidation()
  const query = useWorkspaceProjectInfoQuery(slug)
  const controller = createWorkspaceProjectInfoController(slug, {
    getInfo: (projectSlug, _signal, force) => query.getInfo(projectSlug, force),
    startProject: async (projectId, request) => {
      const mutationSlug = slug.value
      await WorkspaceService.startProject(projectId, request)
      activityInvalidation.markDirty({ slug: mutationSlug, id: projectId })
    }
  })
  const { user } = useAuth()
  watch(() => user.value?.id, () => { void controller.load() })
  return controller
}
