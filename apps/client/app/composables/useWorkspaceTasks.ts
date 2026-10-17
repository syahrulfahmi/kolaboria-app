import { useWorkspaceActivityInvalidation } from '~/composables/useWorkspaceActivityInvalidation'
import { computed, onScopeDispose, ref, unref, watch, type MaybeRef, type Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useWorkspaceProjectInfoQuery } from '~/composables/useWorkspaceProjectInfo'
import { WorkspaceTaskService } from '~/services/workspace-task.service'
import { WorkspaceTeamService } from '~/services/workspace-team.service'
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/error'
import type { WorkspaceProjectInfoDTO } from '~/types/workspace-info'
import type {
  CreateWorkspaceTaskInput,
  WorkspaceTaskCommentDTO,
  WorkspaceTaskDTO,
  WorkspaceTaskFilter,
  WorkspaceTaskGateway,
  WorkspaceTaskPriority,
  WorkspaceTaskStatus,
  UpdateWorkspaceTaskInput
} from '~/types/workspace-task'

export const TASK_COLUMNS: Array<{ status: WorkspaceTaskStatus; label: string }> = [
  { status: 'todo', label: 'Akan dikerjakan' },
  { status: 'in_progress', label: 'Dikerjakan' },
  { status: 'review', label: 'Perlu review' },
  { status: 'done', label: 'Selesai' },
  { status: 'closed', label: 'Ditutup' }
]

const blankColumns = () => Object.fromEntries(TASK_COLUMNS.map(({ status }) => [status, [] as WorkspaceTaskDTO[]])) as Record<WorkspaceTaskStatus, WorkspaceTaskDTO[]>
const blankPages = () => Object.fromEntries(TASK_COLUMNS.map(({ status }) => [status, { page: 0, total: 0, totalPages: 0, loading: false, error: null as string | null }])) as Record<WorkspaceTaskStatus, { page: number; total: number; totalPages: number; loading: boolean; error: string | null }>
const makeIdempotencyKey = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const createWorkspaceTasksController = (
  slug: Ref<string>,
  gateway: WorkspaceTaskGateway = WorkspaceTaskService,
  initialFilter: MaybeRef<WorkspaceTaskFilter> = 'all',
  initialAssignee: MaybeRef<string | null> = null
) => {
  const { user } = useAuth()
  const projectInfoQuery = useWorkspaceProjectInfoQuery(slug)
  const info = ref<WorkspaceProjectInfoDTO | null>(null)
  const tasks = ref(blankColumns())
  const pages = ref(blankPages())
  const initialFilterValue = () => unref(initialFilter)
  const initialAssigneeValue = () => initialFilterValue() === 'mine' ? null : unref(initialAssignee)
  const filter = ref<WorkspaceTaskFilter>(initialFilterValue())
  const assigneeFilter = ref<string | null>(initialAssigneeValue())
  const query = ref('')
  const search = ref('')
  const loading = ref(false)
  const boardLoaded = ref(false)
  const error = ref<string | null>(null)
  const members = ref<Array<{ id: string; name: string; avatar: string | null }>>([])
  const membersLoading = ref(false)
  const membersError = ref<string | null>(null)
  const selectedTask = ref<WorkspaceTaskDTO | null>(null)
  const comments = ref<WorkspaceTaskCommentDTO[]>([])
  const commentsPage = ref({ page: 1, total: 0, totalPages: 0, error: null as string | null })
  const commentsLoading = ref(false)
  const dialogOpen = ref(false)
  const detailLoading = ref(false)
  const creatingTask = ref(false)
  const saving = ref(false)
  const sendingComment = ref(false)
  const mutationError = ref<string | null>(null)
  const notice = ref<string | null>(null)
  const taskForm = ref({ title: '', description: '', assigneeMemberId: '', priority: 'medium' as WorkspaceTaskPriority, dueDate: '', status: 'todo' as WorkspaceTaskStatus, closeReason: '', comment: '' })
  let latestCreateFingerprint: string | null = null
  const projectSlug = computed(() => slug.value.trim())
  const currentUserId = computed(() => user.value?.id ?? null)
  const activityInvalidation = useWorkspaceActivityInvalidation(currentUserId)
  const canCreate = computed(() => info.value?.viewer.capabilities.can_create_task ?? false)
  const canManage = computed(() => info.value?.viewer.capabilities.can_manage_workspace ?? false)
  const projectTitle = computed(() => info.value?.project.title ?? '')
  const projectStatus = computed(() => info.value?.project.status ?? null)
  let requestGeneration = 0
  let detailGeneration = 0
  let memberGeneration = 0
  let searchTimer: ReturnType<typeof setTimeout> | undefined
  let listAbort: AbortController | null = null
  let detailAbort: AbortController | null = null
  let commentsAbort: AbortController | null = null
  let memberAbort: AbortController | null = null
  let membersLoaded = false
  let membersPromise: Promise<void> | null = null
  let latestCreateKey: string | null = null
  let pendingCommentKey: string | null = null
  let pendingCommentBody = ''
  let pendingCommentTaskId: string | null = null

  const visibleColumns = computed(() => TASK_COLUMNS.map((column) => ({
    ...column,
    tasks: tasks.value[column.status],
    total: pages.value[column.status].total,
    canLoadMore: pages.value[column.status].page < pages.value[column.status].totalPages,
    loadingMore: pages.value[column.status].loading
  })))
  const canSave = computed(() => taskForm.value.title.trim().length > 0 && !saving.value)
  const taskCountsVersion = useState<number>('workspace-task-count-version', () => 0)

  const notifyTaskCountsChanged = () => { taskCountsVersion.value++; projectInfoQuery.invalidate(projectSlug.value) }

  const resetPages = () => { tasks.value = blankColumns(); pages.value = blankPages() }

  const loadColumn = async (status: WorkspaceTaskStatus, generation: number, append = false) => {
    if (!projectSlug.value || generation !== requestGeneration) return
    const page = append ? pages.value[status].page + 1 : 1
    pages.value[status] = { ...pages.value[status], loading: true, error: null }
    const queryFilter = filter.value
    const selectedAssignee = assigneeFilter.value
    const searchTerm = search.value
    try {
      const result = await gateway.list(projectSlug.value, {
        page, limit: 20, status, q: searchTerm || undefined,
        mine: queryFilter === 'mine' ? true : undefined,
        assignee_member_id: queryFilter !== 'mine' ? selectedAssignee ?? undefined : undefined
      }, listAbort?.signal)
      if (generation !== requestGeneration || queryFilter !== filter.value || selectedAssignee !== assigneeFilter.value || searchTerm !== search.value) return
      const existing = append ? tasks.value[status] : []
      const byId = new Map(existing.map((task) => [task.id, task]))
      for (const task of result.data) byId.set(task.id, { ...byId.get(task.id), ...task })
      tasks.value = { ...tasks.value, [status]: Array.from(byId.values()) }
      pages.value[status] = { page: result.meta.page, total: result.meta.total, totalPages: result.meta.total_pages, loading: false, error: null }
    } catch (cause) {
      if (generation !== requestGeneration || listAbort?.signal.aborted) return
      pages.value[status] = { ...pages.value[status], loading: false, error: getApiErrorMessage(cause, 'Kolom task belum dapat dimuat.') }
    }
  }

  const loadBoard = async () => {
    const generation = ++requestGeneration
    listAbort?.abort(); listAbort = new AbortController()
    const controller = listAbort
    const slugValue = projectSlug.value
    resetPages(); error.value = null; loading.value = true
    boardLoaded.value = false
    if (!slugValue) { loading.value = false; error.value = 'Slug proyek tidak tersedia.'; return }
    try {
      const [projectInfo] = await Promise.all([projectInfoQuery.getInfo(slugValue), loadMembers()])
      if (generation !== requestGeneration || controller.signal.aborted) return
      info.value = projectInfo
      const statuses = filter.value === 'review' ? ['review' as const] : TASK_COLUMNS.map((column) => column.status)
      await Promise.all(statuses.map((status) => loadColumn(status, generation)))
      for (const status of TASK_COLUMNS.map((column) => column.status)) {
        if (!statuses.includes(status)) pages.value[status] = { ...pages.value[status], page: 1, total: 0, totalPages: 0 }
      }
      boardLoaded.value = true
    } catch (cause) {
      if (generation === requestGeneration && !controller.signal.aborted) error.value = getApiErrorMessage(cause, 'Workspace task belum dapat dimuat.')
      if (generation === requestGeneration && !controller.signal.aborted) boardLoaded.value = true
    } finally {
      if (generation === requestGeneration) loading.value = false
    }
  }

  const reconcileSelectedTask = async (taskId: string) => {
    await loadBoard()
    try {
      const latest = await gateway.get(projectSlug.value, taskId)
      if (selectedTask.value?.id === taskId) selectedTask.value = latest
    } catch (cause) {
      if (selectedTask.value?.id === taskId && getApiErrorStatus(cause) === 404) {
        selectedTask.value = null
        dialogOpen.value = false
        notice.value = 'Task sudah tidak tersedia. Board diperbarui dengan data terbaru.'
      }
    }
  }

  const loadMembers = async (): Promise<void> => {
    const slugValue = projectSlug.value
    if (!slugValue || membersLoaded) return
    if (membersPromise) return membersPromise
    const generation = ++memberGeneration
    memberAbort?.abort()
    const controller = new AbortController()
    memberAbort = controller
    const accountId = currentUserId.value
    membersLoading.value = true
    membersError.value = null
    const request = (async () => {
      try {
        const first = await WorkspaceTeamService.listMembers(slugValue, 1, 50, controller.signal)
        const pagesToLoad = Array.from({ length: Math.max(0, first.meta.total_pages - 1) }, (_, index) => index + 2)
        const rest: typeof first.members[] = []
        for (let index = 0; index < pagesToLoad.length; index += 3) {
          const batch = pagesToLoad.slice(index, index + 3)
          rest.push(...await Promise.all(batch.map(async (page) => (await WorkspaceTeamService.listMembers(slugValue, page, 50, controller.signal)).members)))
        }
        if (generation !== memberGeneration || controller.signal.aborted || projectSlug.value !== slugValue || currentUserId.value !== accountId) return
        const roster = [...first.members, ...rest.flat()].map((member) => ({ id: member.membershipId, name: member.name, avatar: member.avatar }))
        members.value = Array.from(new Map(roster.map((member) => [member.id, member])).values())
        membersLoaded = true
      } catch (cause) {
        if (generation === memberGeneration && !controller.signal.aborted && projectSlug.value === slugValue && currentUserId.value === accountId) {
          membersError.value = getApiErrorMessage(cause, 'Daftar anggota belum dapat dimuat.')
        }
      } finally {
        if (generation === memberGeneration) {
          membersLoading.value = false
          memberAbort = null
        }
      }
    })()
    membersPromise = request
    try { await request } finally { if (membersPromise === request) membersPromise = null }
  }

  const loadMore = async (status: WorkspaceTaskStatus) => { if (pages.value[status].page < pages.value[status].totalPages) await loadColumn(status, requestGeneration, true) }

  const refreshColumns = async (statuses: WorkspaceTaskStatus[]) => {
    const affected = [...new Set(statuses)].filter(status => filter.value !== 'review' || status === 'review')
    if (!affected.length || !projectSlug.value) return
    const generation = ++requestGeneration
    listAbort?.abort(); listAbort = new AbortController()
    await Promise.all(affected.map(status => loadColumn(status, generation)))
  }

  const changeFilter = (next: WorkspaceTaskFilter) => { if (next === filter.value) return; filter.value = next; if (next === 'mine') assigneeFilter.value = null; void loadBoard() }
  const setAssigneeFilter = (memberId: string | null) => { assigneeFilter.value = assigneeFilter.value === memberId ? null : memberId; if (filter.value === 'mine') filter.value = 'all'; void loadBoard() }
  const filterByAssignee = (memberId: string | null) => {
    if (assigneeFilter.value === memberId) return
    assigneeFilter.value = memberId
    if (memberId && filter.value === 'mine') filter.value = 'all'
    void loadBoard()
  }
  const setSearch = (value: string) => {
    if (value === query.value) return
    query.value = value
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      const nextSearch = value.trim()
      if (nextSearch === search.value) return
      search.value = nextSearch
      void loadBoard()
    }, 250)
  }

  const openCreate = async () => {
    if (!canCreate.value || projectStatus.value !== 'in_progress') return
    latestCreateKey = null; latestCreateFingerprint = null
    detailLoading.value = false; creatingTask.value = true
    selectedTask.value = null; comments.value = []; mutationError.value = null
    taskForm.value = { title: '', description: '', assigneeMemberId: info.value?.viewer.membership_id ?? '', priority: 'medium', dueDate: '', status: 'todo', closeReason: '', comment: '' }
    dialogOpen.value = true; await loadMembers()
  }

  const openTask = async (taskId: string) => {
    detailAbort?.abort(); commentsAbort?.abort()
    detailAbort = new AbortController(); commentsAbort = new AbortController()
    const generation = ++detailGeneration
    creatingTask.value = false; detailLoading.value = true
    selectedTask.value = null; comments.value = []; commentsPage.value = { page: 1, total: 0, totalPages: 0, error: null }; mutationError.value = null
    commentsLoading.value = false
    dialogOpen.value = true
    try {
      const [task, commentPage] = await Promise.all([
        gateway.get(projectSlug.value, taskId, detailAbort.signal),
        gateway.listComments(projectSlug.value, taskId, 1, commentsAbort.signal)
      ])
      if (generation !== detailGeneration) return
      selectedTask.value = task; comments.value = commentPage.data
      commentsPage.value = { page: commentPage.meta.page, total: commentPage.meta.total, totalPages: commentPage.meta.total_pages, error: null }
      taskForm.value = { title: task.title, description: task.description ?? task.description_preview, assigneeMemberId: task.assignee?.membership_id ?? '', priority: task.priority, dueDate: task.due_date ?? '', status: task.status, closeReason: '', comment: '' }
      if (task.permissions.manage_metadata) await loadMembers()
    } catch (cause) {
      if (generation === detailGeneration && !detailAbort.signal.aborted) mutationError.value = getApiErrorMessage(cause, 'Detail task belum dapat dimuat.')
    } finally {
      if (generation === detailGeneration) detailLoading.value = false
    }
  }

  const save = async () => {
    if (!canSave.value || (!creatingTask.value && !selectedTask.value)) return
    const slugAtStart = projectSlug.value
    saving.value = true; mutationError.value = null
    try {
      if (creatingTask.value) {
        const input: CreateWorkspaceTaskInput = { title: taskForm.value.title, description: taskForm.value.description, assignee_member_id: taskForm.value.assigneeMemberId || null, ...(canManage.value ? { priority: taskForm.value.priority, due_date: taskForm.value.dueDate || null } : {}) }
        const fingerprint = JSON.stringify(input)
        if (latestCreateFingerprint !== fingerprint) { latestCreateFingerprint = fingerprint; latestCreateKey = makeIdempotencyKey() }
        latestCreateKey ??= makeIdempotencyKey()
        await gateway.create(slugAtStart, input, latestCreateKey); activityInvalidation.markDirty({ slug: slugAtStart })
        if (projectSlug.value !== slugAtStart) return
        latestCreateKey = null; latestCreateFingerprint = null
        dialogOpen.value = false; await refreshColumns(['todo']); notifyTaskCountsChanged(); notice.value = 'Task berhasil dibuat.'; return
      }
      const current = selectedTask.value
      if (!current) return
      const input: UpdateWorkspaceTaskInput = { version: current.version }
      if (taskForm.value.title !== current.title) input.title = taskForm.value.title
      if (taskForm.value.description !== (current.description ?? current.description_preview)) input.description = taskForm.value.description
      if (current.permissions.manage_metadata) {
        const assignee = taskForm.value.assigneeMemberId || null
        if (assignee !== (current.assignee?.membership_id ?? null)) input.assignee_member_id = assignee
        if (taskForm.value.priority !== current.priority) input.priority = taskForm.value.priority
        if (taskForm.value.dueDate !== (current.due_date ?? '')) input.due_date = taskForm.value.dueDate || null
      }
      if (taskForm.value.status !== current.status) {
        input.to_status = taskForm.value.status
        if (taskForm.value.status === 'closed') input.close_reason = taskForm.value.closeReason
        if (current.status === 'done' || current.status === 'closed') input.reopen_confirmed = true
      }
      const updated = await gateway.update(slugAtStart, current.id, input); activityInvalidation.markDirty({ slug: slugAtStart })
      if (projectSlug.value !== slugAtStart) return
      projectInfoQuery.invalidate(slugAtStart)
      selectedTask.value = updated
      dialogOpen.value = false
      await refreshColumns([current.status, updated.status])
      if (input.to_status || input.assignee_member_id !== undefined) notifyTaskCountsChanged()
      notice.value = 'Perubahan task berhasil disimpan.'
    } catch (cause) {
      if (projectSlug.value !== slugAtStart) return
      const status = getApiErrorStatus(cause)
      mutationError.value = status === 409 ? 'Task berubah sejak dibuka. Perbarui data dan tinjau kembali perubahanmu.' : getApiErrorMessage(cause, 'Task belum dapat disimpan.')
      if (selectedTask.value && (status === 404 || status === 409 || !status || status >= 500)) await reconcileSelectedTask(selectedTask.value.id)
    } finally { saving.value = false }
  }

  const changeStatus = async (taskId: string, status: WorkspaceTaskStatus) => {
    const slugAtStart = projectSlug.value
    const task = TASK_COLUMNS.flatMap((column) => tasks.value[column.status]).find((item) => item.id === taskId)
    if (!task || !task.permissions.allowed_transitions.includes(status)) return
    if (status === 'closed') {
      await openTask(taskId)
      if (selectedTask.value?.id === taskId) taskForm.value.status = 'closed'
      return
    }
    const reopening = task.status === 'done' || task.status === 'closed'
    if (reopening && !globalThis.confirm('Buka kembali task ini dan kembalikan ke alur kerja?')) return
    try {
      await gateway.transition(slugAtStart, task.id, task.version, status, undefined, reopening); activityInvalidation.markDirty({ slug: slugAtStart })
      if (projectSlug.value !== slugAtStart) return
      await refreshColumns([task.status, status]); notifyTaskCountsChanged()
    } catch (cause) {
      if (projectSlug.value !== slugAtStart) return
      notice.value = getApiErrorStatus(cause) === 409 ? 'Task berubah. Board diperbarui dengan kondisi terbaru.' : getApiErrorMessage(cause, 'Status task belum dapat diubah.')
      await loadBoard()
    }
  }

  const remove = async () => {
    const slugAtStart = projectSlug.value
    const task = selectedTask.value
    if (!task?.permissions.delete || !globalThis.confirm('Hapus task ini? Riwayatnya tetap tersimpan.')) return
    try { await gateway.remove(slugAtStart, task.id, task.version); activityInvalidation.markDirty({ slug: slugAtStart }); if (projectSlug.value !== slugAtStart) return; dialogOpen.value = false; await refreshColumns([task.status]); notifyTaskCountsChanged() }
    catch (cause) {
      if (projectSlug.value !== slugAtStart) return
      mutationError.value = getApiErrorMessage(cause, 'Task belum dapat dihapus.')
      const status = getApiErrorStatus(cause)
      if (status === 404 || status === 409 || !status || status >= 500) await reconcileSelectedTask(task.id)
    }
  }

  const sendComment = async () => {
    const task = selectedTask.value; const body = taskForm.value.comment.trim()
    if (!task || !body || sendingComment.value) return
    const slugAtStart = projectSlug.value
    sendingComment.value = true; mutationError.value = null
    try {
      if (pendingCommentBody !== body || pendingCommentTaskId !== task.id) {
        pendingCommentBody = body; pendingCommentTaskId = task.id; pendingCommentKey = makeIdempotencyKey()
      }
      const commentKey = pendingCommentKey ?? makeIdempotencyKey()
      const comment = await gateway.createComment(slugAtStart, task.id, body, commentKey); activityInvalidation.markDirty({ slug: slugAtStart })
      if (projectSlug.value !== slugAtStart || selectedTask.value?.id !== task.id) return
      comments.value = [...comments.value, comment]
      selectedTask.value = { ...task, comment_count: task.comment_count + 1 }
      taskForm.value.comment = ''
      if (pendingCommentKey === commentKey) { pendingCommentBody = ''; pendingCommentTaskId = null; pendingCommentKey = null }
      commentsPage.value.total++
    } catch (cause) { if (projectSlug.value === slugAtStart && selectedTask.value?.id === task.id) mutationError.value = getApiErrorMessage(cause, 'Komentar belum dapat dikirim.') }
    finally { sendingComment.value = false }
  }

  const loadMoreComments = async () => {
    const task = selectedTask.value
    if (!task || commentsLoading.value || commentsPage.value.page >= commentsPage.value.totalPages) return
    commentsAbort?.abort()
    const controller = new AbortController()
    commentsAbort = controller
    const generation = detailGeneration
    const slugAtStart = projectSlug.value
    commentsLoading.value = true
    try {
      const next = await gateway.listComments(slugAtStart, task.id, commentsPage.value.page + 1, controller.signal)
      if (generation !== detailGeneration || controller.signal.aborted || projectSlug.value !== slugAtStart || selectedTask.value?.id !== task.id) return
      const known = new Set(comments.value.map((comment) => comment.id))
      comments.value = [...comments.value, ...next.data.filter((comment) => !known.has(comment.id))]
      commentsPage.value = { page: next.meta.page, total: next.meta.total, totalPages: next.meta.total_pages, error: null }
    } catch (cause) {
      if (generation === detailGeneration && !controller.signal.aborted && selectedTask.value?.id === task.id) commentsPage.value.error = getApiErrorMessage(cause, 'Komentar task belum dapat dimuat.')
    } finally {
      if (generation === detailGeneration) commentsLoading.value = false
    }
  }

  const closeDialog = () => { if (!saving.value && !sendingComment.value) { detailGeneration++; detailAbort?.abort(); commentsAbort?.abort(); commentsLoading.value = false; detailLoading.value = false; dialogOpen.value = false } }

  watch(slug, () => {
    memberGeneration++; memberAbort?.abort(); detailGeneration++; detailAbort?.abort(); commentsAbort?.abort()
    membersPromise = null; membersLoaded = false; membersLoading.value = false; membersError.value = null
    info.value = null; selectedTask.value = null; comments.value = []; commentsLoading.value = false; detailLoading.value = false; creatingTask.value = false; dialogOpen.value = false; members.value = []
    filter.value = initialFilterValue(); assigneeFilter.value = initialAssigneeValue(); query.value = ''; search.value = ''
    void loadBoard()
  }, { immediate: true })
  watch(currentUserId, () => {
    memberGeneration++; detailGeneration++; memberAbort?.abort(); detailAbort?.abort(); commentsAbort?.abort()
    memberAbort?.abort()
    membersPromise = null; membersLoaded = false; membersLoading.value = false; membersError.value = null
    info.value = null; members.value = []; selectedTask.value = null; comments.value = []; commentsLoading.value = false; detailLoading.value = false; creatingTask.value = false; dialogOpen.value = false
    filter.value = 'all'; assigneeFilter.value = null
    void loadBoard()
  })
  onScopeDispose(() => { listAbort?.abort(); detailAbort?.abort(); commentsAbort?.abort(); memberAbort?.abort(); if (searchTimer) clearTimeout(searchTimer) })

  return { info, tasks, pages, visibleColumns, filter, assigneeFilter, query, loading, boardLoaded, error, members, membersLoading, membersError, selectedTask, comments, commentsPage, commentsLoading, dialogOpen, detailLoading, creatingTask, saving, sendingComment, mutationError, notice, taskForm, projectTitle, projectStatus, currentUserId, canCreate, canManage, canSave, loadBoard, loadMembers, loadMore, loadMoreComments, changeFilter, setAssigneeFilter, filterByAssignee, setSearch, openCreate, openTask, save, changeStatus, remove, sendComment, closeDialog }
}

export const useWorkspaceTasks = (slug: Ref<string>, initialFilter: MaybeRef<WorkspaceTaskFilter> = 'all', initialAssignee: MaybeRef<string | null> = null) => createWorkspaceTasksController(slug, WorkspaceTaskService, initialFilter, initialAssignee)
