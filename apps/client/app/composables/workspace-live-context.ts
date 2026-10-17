import type { WorkspaceOverviewDTO } from '~/types/workspace-overview'

export interface WorkspaceLiveHeader {
  account_id: string
  project_slug: string
  project_id: string
  title: string
  status: WorkspaceOverviewDTO['project']['status']
  viewer_scope: WorkspaceOverviewDTO['viewer']['scope']
  can_create_task: boolean
}

export const useWorkspaceLiveContext = () => {
  const header = useState<WorkspaceLiveHeader | null>('workspace-live-header', () => null)
  const publishOverview = (accountId: string, data: WorkspaceOverviewDTO) => {
    header.value = { account_id: accountId, project_slug: data.project.slug, project_id: data.project.id,
      title: data.project.title, status: data.project.status, viewer_scope: data.viewer.scope,
      can_create_task: data.viewer.capabilities.can_create_task }
  }
  return { header, publishOverview }
}
