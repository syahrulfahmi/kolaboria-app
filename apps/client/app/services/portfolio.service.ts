import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiResponse } from '../types/api'
import type { PortfolioItem, WorkHistory } from '../types/project'

export interface PortfolioPaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type PortfolioResponse = ApiResponse<PortfolioItem[]> & { meta?: PortfolioPaginationMeta }

export const PortfolioService = {
  async getPortfolio(params?: { is_pinned?: boolean; page?: number; limit?: number }) {
    const { $api } = useApi()
    return await $api<PortfolioResponse>(API_ENDPOINTS.PORTFOLIO.MY_PORTFOLIO, {
      query: params
    })
  },

  async getPublicPortfolio(username: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>(API_ENDPOINTS.PORTFOLIO.PUBLIC_PORTFOLIO(username))
  },

  async pinProject(payload: { projectId: string }) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.PORTFOLIO.MY_PORTFOLIO, {
      method: 'POST',
      body: payload
    })
  },

  async unpinProject(projectId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.PORTFOLIO.MY_PORTFOLIO_DETAIL(projectId), {
      method: 'DELETE'
    })
  },

  async getMyWorkHistory(projectId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<WorkHistory>>(
      API_ENDPOINTS.WORKSPACE.MY_HISTORY(projectId)
    )
  }
}
