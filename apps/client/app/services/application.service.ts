import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiResponse } from '../types/api'
import type { Application } from '../types/project'

export const ApplicationService = {
  async getMyApplications() {
    const { $api } = useApi()
    return await $api<ApiResponse<Application[]>>(API_ENDPOINTS.APPLICATION.MY_APPLICATIONS)
  },

  async reviewApplication(
    applicationId: string,
    status: 'accepted' | 'rejected',
    reviewerNote?: string
  ) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      API_ENDPOINTS.APPLICATION.REVIEW(applicationId),
      {
        method: 'PATCH',
        body: { status, reviewer_note: reviewerNote }
      }
    )
  },

  async withdrawApplication(applicationId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      API_ENDPOINTS.APPLICATION.WITHDRAW(applicationId),
      {
        method: 'POST'
      }
    )
  }
}
