// --- Request ---
export interface SubmitOnboardingRequest {
  primarySkillId: string
  experienceLevel: string
  toolIds: string[]
  goal: string
  bio: string
  externalLink: string
}

// --- Response / Model ---
export interface Profile {
  id: string
  username: string
  full_name: string | null
  account_type: 'talent' | 'mentor' | 'company' | null
  system_role: 'user' | 'admin' | null
  avatar: string | null
  headline: string | null
  bio: string | null
  location: string | null
  availability_status: 'available' | 'busy' | 'unavailable' | null
  external_links: Record<string, string>
  rating: number
  review_count: number
  completion_score: number
  is_verified: boolean
  last_active_at: string
  created_at: string
  updated_at: string
}

export interface TalentProfile {
  user_id: string
  experience_level: string
  goal: string | null
  project_count: number
  completed_projects: number
  contribution_score: number
}

export interface UserSkill {
  id: string
  user_id?: string
  skill_id: string
  is_primary: boolean
  skills: { name: string; category: string }
}

export interface UserTool {
  id: string
  user_id?: string
  tool_id: string
  tools: { name: string; category?: string | null }
}

export interface ContributionStats {
  project_joined: number
  project_completed: number
  contribution_score: number
}
