import { ref } from 'vue'
import { PortfolioService } from '../services/portfolio.service'
import type { PortfolioItem, WorkHistory } from '../types/project'

export const usePortfolio = () => {
  const isPortfolioLoading = ref(false)

  // Ambil project yang sudah di-pin (untuk profil publik)
  const getPinnedProjects = async (
    userId?: string
  ): Promise<PortfolioItem[]> => {
    try {
      const res = await PortfolioService.getPortfolio({ is_pinned: true })
      return res.data || []
    } catch (error) {
      console.error('Error fetching pinned projects:', error)
      return []
    }
  }

  // Ambil semua project selesai milik user (sebagai owner maupun member)
  const getCompletedProjects = async (userId?: string) => {
    isPortfolioLoading.value = true
    try {
      const res = await PortfolioService.getPortfolio()
      return (res.data || []).map((c: any) => ({
        id: c.project_id || c.id,
        title: c.title,
        summary: c.summary,
        slug: c.slug
      }))
    } catch (error) {
      console.error('Error fetching completed projects:', error)
      return []
    } finally {
      isPortfolioLoading.value = false
    }
  }

  // Ambil ID project yang di-pin oleh user saat ini
  const getPinnedProjectIds = async (userId?: string) => {
    try {
      const res = await PortfolioService.getPortfolio({ is_pinned: true })
      return (res.data || []).map((p: any) => p.projectId || p.project_id) || []
    } catch (error) {
      console.error('Error fetching pinned project ids:', error)
      return []
    }
  }

  // Pin project
  const pinProject = async (projectId: string, currentPinnedCount?: number) => {
    await PortfolioService.pinProject({ projectId })
  }

  // Unpin project
  const unpinProject = async (projectId: string) => {
    await PortfolioService.unpinProject(projectId)
  }

  // Get My Work History
  const getMyWorkHistory = async (
    projectId: string
  ): Promise<WorkHistory | null> => {
    try {
      const res = await PortfolioService.getMyWorkHistory(projectId)
      return res.data
    } catch (error) {
      console.error('Error fetching work history:', error)
      return null
    }
  }

  return {
    isPortfolioLoading,
    getPinnedProjects,
    getCompletedProjects,
    getPinnedProjectIds,
    pinProject,
    unpinProject,
    getMyWorkHistory
  }
}
