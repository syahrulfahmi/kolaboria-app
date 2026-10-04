import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiResponse } from '../types/api'
import type {
  ExperienceCard,
  ExperienceDetail,
  ExperienceHighlight,
  ExperienceVisibility
} from '../types/experience'

export const ExperienceService = {
  async listMine() {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceCard[]>>(API_ENDPOINTS.EXPERIENCE.LIST_MINE)
    return r.data ?? []
  },

  async getById(id: string) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceDetail>>(API_ENDPOINTS.EXPERIENCE.DETAIL(id))
    return r.data
  },

  async getPublic(username: string, slug: string) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceDetail>>(
      API_ENDPOINTS.EXPERIENCE.PUBLIC(username, slug)
    )
    return r.data
  },

  async updateVisibility(id: string, visibility: ExperienceVisibility) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(API_ENDPOINTS.EXPERIENCE.VISIBILITY(id), {
      method: 'PATCH',
      body: { visibility }
    })
  },

  async upsertReflection(id: string, body: string) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(API_ENDPOINTS.EXPERIENCE.REFLECTION(id), {
      method: 'PUT',
      body: { body }
    })
  },

  async deleteReflection(id: string) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(API_ENDPOINTS.EXPERIENCE.REFLECTION(id), {
      method: 'DELETE'
    })
  },

  async listHighlights(id: string) {
    const { $api } = useApi()
    const r = await $api<ApiResponse<ExperienceHighlight[]>>(
      API_ENDPOINTS.EXPERIENCE.HIGHLIGHTS(id)
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
      API_ENDPOINTS.EXPERIENCE.HIGHLIGHTS(id),
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
      API_ENDPOINTS.EXPERIENCE.HIGHLIGHT_DETAIL(id, highlightId),
      { method: 'PATCH', body: payload }
    )
  },

  async deleteHighlight(id: string, highlightId: string) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(
      API_ENDPOINTS.EXPERIENCE.HIGHLIGHT_DETAIL(id, highlightId),
      { method: 'DELETE' }
    )
  },

  async trackEvent(
    id: string,
    event_type: string,
    metadata?: Record<string, string>
  ) {
    const { $api } = useApi()
    await $api<ApiResponse<null>>(API_ENDPOINTS.EXPERIENCE.EVENTS(id), {
      method: 'POST',
      body: { event_type, metadata }
    })
  }
}
