import { API_ENDPOINTS } from '~/constants/api-endpoints'
import { useApi } from '~/composables/useApi'
import type { ApiPaginatedResponse } from '~/types/api'
import type { WorkspaceActivityDTO, WorkspaceActivityGateway } from '~/types/workspace-activity'
import { getApiErrorMessage } from '~/utils/error'

export const WorkspaceActivityService: WorkspaceActivityGateway = {
  async list(slug, page, limit, signal) {
    const { $api } = useApi()
    const response = await $api<ApiPaginatedResponse<WorkspaceActivityDTO>>(
      API_ENDPOINTS.WORKSPACE.ACTIVITY_LIST(slug),
      { query: { page, limit }, signal }
    )
    if (!Array.isArray(response.data) || !response.meta || response.meta.page !== page ||
      response.meta.limit !== limit || !Number.isInteger(response.meta.total) || response.meta.total < 0 ||
      !Number.isInteger(response.meta.total_pages) || response.meta.total_pages < 0) {
      throw new Error(getApiErrorMessage(response, 'Daftar aktivitas belum dapat dimuat.'))
    }
    return { data: response.data, meta: response.meta }
  }
}
