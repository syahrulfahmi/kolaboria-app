export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export type ActivityAction =
  | 'task.created'
  | 'task.moved'
  | 'task.updated'
  | 'task.deleted'
  | 'task.assigned'
  | 'comment.added'

export interface MemberProfile {
  id: string
  username: string
  full_name: string | null
  avatar: string | null
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
  actor_id: string
  action: ActivityAction
  entity_type: 'task' | 'comment'
  entity_id: string
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
  entity_type: 'task' | 'comment'
  entity_id: string
  metadata?: Record<string, unknown>
}

export type CreateWorkspaceTaskPayload = Omit<CreateTaskPayload, 'project_id'>
