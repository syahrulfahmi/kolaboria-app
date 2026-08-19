export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export type ActivityAction =
  | 'task.created'
  | 'task.moved'
  | 'task.updated'
  | 'task.deleted'
  | 'task.assigned'
  | 'comment.added'
  | 'member.joined'
  | 'member.left'
  | 'member.removed'
  | 'member.active'
  | 'member.role_changed'
  | 'task.status_changed'
  | 'task.completed'
  | 'task.reopened'
  | 'task.unassigned'
  | 'comment.created'
  | 'comment.updated'
  | 'comment.deleted'
  | 'deliverable.added'
  | 'deliverable.updated'
  | 'deliverable.removed'

export interface MemberProfile {
  id: string
  username: string
  full_name: string | null
  avatar: string | null
  membership_role?: 'owner' | 'contributor'
  project_role_id?: string | null
  contribution_role_id?: string | null
  contribution_role_name?: string
  custom_role_title?: string | null
  membership_status?: 'active' | 'left' | 'removed'
}

export interface Task {
  id: string
  project_id: string
  created_by: string
  assignee_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  position: number
  due_date: string | null
  created_at: string
  updated_at: string
  completed_at?: string | null
  deleted_at?: string | null
  assignee?: MemberProfile | null
  creator?: MemberProfile | null
}

export interface TaskComment {
  id: string
  task_id: string
  author_id: string
  body: string
  created_at: string
  profiles?: MemberProfile | null
}

export interface ActivityLog {
  id: string
  project_id: string
  actor_id: string | null
  action: ActivityAction
  entity_type: 'task' | 'comment' | 'member' | 'project_member' | 'deliverable' | 'project' | ''
  entity_id: string | null
  event_type?: ActivityAction
  event_version?: number
  occurred_at?: string
  metadata: Record<string, unknown>
  created_at: string
  profiles?: MemberProfile | null
}

export interface WorkspaceOverview {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  memberCount: number
}

export interface CreateTaskPayload {
  project_id: string
  title: string
  description?: string | null
  assignee_id?: string | null
  due_date?: string | null
  status?: TaskStatus
  position?: number
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  assignee_id?: string | null
  due_date?: string | null
  status?: TaskStatus
  position?: number
}

export interface ReorderTaskUpdate {
  id: string
  status: TaskStatus
  position: number
}

export interface LogActivityPayload {
  project_id: string
  actor_id: string
  action: ActivityAction
  entity_type: 'task' | 'comment' | 'member'
  entity_id: string
  metadata?: Record<string, unknown>
}

export type CreateWorkspaceTaskPayload = Omit<CreateTaskPayload, 'project_id'>

export type DeliverableType =
  | 'repository'
  | 'live_demo'
  | 'design'
  | 'documentation'
  | 'presentation'
  | 'application'
  | 'video'
  | 'other'

export interface ProjectDeliverable {
  id: string
  project_id: string
  title: string
  description: string | null
  type: DeliverableType
  url: string
  added_by: string
  created_at: string
  updated_at: string
}

export interface ContributionSnapshot {
  id: string
  project_id: string
  profile_id: string
  project_member_id?: string | null
  assigned_task_count: number
  completed_task_count: number
  comment_count: number
  activity_count: number
  deliverable_count: number
  first_activity_at: string | null
  last_activity_at: string | null
  participation_started_at: string | null
  participation_ended_at: string | null
  generated_at: string
  snapshot_version: number
}

export type FinalizationJobStatus = 'pending' | 'processing' | 'succeeded' | 'failed'

export interface FinalizationStatus {
  project_id: string
  status: FinalizationJobStatus
  attempts: number
  last_error?: string | null
}

export interface DeliverablePayload {
  title: string
  description?: string | null
  type: DeliverableType
  url: string
}

export interface UpdateDeliverablePayload {
  title?: string
  description?: string | null
  type?: DeliverableType
  url?: string
}
