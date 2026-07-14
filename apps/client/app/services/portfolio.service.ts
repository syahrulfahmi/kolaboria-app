import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'
import type { PortfolioItem } from '../types/project'
export const PortfolioService = {
  async getPortfolio(params?: { is_pinned?: boolean; page?: number; limit?: number }) {
    const { $api } = useApi()
    return await $api<ApiResponse<PortfolioItem[]> & { meta: { page: number; limit: number; total: number; total_pages: number } }>('profiles/me/portfolio', {
      query: params
    })
  },
  async pinProject(payload: { projectId: string }) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>('profiles/me/portfolio', {
      method: 'POST',
      body: payload
    })
  },
  async unpinProject(projectId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`profiles/me/portfolio/${projectId}`, {
      method: 'DELETE'
    })
  },
  async getMyWorkHistory(projectId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<import('../types/project').WorkHistory>>(
      `/projects/${projectId}/workspace/my-history`
    )
  }
}
