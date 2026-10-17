import { getApiErrorMessage } from '~/utils/error'
import { useApi } from '~/composables/useApi'
import { API_ENDPOINTS } from '~/constants/api-endpoints'
import type { ApiResponse } from '~/types/api'
import type { WorkspaceOverviewDTO, WorkspaceOverviewGateway } from '~/types/workspace-overview'

export const WorkspaceOverviewService: WorkspaceOverviewGateway = {
  async get(slug, signal) {
    const { $api } = useApi()
    const response = await $api<ApiResponse<WorkspaceOverviewDTO>>(API_ENDPOINTS.WORKSPACE.OVERVIEW(slug), { signal })
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Ringkasan workspace belum dapat dimuat.'))
    return response.data
  }
}
