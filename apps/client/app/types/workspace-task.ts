import type { ApiPaginationMeta } from './api'

export type WorkspaceTaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'closed'
export type WorkspaceTaskPriority = 'low' | 'medium' | 'high'
export type WorkspaceTaskFilter = 'all' | 'mine' | 'review'

export interface WorkspaceTaskPermissions {
  edit_content: boolean
  manage_metadata: boolean
  delete: boolean
  reopen: boolean
  allowed_transitions: WorkspaceTaskStatus[]
}

export interface WorkspaceTaskAssignee {
  membership_id: string | null
  user_id: string
  name: string
  avatar: string | null
  status: string
}

export interface WorkspaceTaskReviewSummary {
  state: string
  requested_at: string
  resolved_at: string | null
  reviewer_name: string | null
  self_review: boolean
}

export interface WorkspaceTaskDTO {
  id: string
  project_id: string
  title: string
  description_preview: string
  description?: string
  status: WorkspaceTaskStatus
  priority: WorkspaceTaskPriority
  due_date: string | null
  assignee: WorkspaceTaskAssignee | null
  version: number
  content_revision: number
  comment_count: number
  created_at: string
  updated_at: string
  needs_reassignment: boolean
  close_reason?: string | null
  review_summary: WorkspaceTaskReviewSummary | null
  permissions: WorkspaceTaskPermissions
}

export interface WorkspaceTaskCommentDTO {
  id: string
  task_id: string
  body: string
  author: WorkspaceTaskAssignee
  task_revision_id: string
  review_cycle_id: string | null
  created_at: string
}

export interface WorkspaceTaskPageDTO {
  data: WorkspaceTaskDTO[]
  meta: ApiPaginationMeta
}

export interface WorkspaceTaskCommentPageDTO {
  data: WorkspaceTaskCommentDTO[]
  meta: ApiPaginationMeta
}

export interface WorkspaceTaskListQuery {
  page: number
  limit: number
  status?: WorkspaceTaskStatus
  q?: string
  mine?: boolean
  assignee_member_id?: string
}

export interface CreateWorkspaceTaskInput {
  title: string
  description: string
  assignee_member_id?: string | null
  priority?: WorkspaceTaskPriority
  due_date?: string | null
}

export interface UpdateWorkspaceTaskInput {
  version: number
  title?: string
  description?: string
  assignee_member_id?: string | null
  priority?: WorkspaceTaskPriority
  due_date?: string | null
  to_status?: WorkspaceTaskStatus
  close_reason?: string
  reopen_confirmed?: boolean
}

export interface WorkspaceTaskGateway {
  list(slug: string, query: WorkspaceTaskListQuery, signal?: AbortSignal): Promise<WorkspaceTaskPageDTO>
  get(slug: string, taskId: string, signal?: AbortSignal): Promise<WorkspaceTaskDTO>
  create(slug: string, input: CreateWorkspaceTaskInput, idempotencyKey: string): Promise<WorkspaceTaskDTO>
  update(slug: string, taskId: string, input: UpdateWorkspaceTaskInput): Promise<WorkspaceTaskDTO>
  transition(slug: string, taskId: string, version: number, status: WorkspaceTaskStatus, closeReason?: string, reopenConfirmed?: boolean): Promise<WorkspaceTaskDTO>
  remove(slug: string, taskId: string, version: number): Promise<void>
  listComments(slug: string, taskId: string, page: number, signal?: AbortSignal): Promise<WorkspaceTaskCommentPageDTO>
  createComment(slug: string, taskId: string, body: string, idempotencyKey: string): Promise<WorkspaceTaskCommentDTO>
}
