import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'
import type { Project } from '../types/project'
import type {
  CreateProjectPayload,
  ApplyProjectPayload
} from '../types/project'

export const ProjectService = {
  async getProjects(params: Record<string, any> = {}) {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('/projects', { params })
  },

  async getProjectById(id: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>(`/projects/${id}`)
  },

  async getProjectBySlug(slug: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>(`/projects/slug/${slug}`)
  },

  async createProject(payload: CreateProjectPayload) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>('/projects', {
      method: 'POST',
      body: payload
    })
  },

  async updateProject(id: string, payload: Partial<CreateProjectPayload>) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${id}`, {
      method: 'PATCH',
      body: payload
    })
  },

  async updateProjectFull(id: string, payload: Partial<CreateProjectPayload>) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${id}`, {
      method: 'PUT',
      body: payload
    })
  },

  async updateProjectStatus(id: string, status: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${id}/status`, {
      method: 'PATCH',
      body: { status }
    })
  },

  async publishProject(id: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${id}/publish`, {
      method: 'POST'
    })
  },

  async startProject(id: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${id}/start`, {
      method: 'POST'
    })
  },

  async getMyProjects() {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('/projects/my-projects')
  },

  async getMyApplications() {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('/applications/my-applications')
  },

  async applyToProject(projectId: string, payload: ApplyProjectPayload) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: payload
    })
  },

  async getProjectApplicants(projectId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>(`/projects/${projectId}/applicants`)
  },

  async reviewApplication(
    applicationId: string,
    status: 'accepted' | 'rejected',
    reviewerNote?: string
  ) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      `/applications/${applicationId}/review`,
      {
        method: 'PATCH',
        body: { status, reviewer_note: reviewerNote }
      }
    )
  },

  async withdrawApplication(applicationId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      `/applications/${applicationId}/withdraw`,
      {
        method: 'POST'
      }
    )
  },

  async getSkillTags() {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('/skill-tags')
  },

  async getSkills() {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('/master-data/skills')
  },

  async leaveProject(projectId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      `/projects/${projectId}/members/leave`,
      {
        method: 'POST'
      }
    )
  },

  async updateMemberStatus(
    projectId: string,
    memberId: string,
    status: 'active' | 'removed'
  ) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      `/projects/${projectId}/members/${memberId}/status`,
      {
        method: 'PATCH',
        body: { status }
      }
    )
  },

  async changeMemberRole(
    projectId: string,
    memberId: string,
    projectRoleId: string
  ) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(
      `/projects/${projectId}/members/${memberId}/role`,
      {
        method: 'PATCH',
        body: { project_role_id: projectRoleId }
      }
    )
  },

  async getTools() {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>('/master-data/tools')
  },

  async completeProject(
    id: string
  ): Promise<
    ApiResponse<{
      project: Project
      outcome: string
      finalization_status: string
    }>
  > {
    const { $api } = useApi()
    return await $api<
      ApiResponse<{
        project: Project
        outcome: string
        finalization_status: string
      }>
    >(`/projects/${id}/complete`, {
      method: 'POST'
    })
  },

  async archiveProject(id: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(`/projects/${id}/archive`, {
      method: 'POST'
    })
  }
}
