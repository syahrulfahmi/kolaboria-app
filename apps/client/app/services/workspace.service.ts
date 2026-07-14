import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'
import type {
  ActivityLog,
  CreateTaskPayload,
  LogActivityPayload,
  MemberProfile,
  ReorderTaskUpdate,
  Task,
  TaskComment,
  UpdateTaskPayload
} from '../types/workspace'
import type { WorkHistory } from '../types/project'
export const WorkspaceService = {
  async getTasks(projectId: string): Promise<Task[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<Task[]>>(
      `/projects/${projectId}/workspace/tasks`
    )
    return res.data ?? []
  },
  async createTask(
    payload: CreateTaskPayload & { created_by: string }
  ): Promise<Task> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<Task>>(
      `/projects/${payload.project_id}/workspace/tasks`,
      {
        method: 'POST',
        body: payload
      }
    )
    return res.data
  },
  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<Task>>(
      `/projects/workspace/tasks/${taskId}`,
      {
        method: 'PATCH',
        body: payload
      }
    )
    return res.data
  },
  async deleteTask(taskId: string): Promise<void> {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/projects/workspace/tasks/${taskId}`, {
      method: 'DELETE'
    })
  },
  async reorderTasks(updates: ReorderTaskUpdate[]): Promise<void> {
    const { $api } = useApi()
    await $api<ApiResponse<null>>('/projects/workspace/tasks/reorder', {
      method: 'PATCH',
      body: { updates }
    })
  },
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<TaskComment[]>>(
      `/projects/workspace/tasks/${taskId}/comments`
    )
    return res.data ?? []
  },
  async addComment(
    taskId: string,
    authorId: string,
    body: string
  ): Promise<TaskComment> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<TaskComment>>(
      `/projects/workspace/tasks/${taskId}/comments`,
      {
        method: 'POST',
        body: { body }
      }
    )
    return res.data
  },
  async deleteComment(commentId: string): Promise<void> {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/projects/workspace/comments/${commentId}`, {
      method: 'DELETE'
    })
  },
  async updateComment(commentId: string, body: string): Promise<TaskComment> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<TaskComment>>(
      `/projects/workspace/comments/${commentId}`,
      {
        method: 'PATCH',
        body: { body }
      }
    )
    return res.data
  },
  async getActivityLogs(projectId: string, limit = 20): Promise<ActivityLog[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<ActivityLog[]>>(
      `/projects/${projectId}/workspace/activities`,
      {
        params: { limit }
      }
    )
    return res.data ?? []
  },
  async logActivity(payload: LogActivityPayload): Promise<void> {
    // No-op because backend automatically records activity logs on task / comment updates
  },
  async getWorkspaceMembers(
    projectId: string,
    creatorId: string
  ): Promise<MemberProfile[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<MemberProfile[]>>(
      `/projects/${projectId}/workspace/members`
    )
    return res.data ?? []
  },
  async getMyWorkHistory(projectId: string): Promise<WorkHistory> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<WorkHistory>>(
      `/projects/${projectId}/workspace/my-history`
    )
    // Because the response can be undefined when data is empty
    return res.data ?? { activities: [], my_tasks: [] }
  }
}
