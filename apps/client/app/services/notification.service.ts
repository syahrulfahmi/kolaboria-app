import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiResponse } from '../types/api'
import type { AppNotification } from '../types/notification'

export const NotificationService = {
  async list(limit = 50): Promise<AppNotification[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<AppNotification[]>>(
      API_ENDPOINTS.NOTIFICATION.LIST,
      {
        query: { limit }
      }
    )
    return res.data ?? []
  },

  async markRead(id: string): Promise<void> {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(API_ENDPOINTS.NOTIFICATION.MARK_READ(id), {
      method: 'PATCH'
    })
  }
}
