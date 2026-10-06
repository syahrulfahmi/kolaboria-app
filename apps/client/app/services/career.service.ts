import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiResponse } from '../types/api'
import type { CareerHistoryRequest, CareerHistoryResponse } from '../types/profile-api'

export type CareerPayload = CareerHistoryRequest

export const CareerService = {
  async getMyCareerHistories() {
    const { $api } = useApi()
    return await $api<ApiResponse<CareerHistoryResponse[]>>(API_ENDPOINTS.CAREER.MY_CAREERS)
  },

  async getPublicCareers(username: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<CareerHistoryResponse[]>>(API_ENDPOINTS.CAREER.PUBLIC_CAREERS(username))
  },

  async createCareerHistory(payload: CareerPayload) {
    const { $api } = useApi()
    return await $api<ApiResponse<CareerHistoryResponse>>(API_ENDPOINTS.CAREER.MY_CAREERS, {
      method: 'POST',
      body: payload
    })
  },

  async updateCareerHistory(id: string, payload: CareerPayload) {
    const { $api } = useApi()
    return await $api<ApiResponse<CareerHistoryResponse>>(API_ENDPOINTS.CAREER.MY_CAREER_DETAIL(id), {
      method: 'PUT',
      body: payload
    })
  },

  async deleteCareerHistory(id: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.CAREER.MY_CAREER_DETAIL(id), {
      method: 'DELETE'
    })
  }
}
