import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'

export interface CareerPayload {
  title: string
  company: string
  startYear: number
  endYear?: number | null
  description?: string | null
}

export const CareerService = {
  async getMyCareerHistories() {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('profiles/me/careers')
  },

  async createCareerHistory(payload: CareerPayload) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>('profiles/me/careers', {
      method: 'POST',
      body: payload
    })
  },

  async updateCareerHistory(id: string, payload: CareerPayload) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>(`profiles/me/careers/${id}`, {
      method: 'PUT',
      body: payload
    })
  },

  async deleteCareerHistory(id: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`profiles/me/careers/${id}`, {
      method: 'DELETE'
    })
  }
}
