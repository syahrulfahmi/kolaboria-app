import type { Ref } from 'vue'
import type {
  ActivityLog,
  CreateWorkspaceTaskPayload,
  MemberProfile,
  ReorderTaskUpdate,
  Task,
  TaskComment,
  TaskStatus,
  UpdateTaskPayload,
  WorkspaceOverview
} from '../types/workspace'
import { WorkspaceService } from '../services/workspace.service'
import { useProjectDeliverables } from './useProjectDeliverables'

const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

export const useWorkspace = (projectId: Ref<string | null | undefined>) => {
  const { user, currentUserId } = useAuth()
  const toast = useToast()

  const tasks = ref<Task[]>([])
  const activities = ref<ActivityLog[]>([])
  const overview = ref<WorkspaceOverview | null>(null)
  const members = ref<MemberProfile[]>([])
  const comments = ref<TaskComment[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const commentsLoading = ref(false)
  const error = ref<string | null>(null)
  const evidence = useProjectDeliverables(projectId)

  const sortByPosition = (items: Task[]) =>
    [...items].sort((a, b) => Number(a.position) - Number(b.position))

  const tasksByStatus = computed<Record<TaskStatus, Task[]>>(() => ({
    todo: sortByPosition(tasks.value.filter((task) => task.status === 'todo')),
    in_progress: sortByPosition(
      tasks.value.filter((task) => task.status === 'in_progress')
    ),
    review: sortByPosition(
      tasks.value.filter((task) => task.status === 'review')
    ),
    done: sortByPosition(tasks.value.filter((task) => task.status === 'done'))
  }))

  const requireProjectId = () => {
    if (!projectId.value) throw new Error('Project belum siap.')
    return projectId.value
  }

  const requireUserId = () => {
    if (!currentUserId.value) throw new Error('Kamu harus login.')
    return currentUserId.value
  }

  const buildOverview = (): WorkspaceOverview => {
    const today = new Date().toISOString().slice(0, 10)
    return {
      totalTasks: tasks.value.length,
      completedTasks: tasks.value.filter((task) => task.status === 'done')
        .length,
      inProgressTasks: tasks.value.filter(
        (task) => task.status === 'in_progress'
      ).length,
      overdueTasks: tasks.value.filter(
        (task) =>
          Boolean(task.due_date) &&
          task.due_date! < today &&
          task.status !== 'done'
      ).length,
      memberCount: members.value.length
    }
  }

  const refreshOverview = () => {
    overview.value = buildOverview()
  }

  const fetchTasks = async () => {
    loading.value = true
    error.value = null

    try {
      tasks.value = await WorkspaceService.getTasks(requireProjectId())
      refreshOverview()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat task.'
      toast.error('Gagal memuat workspace.')
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchActivities = async (limit = 20) => {
    activities.value = await WorkspaceService.getActivityLogs(
      requireProjectId(),
      limit
    )
  }

  const fetchMembers = async (creatorId: string) => {
    members.value = await WorkspaceService.getWorkspaceMembers(
      requireProjectId(),
      creatorId
    )
    refreshOverview()
  }

  const fetchOverview = async () => {
    refreshOverview()
  }

  const createTask = async (payload: CreateWorkspaceTaskPayload) => {
    const userId = requireUserId()
    const status = payload.status ?? 'todo'
    const position = payload.position ?? tasksByStatus.value[status].length + 1

    saving.value = true
    try {
      const created = await WorkspaceService.createTask({
        ...payload,
        created_by: userId,
        status,
        position,
        project_id: requireProjectId()
      })

      tasks.value.push(created)
      await fetchActivities()
      refreshOverview()
      toast.success('Task berhasil dibuat.')
      return created
    } catch (err) {
      toast.error('Gagal membuat task.')
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateTask = async (taskId: string, payload: UpdateTaskPayload) => {
    const index = tasks.value.findIndex((task) => task.id === taskId)
    if (index === -1) return

    const current = tasks.value[index]
    if (!current) return

    const previous = { ...current }
    tasks.value[index] = { ...current, ...payload }
    saving.value = true

    try {
      const updated = await WorkspaceService.updateTask(taskId, payload)
      tasks.value[index] = updated
      await fetchActivities()
      refreshOverview()
    } catch (err) {
      tasks.value[index] = previous
      toast.error('Gagal menyimpan perubahan task.')
      throw err
    } finally {
      saving.value = false
    }
  }

  const applyReorder = (updates: ReorderTaskUpdate[]) => {
    for (const update of updates) {
      const task = tasks.value.find((item) => item.id === update.id)
      if (task) {
        task.status = update.status
        task.position = update.position
      }
    }
  }

  const reorderTasks = async (updates: ReorderTaskUpdate[]) => {
    const changedUpdates = updates.filter((update) => {
      const task = tasks.value.find((item) => item.id === update.id)
      return (
        task &&
        (task.status !== update.status ||
          Number(task.position) !== Number(update.position))
      )
    })

    if (changedUpdates.length === 0) return

    const previous = tasks.value.map((task) => ({ ...task }))
    applyReorder(changedUpdates)
    saving.value = true

    try {
      await WorkspaceService.reorderTasks(changedUpdates)
      const moved = changedUpdates.find((update) => {
        const oldTask = previous.find((task) => task.id === update.id)
        return oldTask && oldTask.status !== update.status
      })

      if (moved) {
        await fetchActivities()
      }

      refreshOverview()
    } catch (err) {
      tasks.value = previous
      toast.error('Gagal memindahkan task.')
      throw err
    } finally {
      saving.value = false
    }
  }

  const moveTask = async (
    taskId: string,
    newStatus: TaskStatus,
    newPosition: number
  ) => {
    await reorderTasks([
      { id: taskId, status: newStatus, position: newPosition }
    ])
  }

  const deleteTask = async (taskId: string) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task) return

    const previous = [...tasks.value]
    tasks.value = tasks.value.filter((item) => item.id !== taskId)
    saving.value = true

    try {
      await WorkspaceService.deleteTask(taskId)
      await fetchActivities()
      refreshOverview()
    } catch (err) {
      tasks.value = previous
      toast.error('Gagal menghapus task.')
      throw err
    } finally {
      saving.value = false
    }
  }

  const fetchTaskComments = async (taskId: string) => {
    commentsLoading.value = true
    try {
      comments.value = await WorkspaceService.getTaskComments(taskId)
    } finally {
      commentsLoading.value = false
    }
  }

  const addComment = async (taskId: string, body: string) => {
    const trimmedBody = body.trim()
    if (!trimmedBody) return

    const userId = requireUserId()
    saving.value = true
    try {
      const comment = await WorkspaceService.addComment(
        taskId,
        userId,
        trimmedBody
      )
      comments.value.push(comment)
      await fetchActivities()
    } catch (err) {
      toast.error('Gagal mengirim komentar.')
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteComment = async (commentId: string) => {
    const previous = [...comments.value]
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId
    )

    try {
      await WorkspaceService.deleteComment(commentId)
    } catch (err) {
      comments.value = previous
      toast.error('Gagal menghapus komentar.')
      throw err
    }
  }

  const updateComment = async (commentId: string, body: string) => {
    const trimmedBody = body.trim()
    if (!trimmedBody) return

    const previous = [...comments.value]
    const index = comments.value.findIndex((c) => c.id === commentId)
    const current = index === -1 ? undefined : comments.value[index]
    if (current) {
      comments.value[index] = { ...current, body: trimmedBody }
    }

    saving.value = true
    try {
      const updated = await WorkspaceService.updateComment(commentId, trimmedBody)
      if (index !== -1) {
        comments.value[index] = updated
      }
    } catch (err) {
      comments.value = previous
      toast.error('Gagal memperbarui komentar.')
      throw err
    } finally {
      saving.value = false
    }
  }


  const refreshWorkspace = async (creatorId: string) => {
    loading.value = true
    try {
      await Promise.all([
        fetchTasks(),
        fetchMembers(creatorId),
        fetchActivities(),
        evidence.load()
      ])
      refreshOverview()
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    tasksByStatus,
    activities,
    overview,
    members,
    comments,
    loading,
    saving,
    commentsLoading,
    error,
    fetchTasks,
    fetchActivities,
    fetchOverview,
    fetchMembers,
    createTask,
    updateTask,
    moveTask,
    reorderTasks,
    deleteTask,
    fetchTaskComments,
    addComment,
    deleteComment,
    updateComment,
    refreshWorkspace,
    deliverables: evidence.deliverables,
    snapshots: evidence.snapshots,
    finalizationStatus: evidence.finalizationStatus,
    evidenceLoading: evidence.loading,
    evidenceSaving: evidence.saving,
    evidenceError: evidence.error,
    createDeliverable: evidence.create,
    updateDeliverable: evidence.update,
    deleteDeliverable: evidence.remove,
    refreshFinalization: evidence.refreshFinalization
  }
}
