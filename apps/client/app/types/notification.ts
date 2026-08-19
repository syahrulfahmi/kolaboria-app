export interface AppNotification {
  id: string
  recipient_id: string
  type: 'project.completed' | string
  project_id: string | null
  payload: Record<string, string>
  read_at: string | null
  created_at: string
}
