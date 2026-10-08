import type { ProjectCategory, ProjectStatus, ProjectVisibility } from '~/types/project'
import type { Tool } from '~/types/skill'
import type { SystemRole } from '~/types/auth'

export type ProjectEditorMode = 'create' | 'edit'
export type ProjectCreationMode = 'personal' | 'organization_initiated'
export interface ProjectEditorCreationContext {
  system_role: SystemRole
  initiable_organizations: Array<{ id: string; name: string }>
}
export interface ProjectEditorOwnership {
  created_by_user_id: string
  initiator_user_id: string | null
  initiator_organization_id: string | null
  owner_id: string | null
  show_initiator: boolean
  can_accept_contributors: boolean
}
export type ProjectEditorStep = 0 | 1 | 2 | 3 | 4
export type ProjectOrigin = 'personal' | 'community' | 'experiment' | 'client'
export type ProjectEditorAvailability = 'flexible' | 'part_time' | 'weekends_only' | 'full_time'
export type ProjectEditorHours = 5 | 10 | 15 | 20

export interface ProjectEditorRole {
  client_key: string
  id?: string
  contribution_role_id?: string
  custom_title?: string
  description: string
  capacity: number
  filled_capacity: number
  tool_ids: string[]
  skill_tags: string[]
}

export interface ProjectEditorDraft {
  creation_mode: ProjectCreationMode
  initiator_organization_id: string | null
  title: string
  summary: string
  description: string
  slug: string
  project_category: ProjectCategory
  visibility: ProjectVisibility
  roles: ProjectEditorRole[]
  tool_ids: string[]
  owner_contribution_role_id?: string
  owner_custom_role_title?: string
  origin: ProjectOrigin
  why_collaborative: string
  contributor_outcome: string
  owner_commitment: string
  lead_expectations: string
  client_acknowledgement: boolean
  start_date: string | null
  deadline: string | null
  availability: ProjectEditorAvailability
  hours_per_week: ProjectEditorHours
  collaboration_agreement: boolean
}

export interface ProjectEditorRoleOption {
  id: string
  name: string
  slug: string
  category?: string | null
}

export interface ProjectEditorReferences {
  contribution_roles: ProjectEditorRoleOption[]
  tools: Tool[]
  skill_suggestions: string[]
}

export interface ProjectEditorRecord {
  id: string
  slug: string
  status: ProjectStatus | 'awaiting_owner'
  ownership?: ProjectEditorOwnership
  draft: ProjectEditorDraft
  saved_at: string
  version: 1
}

export type ProjectEditorErrors = Record<string, string>

export interface ProjectEditorEligibility {
  email_verified: boolean
  onboarding_completed: boolean
}

export interface ProjectEditorOptions {
  mode: ProjectEditorMode
  slug?: string
  currentUserId: string
  references: ProjectEditorReferences
  initialRecord?: ProjectEditorRecord | null
  initialDraft?: ProjectEditorDraft
  eligibility?: ProjectEditorEligibility
  creationContext?: ProjectEditorCreationContext
  contextAvailable?: () => boolean
  storageScope?: string
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null
  delayMs?: number
}
