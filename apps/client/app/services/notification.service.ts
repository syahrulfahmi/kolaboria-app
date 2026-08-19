import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'
import type { AppNotification } from '../types/notification'

export const NotificationService = {
  async list(limit = 50): Promise<AppNotification[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<AppNotification[]>>('/notifications', { params: { limit } })
    return res.data ?? []
  },
  async markRead(id: string): Promise<void> {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/notifications/${id}/read`, { method: 'PATCH' })
  }
}
