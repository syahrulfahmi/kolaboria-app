import type { WorkspaceActivityDTO } from './workspace-activity'
import type { ProjectStatus } from './project'
import type { WorkspaceTaskPriority, WorkspaceTaskStatus } from './workspace-task'

export interface WorkspaceOverviewDTO {
  project: { id: string; slug: string; title: string; status: ProjectStatus; version: number }
  viewer: {
    scope: 'owner' | 'member' | 'organization_initiator'
    membership_id: string | null
    capabilities: { can_manage_workspace: boolean; can_create_task: boolean }
  }
  task_summary: {
    total_tasks: number
    todo_tasks: number
    in_progress_tasks: number
    review_tasks: number
    done_tasks: number
    closed_tasks: number
    outstanding_tasks: number
  }
  team_summary: { active_member_count: number }
  my_tasks: Array<{ id: string; title: string; status: WorkspaceTaskStatus; priority: WorkspaceTaskPriority; due_date: string | null }>
  recent_discussions: Array<{
    id: string
    title: string
    author: { id: string; name: string; avatar_url?: string | null }
    created_at: string
    last_activity_at: string
  }> | null
  recent_activities: WorkspaceActivityDTO[]
}

export interface WorkspaceOverviewViewModel extends WorkspaceOverviewDTO {
  progress: { completed: number; denominator: number; percent: number | null }
}

export interface CachedWorkspaceOverview {
  data: WorkspaceOverviewDTO
  fetched_at: number
  revision: number
}

export type WorkspaceOverviewCache = Record<string, CachedWorkspaceOverview>

export interface WorkspaceOverviewGateway {
  get(slug: string, signal?: AbortSignal): Promise<WorkspaceOverviewDTO>
}
