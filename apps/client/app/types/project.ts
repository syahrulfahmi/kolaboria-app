// ============================================================
// Project Hub — TypeScript Types
// ============================================================

export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'archived'
export type ProjectType = 'web_app' | 'mobile_app' | 'ui_ux' | 'backend' | 'data_analytics' | 'devops' | 'other'
export type ProjectVisibility = 'public' | 'invite_only'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type ProjectMemberRole = 'owner' | 'contributor'
export type ApplicantAvailability = 'full_time' | 'part_time' | 'weekends_only' | 'flexible'

export interface SkillTag {
  id: string
  name: string
}

export interface ProjectSkill {
  skill_tag_id: string
  is_required: boolean
  skill_tags: SkillTag
}

export interface ProjectMember {
  project_id: string
  profile_id: string
  role: ProjectMemberRole
  joined_at: string
  profiles?: {
    username: string
    full_name: string | null
    avatar: string | null
  }
}

export interface Project {
  id: string
  creator_id: string
  title: string
  slug: string
  summary: string
  description: string | null
  type: ProjectType
  visibility: ProjectVisibility
  status: ProjectStatus
  max_slots: number
  start_date: string | null
  deadline: string | null
  tech_stack: string[]
  why_join: string | null
  created_at: string
  published_at: string | null
  // Joined relations
  profiles?: {
    username: string
    full_name: string | null
    avatar: string | null
  }
  project_skills?: ProjectSkill[]
  project_members?: ProjectMember[]
}

export interface Application {
  id: string
  project_id: string
  applicant_id: string
  motivation: string
  expected_contribution: string | null
  portfolio_links: string[]
  availability: ApplicantAvailability
  status: ApplicationStatus
  reviewer_note: string | null
  applied_at: string
  // Joined relations
  profiles?: {
    username: string
    full_name: string | null
    avatar: string | null
    headline: string | null
    completion_score: number
  }
  projects?: Pick<Project, 'id' | 'title' | 'slug' | 'status'>
}

// ---- Request Payloads ----

export interface CreateProjectPayload {
  title: string
  summary: string
  description?: string
  type: ProjectType
  visibility: ProjectVisibility
  max_slots: number
  start_date?: string | null
  deadline?: string | null
  tech_stack?: string[]
  why_join?: string
  skill_tag_ids?: string[]
}

export interface ApplyProjectPayload {
  project_id: string
  motivation: string
  expected_contribution?: string
  portfolio_links?: string[]
  availability: ApplicantAvailability
}

// ---- Filters ----

export interface ProjectFilters {
  search?: string
  status?: ProjectStatus
  type?: ProjectType
  cursor?: string | null
  limit?: number
}
