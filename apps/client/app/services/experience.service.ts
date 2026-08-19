import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'
import type {
  ExperienceCard,
  ExperienceDetail,
  ExperienceHighlight,
  ExperienceReflection,
  ExperienceVisibility
} from '../types/experience'

export const ExperienceService = {
  async listMine() {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceCard[]>>('/experiences/me')
    return r.data ?? []
  },
  async getById(id: string) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceDetail>>(`/experiences/${id}`)
    return r.data
  },
  async getPublic(username: string, slug: string) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceDetail>>(
      `/experiences/public/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`
    )
    return r.data
  },
  async updateVisibility(id: string, visibility: ExperienceVisibility) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/experiences/${id}/visibility`, {
      method: 'PATCH',
      body: { visibility }
    })
  },
  async upsertReflection(id: string, body: string) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/experiences/${id}/reflection`, {
      method: 'PUT',
      body: { body }
    })
  },
  async deleteReflection(id: string) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/experiences/${id}/reflection`, {
      method: 'DELETE'
    })
  },
  async listHighlights(id: string) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceHighlight[]>>(
      `/experiences/${id}/highlights`
    )
    return r.data ?? []
  },
  async addHighlight(
    id: string,
    payload: {
      source_type: 'task' | 'deliverable'
      source_id: string
      description?: string
      display_order?: number
    }
  ) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceHighlight>>(
      `/experiences/${id}/highlights`,
      { method: 'POST', body: payload }
    )
    return r.data
  },
  async updateHighlight(
    id: string,
    highlightId: string,
    payload: { description?: string; display_order?: number }
  ) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(
      `/experiences/${id}/highlights/${highlightId}`,
      { method: 'PATCH', body: payload }
    )
  },
  async deleteHighlight(id: string, highlightId: string) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(
      `/experiences/${id}/highlights/${highlightId}`,
      { method: 'DELETE' }
    )
  },
  async trackEvent(
    id: string,
    event_type: string,
    metadata?: Record<string, string>
  ) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(`/experiences/${id}/events`, {
      method: 'POST',
      body: { event_type, metadata }
    })
  }
}
