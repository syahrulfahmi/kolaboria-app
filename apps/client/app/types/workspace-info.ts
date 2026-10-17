import type { ProjectStatus } from './project'

export interface WorkspaceProjectTaskSummary {
  version: number
  total_tasks: number
  done_tasks: number
  closed_tasks: number
  outstanding_tasks: number
  deleted_tasks: number
  invalid_closed_tasks: number
}

export interface WorkspaceProjectCompletion {
  id: string
  completed_at: string
  completed_by: string
  result_summary: string
  review_basis: string
  project_version: number
  task_summary: WorkspaceProjectTaskSummary
}

export interface CompleteWorkspaceProjectInput {
  version: number
  task_version: number
  result_summary: string
  review_basis: string
}

export interface WorkspaceProjectClosure {
  task_summary: WorkspaceProjectTaskSummary
  eligible: boolean
  completion: WorkspaceProjectCompletion | null
}

export interface WorkspaceProjectProfile {
  id: string
  username: string
  full_name: string | null
  headline?: string | null
  avatar?: string | null
  is_verified?: boolean
}

export interface WorkspaceProjectOrganization {
  id: string
  name: string
  slug: string
}

export interface WorkspaceProjectInfoDTO {
  // Older Info responses may not include the completion contract yet.
  closure?: WorkspaceProjectClosure | null
  project: {
    id: string
    slug: string
    version: number
    status: ProjectStatus
    title: string
    summary: string
    description: string
    project_category: string
    creation_mode: 'personal' | 'organization_initiated'
    initiator_organization_id: string | null
    start_date: string | null
    deadline: string | null
    ownership: {
      owner_id: string | null
      owner_profile: WorkspaceProjectProfile | null
      initiator_organization_id: string | null
      initiator_organization: WorkspaceProjectOrganization | null
      initiator_profile: WorkspaceProjectProfile | null
      show_initiator: boolean
    }
  }
  positions: Array<{
    id: string
    name: string
    description: string
    capacity: number
    active_contributor_count: number
    remaining_capacity: number
    recruitment_status: 'open' | 'filled'
    readiness_state: 'ready' | 'to_fill'
  }>
  position_capacity_summary: {
    all_positions_filled: boolean
    underfilled_position_count: number
    total_remaining_capacity: number
  }
  viewer: {
    scope: 'owner' | 'organization_initiator' | 'member'
    membership_id?: string | null
    capabilities: {
      can_view_info: boolean
      can_start_project: boolean
      can_manage_workspace: boolean
      can_create_task?: boolean
      can_complete_project?: boolean
    }
  }
}

export interface WorkspaceProjectInfoViewModel {
  closure: WorkspaceProjectClosure | null
  canCompleteProject: boolean
  project: {
    id: string
    slug: string
    version: number
    status: ProjectStatus
    statusLabel: string
    title: string
    summary: string
    description: string
    projectCategory: string
    startDateLabel: string
    deadlineLabel: string
    ownerName: string
    initiatorOrganizationName: string | null
    initiatorPersonName: string | null
  }
  positions: Array<{
    id: string
    name: string
    description: string
    capacity: number
    activeContributorCount: number
    occupancyLabel: string
    remainingCapacity: number
    recruitmentStatus: 'open' | 'filled'
    readinessState: 'ready' | 'to_fill'
    readinessLabel: 'Siap' | 'Masih perlu diisi'
  }>
  positionCapacitySummary: {
    allPositionsFilled: boolean
    underfilledPositionCount: number
    totalRemainingCapacity: number
  }
  viewerScope: WorkspaceProjectInfoDTO['viewer']['scope']
  canStartProject: boolean
  canManageWorkspace: boolean
}
