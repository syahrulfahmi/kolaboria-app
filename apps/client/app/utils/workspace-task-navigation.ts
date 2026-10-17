import { projectWorkspacePath } from '~/utils/workspace-paths'

export type WorkspaceTaskIntent = { filter?: 'mine' | 'review'; taskId?: string; action?: 'create' }

export const workspaceTaskBoardPath = (slug: string, intent: WorkspaceTaskIntent = {}): string => {
  const query = new URLSearchParams()
  if (intent.filter) query.set('filter', intent.filter)
  if (intent.taskId) query.set('task_id', intent.taskId)
  else if (intent.action) query.set('action', intent.action)
  const suffix = query.toString()
  return `${projectWorkspacePath(slug, 'tasks')}${suffix ? `?${suffix}` : ''}`
}
