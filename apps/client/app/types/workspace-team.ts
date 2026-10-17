import type { ApiPaginationMeta } from './api'

export interface WorkspaceTeamMemberDTO {
  id: string
  user_id: string
  membership_role: 'owner' | 'contributor' | string
  membership_status: 'active' | 'left' | 'removed' | string
  joined_at: string
  active_task_count: number
  task_management_granted: boolean
  task_access_version: number
  profile: {
    id: string
    username: string
    full_name: string | null
    headline: string | null
    avatar: string | null
    is_verified: boolean
  } | null
  project_role: { id: string; name: string } | null
  contribution_role: { id: string; name: string } | null
}

export type WorkspaceTeamPageDTO = {
  data: WorkspaceTeamMemberDTO[]
  meta: ApiPaginationMeta
}

export interface WorkspaceTeamMember {
  membershipId: string
  userId: string
  membershipRole: string
  joinedAt: string
  name: string
  username: string
  headline: string | null
  avatar: string | null
  isVerified: boolean
  roleLabel: string
  activeTaskCount: number
  taskManagementGranted: boolean
  taskAccessVersion: number
  canChangeTaskManagement: boolean
}

export const mapWorkspaceTeamMember = (dto: WorkspaceTeamMemberDTO): WorkspaceTeamMember => ({
  membershipId: dto.id,
  userId: dto.user_id,
  membershipRole: dto.membership_role,
  joinedAt: dto.joined_at,
  name: dto.profile?.full_name?.trim() || dto.profile?.username || 'Anggota proyek',
  username: dto.profile?.username ?? '',
  headline: dto.profile?.headline ?? null,
  avatar: dto.profile?.avatar ?? null,
  isVerified: dto.profile?.is_verified ?? false,
  roleLabel: dto.contribution_role?.name || dto.project_role?.name || (dto.membership_role === 'owner' ? 'Owner proyek' : 'Kontributor'),
  activeTaskCount: dto.active_task_count,
  taskManagementGranted: dto.task_management_granted,
  taskAccessVersion: dto.task_access_version,
  canChangeTaskManagement: false
})
