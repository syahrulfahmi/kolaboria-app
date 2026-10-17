import type { ApiPaginatedResponse } from './api'

export interface WorkspaceActivityDTO {
  id: string
  event_type: string
  occurred_at: string
  actor: {
    user_id: string
    membership_id: string | null
    display_name: string
    avatar: string | null
  }
  subject: {
    type: string
    id: string
    label: string
    availability: 'available' | 'deleted' | 'unavailable'
  }
  description: string
  changes?: {
    from_status?: string
    to_status?: string
    self_review?: boolean
  }
}

export type WorkspaceActivityPage = Pick<ApiPaginatedResponse<WorkspaceActivityDTO>, 'data' | 'meta'>

export interface WorkspaceActivityGateway {
  list(slug: string, page: number, limit: number, signal?: AbortSignal): Promise<WorkspaceActivityPage>
}

export interface CachedWorkspaceActivityPage {
  value: WorkspaceActivityPage
  fetchedAt: number
  revision: number
}

export type WorkspaceActivityCache = Record<string, CachedWorkspaceActivityPage>
