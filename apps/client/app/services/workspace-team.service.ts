import { API_ENDPOINTS } from '~/constants/api-endpoints'
import { useApi } from '~/composables/useApi'
import type { ApiPaginatedResponse } from '~/types/api'
import { mapWorkspaceTeamMember, type WorkspaceTeamMember, type WorkspaceTeamMemberDTO, type WorkspaceTeamPageDTO } from '~/types/workspace-team'
import { getApiErrorMessage } from '~/utils/error'

export const WorkspaceTeamService = {
  async listMembers(projectSlug: string, page = 1, limit = 20, signal?: AbortSignal): Promise<WorkspaceTeamPageDTO & { members: WorkspaceTeamMember[] }> {
    const { $api } = useApi()
    const response = await $api<ApiPaginatedResponse<WorkspaceTeamMemberDTO>>(
      API_ENDPOINTS.WORKSPACE.TEAM_MEMBERS(projectSlug),
      { query: { page, limit }, signal }
    )
    if (!Array.isArray(response.data) || !response.meta) {
      throw new Error(getApiErrorMessage(response, 'Daftar anggota proyek belum dapat dimuat.'))
    }
    return { data: response.data, meta: response.meta, members: response.data.map(mapWorkspaceTeamMember) }
  },

  async updateTaskAccess(projectSlug: string, memberId: string, version: number, granted: boolean): Promise<{ member_id: string; task_management_granted: boolean; task_access_version: number }> {
    const { $api } = useApi()
    const response = await $api<{ data?: { member_id: string; task_management_granted: boolean; task_access_version: number } }>(
      API_ENDPOINTS.WORKSPACE.MEMBER_TASK_ACCESS(projectSlug, memberId),
      { method: 'PATCH', body: { version, task_management_granted: granted } }
    )
    if (!response.data) throw new Error(getApiErrorMessage(response, 'Izin pengelolaan task belum dapat diubah.'))
    return response.data
  }
}
