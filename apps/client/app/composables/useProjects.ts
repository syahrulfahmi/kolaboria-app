import type {
  Project,
  CreateProjectPayload,
  ProjectFilters,
  Application,
  ApplyProjectPayload
} from '../types/project'

export const useProjects = () => {
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()

  // ============================================================
  // Phase 1 — Listing & Detail
  // ============================================================

  const getProjects = async (
    filters: ProjectFilters = {}
  ): Promise<Project[]> => {
    const { search, status, type, limit = 12 } = filters

    let query = client
      .from('projects')
      .select(
        `
        id, creator_id, title, slug, summary, type, status, max_slots, deadline, tech_stack, created_at,
        profiles:profiles!projects_creator_id_fkey(username, full_name, avatar),
        project_skills(skill_tag_id, is_required, skill_tags(id, name)),
        project_members(profile_id, role)
      `
      )
      .in('status', status ? [status] : ['open', 'in_progress'])
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error
    return data ?? []
  }

  const getProjectById = async (id: string): Promise<Project | null> => {
    const { data, error } = await client
      .from('projects')
      .select(
        `
        *,
        profiles:profiles!projects_creator_id_fkey(username, full_name, avatar),
        project_skills(skill_tag_id, is_required, skill_tags(id, name)),
        project_members(project_id, profile_id, role, joined_at, profiles(username, full_name, avatar))
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    const { data, error } = await client
      .from('projects')
      .select(
        `
        *,
        profiles:profiles!projects_creator_id_fkey(username, full_name, avatar),
        project_skills(skill_tag_id, is_required, skill_tags(id, name)),
        project_members(project_id, profile_id, role, joined_at, profiles(username, full_name, avatar))
      `
      )
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
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
    if (!user.value) throw new Error('Kamu harus login untuk membuat project.')
    if (!user.value.email_confirmed_at) throw new Error('Verifikasi email Anda terlebih dahulu untuk membuat project.')

    const { skill_tag_ids, ...projectData } = payload

    const { data: project, error } = await client
      .from('projects')
      .insert({ ...projectData, creator_id: user.value.id, status: 'draft' })
      .select()
      .single()

    if (error) throw error

    const { error: ownerMemberError } = await client
      .from('project_members')
      .upsert(
        {
          project_id: project.id,
          profile_id: user.value.id,
          role: 'owner'
        },
        { onConflict: 'project_id,profile_id', ignoreDuplicates: true }
      )

    if (ownerMemberError) throw ownerMemberError

    // Insert project skills jika ada
    if (skill_tag_ids && skill_tag_ids.length > 0) {
      const skillInserts = skill_tag_ids.map((id) => ({
        project_id: project.id,
        skill_tag_id: id,
        is_required: true
      }))
      const { error: skillError } = await client
        .from('project_skills')
        .insert(skillInserts)
      if (skillError) throw skillError
    }

    return project
  }

  const publishProject = async (projectId: string): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { error } = await client
      .from('projects')
      .update({ status: 'open', published_at: new Date().toISOString() })
      .eq('id', projectId)
      .eq('creator_id', user.value.id)

    if (error) throw error
  }

  const updateProject = async (
    projectId: string,
    payload: Partial<CreateProjectPayload>
  ): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { skill_tag_ids, ...projectData } = payload

    const { error } = await client
      .from('projects')
      .update(projectData)
      .eq('id', projectId)
      .eq('creator_id', user.value.id)

    if (error) throw error
  }

  const updateProjectFull = async (
    projectId: string,
    payload: Partial<CreateProjectPayload>
  ): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { skill_tag_ids, ...projectData } = payload

    const { error } = await client
      .from('projects')
      .update(projectData)
      .eq('id', projectId)
      .eq('creator_id', user.value.id)

    if (error) throw error

    if (skill_tag_ids !== undefined) {
      // Delete existing skills
      const { error: deleteError } = await client
        .from('project_skills')
        .delete()
        .eq('project_id', projectId)

      if (deleteError) throw deleteError

      // Insert new skills
      if (skill_tag_ids.length > 0) {
        const skillInserts = skill_tag_ids.map((id) => ({
          project_id: projectId,
          skill_tag_id: id,
          is_required: true
        }))
        const { error: skillError } = await client
          .from('project_skills')
          .insert(skillInserts)
        if (skillError) throw skillError
      }
    }
  }

  const updateProjectStatus = async (
    projectId: string,
    status: 'open' | 'in_progress' | 'completed' | 'archived'
  ): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { error } = await client
      .from('projects')
      .update({ status })
      .eq('id', projectId)
      .eq('creator_id', user.value.id)

    if (error) throw error
  }

  const startProject = async (projectId: string): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { data: members, error: membersError } = await client
      .from('project_members')
      .select('profile_id')
      .eq('project_id', projectId)
      .eq('role', 'contributor')

    if (membersError) throw membersError

    if (!members || members.length === 0) {
      throw new Error('Tambahkan minimal 1 collaborator sebelum memulai project.')
    }

    const { error } = await client
      .from('projects')
      .update({ status: 'in_progress' })
      .eq('id', projectId)
      .eq('creator_id', user.value.id)
      .eq('status', 'open')

    if (error) throw error
  }

  const getMyProjects = async (): Promise<Project[]> => {
    if (!user.value) return []

    const { data, error } = await client
      .from('projects')
      .select(
        `
        id, creator_id, title, slug, summary, type, status, max_slots, deadline, created_at, published_at,
        project_members(profile_id, role),
        project_skills(skill_tag_id, is_required, skill_tags(id, name))
      `
      )
      .eq('creator_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  }

  const getMyApplications = async (): Promise<Application[]> => {
    if (!user.value) return []

    const { data, error } = await client
      .from('applications')
      .select(
        `
        *,
        projects(id, title, slug, status)
      `
      )
      .eq('applicant_id', user.value.id)
      .order('applied_at', { ascending: false })

    if (error) throw error
    return data ?? []
  }

  const applyToProject = async (
    payload: ApplyProjectPayload
  ): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login untuk melamar project.')
    if (!user.value.email_confirmed_at) throw new Error('Verifikasi email Anda terlebih dahulu untuk melamar project.')

    const { error } = await client
      .from('applications')
      .insert({ ...payload, applicant_id: user.value.id })

    if (error) throw error
  }

  // ============================================================
  // Phase 3 & 4 — Applications & Dashboards
  // ============================================================

  const getProjectApplicants = async (
    projectId: string
  ): Promise<Application[]> => {
    if (!user.value) return []

    const { data, error } = await client
      .from('applications')
      .select(
        `
        *,
        profiles(username, full_name, avatar, headline, completion_score)
      `
      )
      .eq('project_id', projectId)
      .order('applied_at', { ascending: false })

    if (error) throw error
    return data ?? []
  }

  const reviewApplication = async (
    applicationId: string,
    status: 'accepted' | 'rejected',
    reviewerNote?: string
  ): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { data: application, error: fetchError } = await client
      .from('applications')
      .select('project_id, applicant_id')
      .eq('id', applicationId)
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await client
      .from('applications')
      .update({ status, reviewer_note: reviewerNote })
      .eq('id', applicationId)

    if (updateError) throw updateError

    // Jika diterima, tambahkan ke project_members
    if (status === 'accepted') {
      const { error: memberError } = await client
        .from('project_members')
        .upsert(
          {
            project_id: application.project_id,
            profile_id: application.applicant_id,
            role: 'contributor'
          },
          { onConflict: 'project_id,profile_id', ignoreDuplicates: true }
        )
      if (memberError) throw memberError
    }
  }

  const withdrawApplication = async (applicationId: string): Promise<void> => {
    if (!user.value) throw new Error('Kamu harus login.')

    const { error } = await client
      .from('applications')
      .update({ status: 'withdrawn' })
      .eq('id', applicationId)
      .eq('applicant_id', user.value.id)
      .eq('status', 'pending')

    if (error) throw error
  }

  const getSkillTags = async () => {
    const { data, error } = await client
      .from('skill_tags')
      .select('id, name')
      .order('name')

    if (error) throw error
    return data ?? []
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
