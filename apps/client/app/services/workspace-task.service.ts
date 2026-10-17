import { API_ENDPOINTS } from '~/constants/api-endpoints'
import { useApi } from '~/composables/useApi'
import type { ApiPaginatedResponse, ApiResponse } from '~/types/api'
import { getApiErrorMessage } from '~/utils/error'
import type {
  CreateWorkspaceTaskInput,
  UpdateWorkspaceTaskInput,
  WorkspaceTaskCommentDTO,
  WorkspaceTaskCommentPageDTO,
  WorkspaceTaskDTO,
  WorkspaceTaskGateway,
  WorkspaceTaskListQuery,
  WorkspaceTaskPageDTO
} from '~/types/workspace-task'

export const WorkspaceTaskService: WorkspaceTaskGateway = {
  async list(slug: string, query: WorkspaceTaskListQuery, signal?: AbortSignal): Promise<WorkspaceTaskPageDTO> {
    const { $api } = useApi()
    const response = await $api<ApiPaginatedResponse<WorkspaceTaskDTO>>(API_ENDPOINTS.WORKSPACE.TASK_LIST(slug), { query, signal })
    if (!Array.isArray(response.data) || !response.meta) throw new Error(getApiErrorMessage(response, 'Daftar task belum dapat dimuat.'))
    return { data: response.data, meta: response.meta }
  },

  async get(slug: string, taskId: string, signal?: AbortSignal): Promise<WorkspaceTaskDTO> {
    const { $api } = useApi()
    const response = await $api<ApiResponse<WorkspaceTaskDTO>>(API_ENDPOINTS.WORKSPACE.TASK_ITEM(slug, taskId), { signal })
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Detail task belum dapat dimuat.'))
    return response.data
  },

  async create(slug: string, input: CreateWorkspaceTaskInput, idempotencyKey: string): Promise<WorkspaceTaskDTO> {
    const { $api } = useApi()
    const response = await $api<ApiResponse<WorkspaceTaskDTO>>(API_ENDPOINTS.WORKSPACE.TASK_LIST(slug), {
      method: 'POST', body: input, headers: { 'Idempotency-Key': idempotencyKey }
    })
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Task belum dapat dibuat.'))
    return response.data
  },

  async update(slug: string, taskId: string, input: UpdateWorkspaceTaskInput): Promise<WorkspaceTaskDTO> {
    const { $api } = useApi()
    const response = await $api<ApiResponse<WorkspaceTaskDTO>>(API_ENDPOINTS.WORKSPACE.TASK_ITEM(slug, taskId), { method: 'PATCH', body: input })
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Task belum dapat disimpan.'))
    return response.data
  },

  async transition(slug: string, taskId: string, version: number, status: WorkspaceTaskDTO['status'], closeReason?: string, reopenConfirmed = false): Promise<WorkspaceTaskDTO> {
    const { $api } = useApi()
    const response = await $api<ApiResponse<WorkspaceTaskDTO>>(API_ENDPOINTS.WORKSPACE.TASK_TRANSITIONS(slug, taskId), {
      method: 'POST', body: { version, to_status: status, close_reason: closeReason, reopen_confirmed: reopenConfirmed }
    })
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Status task belum dapat diubah.'))
    return response.data
  },

  async remove(slug: string, taskId: string, version: number): Promise<void> {
    const { $api } = useApi()
    await $api<ApiResponse<unknown>>(API_ENDPOINTS.WORKSPACE.TASK_ITEM(slug, taskId), { method: 'DELETE', query: { version } })
  },

  async listComments(slug: string, taskId: string, page: number, signal?: AbortSignal): Promise<WorkspaceTaskCommentPageDTO> {
    const { $api } = useApi()
    const response = await $api<ApiPaginatedResponse<WorkspaceTaskCommentDTO>>(API_ENDPOINTS.WORKSPACE.TASK_COMMENT_LIST(slug, taskId), { query: { page, limit: 20 }, signal })
    if (!Array.isArray(response.data) || !response.meta) throw new Error(getApiErrorMessage(response, 'Komentar task belum dapat dimuat.'))
    return { data: response.data, meta: response.meta }
  },

  async createComment(slug: string, taskId: string, body: string, idempotencyKey: string): Promise<WorkspaceTaskCommentDTO> {
    const { $api } = useApi()
    const response = await $api<ApiResponse<WorkspaceTaskCommentDTO>>(API_ENDPOINTS.WORKSPACE.TASK_COMMENT_LIST(slug, taskId), {
      method: 'POST', body: { body }, headers: { 'Idempotency-Key': idempotencyKey }
    })
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Komentar belum dapat dikirim.'))
    return response.data
  }
}
