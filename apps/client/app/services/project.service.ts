import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'
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
  }
}
