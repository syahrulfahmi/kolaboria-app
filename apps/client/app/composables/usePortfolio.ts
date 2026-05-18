import { ref, computed } from 'vue'

export const usePortfolio = () => {
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()
  const { add: addToast } = useToast()

  const pinnedProjects = ref<any[]>([])
  const isPortfolioLoading = ref(false)

  // Ambil project yang sudah di-pin (untuk profil publik)
  const getPinnedProjects = async (userId: string) => {
    const { data, error } = await client
      .from('portfolio_projects')
      .select('project_id, projects(id, title, description, slug, status, type)')
      .eq('user_id', userId)
      .order('pinned_at', { ascending: false })

    if (error) {
      console.error('Error fetching pinned projects:', error)
      return []
    }
    return data?.map((d: any) => d.projects).filter(Boolean) || []
  }

  // Ambil semua project selesai milik user (sebagai owner maupun member)
  const getCompletedProjects = async (userId: string) => {
    isPortfolioLoading.value = true
    try {
      // 1. Ambil project di mana user adalah owner
      const { data: ownedProjects, error: err1 } = await client
        .from('projects')
        .select('id, title, description, slug, status, type')
        .eq('creator_id', userId)
        .eq('status', 'completed')

      if (err1) throw err1

      // 2. Ambil project di mana user adalah member
      const { data: memberProjects, error: err2 } = await client
        .from('project_members')
        .select('projects(id, title, description, slug, status, type)')
        .eq('profile_id', userId)
      
      if (err2) throw err2

      const joinedProjects = memberProjects
        ?.map((m: any) => m.projects)
        .filter((p: any) => p && p.status === 'completed') || []

      // Gabungkan dan hilangkan duplikasi (jika ada)
      const allCompleted = [...(ownedProjects || []), ...joinedProjects]
      const uniqueProjects = Array.from(new Map(allCompleted.map(item => [item.id, item])).values())

      return uniqueProjects
    } catch (error) {
      console.error('Error fetching completed projects:', error)
      return []
    } finally {
      isPortfolioLoading.value = false
    }
  }

  // Ambil ID project yang di-pin oleh user saat ini
  const getPinnedProjectIds = async (userId: string) => {
    const { data, error } = await client
      .from('portfolio_projects')
      .select('project_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching pinned project ids:', error)
      return []
    }
    return data?.map((d: any) => d.project_id) || []
  }

  // Pin project
  const pinProject = async (projectId: string, currentPinnedCount: number) => {
    if (!user.value) throw new Error('Kamu harus login.')
    if (currentPinnedCount >= 10) {
      throw new Error('Kamu sudah mencapai batas maksimum 10 karya unggulan.')
    }

    const { error } = await client
      .from('portfolio_projects')
      .insert({
        user_id: user.value.id,
        project_id: projectId
      })

    if (error) throw error
  }

  // Unpin project
  const unpinProject = async (projectId: string) => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { error } = await client
      .from('portfolio_projects')
      .delete()
      .eq('user_id', user.value.id)
      .eq('project_id', projectId)

    if (error) throw error
  }

  return {
    isPortfolioLoading,
    getPinnedProjects,
    getCompletedProjects,
    getPinnedProjectIds,
    pinProject,
    unpinProject
  }
}
