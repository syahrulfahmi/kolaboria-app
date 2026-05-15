import type { Ref } from 'vue'
import type {
  ActivityLog,
  CreateWorkspaceTaskPayload,
  LogActivityPayload,
  MemberProfile,
  ReorderTaskUpdate,
  Task,
  TaskComment,
  TaskStatus,
  UpdateTaskPayload,
  WorkspaceOverview
} from '../types/workspace'
import { WorkspaceService } from '../services/workspace.service'

const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

export const useWorkspace = (projectId: Ref<string | null | undefined>) => {
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()
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
    if (!user.value) throw new Error('Kamu harus login.')
    return user.value.id
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
      tasks.value = await WorkspaceService.getTasks(client, requireProjectId())
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
      client,
      requireProjectId(),
      limit
    )
  }

  const fetchMembers = async (creatorId: string) => {
    members.value = await WorkspaceService.getWorkspaceMembers(
      client,
      requireProjectId(),
      creatorId
    )
    refreshOverview()
  }

  const fetchOverview = async () => {
    refreshOverview()
  }

  const logActivity = async (payload: Omit<LogActivityPayload, 'project_id' | 'actor_id'>) => {
    await WorkspaceService.logActivity(client, {
      project_id: requireProjectId(),
      actor_id: requireUserId(),
      ...payload
    })
  }

  const createTask = async (payload: CreateWorkspaceTaskPayload) => {
    const userId = requireUserId()
    const status = payload.status ?? 'todo'
    const position =
      payload.position ?? tasksByStatus.value[status].length + 1

    saving.value = true
    try {
      const created = await WorkspaceService.createTask(client, {
        ...payload,
        created_by: userId,
        status,
        position,
        project_id: requireProjectId()
      })

      tasks.value.push(created)
      await logActivity({
        action: 'task.created',
        entity_type: 'task',
        entity_id: created.id,
        metadata: { title: created.title, created_by: userId }
      })
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

    const previous = { ...tasks.value[index] }
    tasks.value[index] = { ...tasks.value[index], ...payload }
    saving.value = true

    try {
      const updated = await WorkspaceService.updateTask(client, taskId, payload)
      tasks.value[index] = updated
      await logActivity({
        action: payload.assignee_id !== undefined ? 'task.assigned' : 'task.updated',
        entity_type: 'task',
        entity_id: taskId,
        metadata: { title: updated.title }
      })
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
      await WorkspaceService.reorderTasks(client, changedUpdates)
      const moved = changedUpdates.find((update) => {
        const oldTask = previous.find((task) => task.id === update.id)
        return oldTask && oldTask.status !== update.status
      })

      if (moved) {
        const oldTask = previous.find((task) => task.id === moved.id)
        await logActivity({
          action: 'task.moved',
          entity_type: 'task',
          entity_id: moved.id,
          metadata: {
            from_status: oldTask?.status,
            to_status: moved.status
          }
        })
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
    await reorderTasks([{ id: taskId, status: newStatus, position: newPosition }])
  }

  const deleteTask = async (taskId: string) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task) return

    const previous = [...tasks.value]
    tasks.value = tasks.value.filter((item) => item.id !== taskId)
    saving.value = true

    try {
      await WorkspaceService.deleteTask(client, taskId)
      await logActivity({
        action: 'task.deleted',
        entity_type: 'task',
        entity_id: taskId,
        metadata: { title: task.title }
      })
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
      comments.value = await WorkspaceService.getTaskComments(client, taskId)
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
        client,
        taskId,
        userId,
        trimmedBody
      )
      comments.value.push(comment)
      await logActivity({
        action: 'comment.added',
        entity_type: 'comment',
        entity_id: comment.id,
        metadata: { task_id: taskId }
      })
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
    comments.value = comments.value.filter((comment) => comment.id !== commentId)

    try {
      await WorkspaceService.deleteComment(client, commentId)
    } catch (err) {
      comments.value = previous
      toast.error('Gagal menghapus komentar.')
      throw err
    }
  }

  const refreshWorkspace = async (creatorId: string) => {
    loading.value = true
    try {
      await Promise.all([fetchTasks(), fetchMembers(creatorId), fetchActivities()])
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
    refreshWorkspace
  }
}
