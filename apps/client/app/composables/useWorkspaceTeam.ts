import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useWorkspaceProjectInfoQuery } from '~/composables/useWorkspaceProjectInfo'
import { WorkspaceTeamService } from '~/services/workspace-team.service'
import { useAuth } from '~/composables/useAuth'
import { useWorkspaceActivityInvalidation } from '~/composables/useWorkspaceActivityInvalidation'
import type { WorkspaceProjectInfoDTO } from '~/types/workspace-info'
import type { WorkspaceTeamMember } from '~/types/workspace-team'
import { getApiErrorMessage } from '~/utils/error'

const PAGE_SIZE = 20

export const useWorkspaceTeam = (slug: Ref<string>) => {
  const { user } = useAuth()
  const projectInfoQuery = useWorkspaceProjectInfoQuery(slug)
  const rows = ref<WorkspaceTeamMember[]>([])
  const info = ref<WorkspaceProjectInfoDTO | null>(null)
  const loading = ref(false)
  const savingMemberId = ref<string | null>(null)
  const membersError = ref<string | null>(null)
  const infoError = ref<string | null>(null)
  const page = ref(1)
  const pagination = ref({ page: 1, limit: PAGE_SIZE, total: 0, total_pages: 0 })
  let requestVersion = 0
  let activeRequest: AbortController | null = null

  const projectSlug = computed(() => slug.value.trim())
  const currentUserId = computed(() => user.value?.id ?? null)
  const workspaceInvalidation = useWorkspaceActivityInvalidation(currentUserId)
  const canManageWorkspace = computed(() => info.value?.viewer.capabilities.can_manage_workspace ?? false)
  const canGrantTaskAccess = computed(() => info.value?.project.ownership.owner_id === currentUserId.value && info.value?.project.status === 'in_progress')
  const members = computed(() => rows.value.map(member => ({
    ...member,
    canChangeTaskManagement: canGrantTaskAccess.value && member.membershipRole === 'contributor'
  })))
  const canGoPrevious = computed(() => page.value > 1)
  const canGoNext = computed(() => page.value < pagination.value.total_pages)
  const taskCountsVersion = useState<number>('workspace-task-count-version', () => 0)

  const load = async () => {
    const value = projectSlug.value
    const version = ++requestVersion
    activeRequest?.abort()
    rows.value = []
    membersError.value = null
    if (!value) { membersError.value = 'Slug proyek tidak tersedia.'; loading.value = false; return }
    const controller = new AbortController()
    activeRequest = controller
    loading.value = true
    try {
      const result = await WorkspaceTeamService.listMembers(value, page.value, PAGE_SIZE, controller.signal)
      if (version !== requestVersion || controller.signal.aborted) return
      rows.value = result.members
      pagination.value = result.meta
    } catch (cause) {
      if (version === requestVersion && !controller.signal.aborted) membersError.value = getApiErrorMessage(cause, 'Daftar anggota proyek belum dapat dimuat.')
    } finally {
      if (version === requestVersion) { loading.value = false; activeRequest = null }
    }
  }

  const loadInfo = async () => {
    const value = projectSlug.value
    const accountId = currentUserId.value
    infoError.value = null
    if (!value) { infoError.value = 'Slug proyek tidak tersedia.'; return }
    try {
      const result = await projectInfoQuery.getInfo(value)
      if (projectSlug.value === value && currentUserId.value === accountId) info.value = result
    } catch (cause) {
      if (projectSlug.value === value && currentUserId.value === accountId) infoError.value = getApiErrorMessage(cause, 'Informasi proyek belum dapat dimuat.')
    }
  }

  const setTaskManagement = async (membershipId: string, granted: boolean) => {
    const member = rows.value.find(item => item.membershipId === membershipId)
    if (!member || !canGrantTaskAccess.value || member.membershipRole !== 'contributor' || savingMemberId.value) return
    savingMemberId.value = membershipId
    membersError.value = null
    try {
      const result = await WorkspaceTeamService.updateTaskAccess(projectSlug.value, membershipId, member.taskAccessVersion, granted)
      rows.value = rows.value.map(item => item.membershipId === membershipId ? { ...item, taskManagementGranted: result.task_management_granted, taskAccessVersion: result.task_access_version } : item)
      workspaceInvalidation.markDirty({ slug: projectSlug.value })
    } catch (cause) {
      membersError.value = getApiErrorMessage(cause, 'Izin pengelolaan task belum dapat diubah.')
      await load()
    } finally { savingMemberId.value = null }
  }

  const setPage = (nextPage: number) => {
    const target = Math.min(Math.max(1, nextPage), Math.max(1, pagination.value.total_pages))
    if (target !== page.value) page.value = target
  }

  watch(projectSlug, () => { page.value = 1; pagination.value = { page: 1, limit: PAGE_SIZE, total: 0, total_pages: 0 }; info.value = null; void load(); void loadInfo() }, { immediate: true })
  watch(page, () => void load())
  watch(taskCountsVersion, () => void load())
  watch(currentUserId, () => { rows.value = []; info.value = null; void load(); void loadInfo() })
  onScopeDispose(() => { activeRequest?.abort() })

  return { members, info, loading, savingMemberId, membersError, infoError, pagination, page, canGoPrevious, canGoNext, canManageWorkspace, canGrantTaskAccess, currentUserId, load, setPage, setTaskManagement }
}
