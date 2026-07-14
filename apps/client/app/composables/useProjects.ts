import { ProjectService } from '../services/project.service'
import type {
  Project,
  CreateProjectPayload,
  ProjectFilters,
  Application,
  ApplyProjectPayload
} from '../types/project'

export const useProjects = () => {
  // ============================================================
  // Phase 1 — Listing & Detail
  // ============================================================

  const getProjects = async (
    filters: ProjectFilters = {}
  ): Promise<Project[]> => {
    try {
      const res = await ProjectService.getProjects(filters)
      const list = res.data ?? []
      return list.map((p: any) => ({
        ...p,
        profiles: p.creator
      }))
    } catch (err) {
      console.error('Failed to get projects:', err)
      return []
    }
  }

  const getProjectById = async (id: string): Promise<Project | null> => {
    try {
      const res = await ProjectService.getProjectById(id)
      if (!res.data) return null
      return {
        ...res.data,
        profiles: res.data.creator
      }
    } catch (err) {
      console.error(`Failed to get project by ID ${id}:`, err)
      return null
    }
  }

  const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    try {
      const res = await ProjectService.getProjectBySlug(slug)
      if (!res.data) return null
      return {
        ...res.data,
        profiles: res.data.creator
      }
    } catch (err) {
      console.error(`Failed to get project by slug ${slug}:`, err)
      return null
    }
  }

  const getRecentProjects = async (limit = 3): Promise<Project[]> => {
    return getProjects({ limit })
  }

  // ============================================================
  // Phase 2 — Create & Manage Project
  // ============================================================

  const createProject = async (
    payload: CreateProjectPayload
  ): Promise<Project> => {
    const res = await ProjectService.createProject(payload)
    if (!res.data) {
      throw new Error(res.message || 'Gagal membuat project.')
    }
    return {
      ...res.data,
      profiles: res.data.creator
    }
  }

  const publishProject = async (projectId: string): Promise<void> => {
    const res = await ProjectService.publishProject(projectId)
    if (res.error) {
      throw new Error(res.message || 'Gagal mempublikasikan project.')
    }
  }

  const updateProject = async (
    projectId: string,
    payload: Partial<CreateProjectPayload>
  ): Promise<void> => {
    const res = await ProjectService.updateProject(projectId, payload)
    if (res.error) {
      throw new Error(res.message || 'Gagal memperbarui project.')
    }
  }

  const updateProjectFull = async (
    projectId: string,
    payload: Partial<CreateProjectPayload>
  ): Promise<void> => {
    const res = await ProjectService.updateProjectFull(projectId, payload)
    if (res.error) {
      throw new Error(res.message || 'Gagal memperbarui project.')
    }
  }

  const updateProjectStatus = async (
    projectId: string,
    status: 'open' | 'in_progress' | 'completed' | 'archived'
  ): Promise<void> => {
    const res = await ProjectService.updateProjectStatus(projectId, status)
    if (res.error) {
      throw new Error(res.message || 'Gagal memperbarui status project.')
    }
  }

  const startProject = async (projectId: string): Promise<void> => {
    const res = await ProjectService.startProject(projectId)
    if (res.error) {
      throw new Error(res.message || 'Gagal memulai project.')
    }
  }

  const getMyProjects = async (): Promise<Project[]> => {
    try {
      const res = await ProjectService.getMyProjects()
      const list = res.data ?? []
      return list.map((p: any) => ({
        ...p,
        profiles: p.creator
      }))
    } catch (err) {
      console.error('Failed to get my projects:', err)
      return []
    }
  }

  const getMyApplications = async (): Promise<Application[]> => {
    try {
      const res = await ProjectService.getMyApplications()
      return res.data ?? []
    } catch (err) {
      console.error('Failed to get my applications:', err)
      return []
    }
  }

  const applyToProject = async (
    payload: ApplyProjectPayload
  ): Promise<void> => {
    const res = await ProjectService.applyToProject(payload.project_id, payload)
    if (res.error) {
      throw new Error(res.message || 'Gagal melamar ke project.')
    }
  }

  // ============================================================
  // Phase 3 & 4 — Applications & Dashboards
  // ============================================================

  const getProjectApplicants = async (
    projectId: string
  ): Promise<Application[]> => {
    try {
      const res = await ProjectService.getProjectApplicants(projectId)
      return res.data ?? []
    } catch (err) {
      console.error(`Failed to get applicants for project ${projectId}:`, err)
      return []
    }
  }

  const reviewApplication = async (
    applicationId: string,
    status: 'accepted' | 'rejected',
    reviewerNote?: string
  ): Promise<void> => {
    const res = await ProjectService.reviewApplication(applicationId, status, reviewerNote)
    if (res.error) {
      throw new Error(res.message || 'Gagal meninjau lamaran.')
    }
  }

  const withdrawApplication = async (applicationId: string): Promise<void> => {
    const res = await ProjectService.withdrawApplication(applicationId)
    if (res.error) {
      throw new Error(res.message || 'Gagal menarik lamaran.')
    }
  }

  const getSkillTags = async () => {
    try {
      const res = await ProjectService.getSkillTags()
      return res.data ?? []
    } catch (err) {
      console.error('Failed to get skill tags:', err)
      return []
    }
  }

  return {
    getProjects,
    getProjectById,
    getProjectBySlug,
    getRecentProjects,
    createProject,
    publishProject,
    updateProject,
    updateProjectFull,
    updateProjectStatus,
    startProject,
    getMyProjects,
    getMyApplications,
    applyToProject,
    getProjectApplicants,
    reviewApplication,
    withdrawApplication,
    getSkillTags
  }
}
