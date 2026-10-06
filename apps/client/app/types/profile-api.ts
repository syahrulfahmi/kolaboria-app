export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export interface UpdateProfileRequest {
  fullName?: string | null
  headline?: string | null
  bio?: string | null
  villageId?: number | null
  address?: string | null
  goal?: string | null
  experienceLevel?: ExperienceLevel
}

export interface AddSkillRequest {
  skillId: string
  isPrimary?: boolean
}

export interface AddToolRequest {
  toolId: string
}

export interface ProfileVillageResponse {
  village_id: number
  village: string
  district: string
  regency: string
  province: string
  postal_code: string
}

export interface TalentProfileResponse {
  experience_level: ExperienceLevel
  goal: string | null
  experienceLevel?: ExperienceLevel
}

export interface LegacyTalentProfileResponse {
  experienceLevel: ExperienceLevel
  goal: string | null
  projectCount?: number
  completedProjects?: number
  contributionScore?: number
}

export interface UserSkillResponse {
  id: string
  skill_id: string
  name: string
  slug: string
  is_primary: boolean
  skillId?: string
  isPrimary?: boolean
}

export interface UserToolResponse {
  id: string
  tool_id: string
  toolId?: string
  name: string
  slug: string
}

export interface ProfileResponse {
  id: string
  username: string
  full_name: string | null
  headline: string | null
  bio: string | null
  avatar: string | null
  location: string | null
  village_id: number | null
  address: string | LegacyProfileAddress | null
  village: ProfileVillageResponse | null
  account_type: string | null
  external_links: Record<string, string>
  is_verified: boolean
  rating?: number
  review_count?: number
  completion_score?: number
  verified_experiences?: import('./experience').ExperienceCard[]
  last_active_at?: string | null
  lastActiveAt?: string | null
  fullName?: string | null
  accountType?: string | null
  system_role?: string | null
  systemRole?: string | null
  availability_status?: string | null
  availabilityStatus?: string | null
  externalLinks?: Record<string, string>
  reviewCount?: number
  completionScore?: number
  isVerified?: boolean
  createdAt?: string
  updatedAt?: string
  verifiedExperiences?: import('./experience').ExperienceCard[]
  talentProfile?: LegacyTalentProfileResponse | null
  created_at: string
  updated_at: string
  talent_profile: TalentProfileResponse | null
  skills: UserSkillResponse[]
  tools: UserToolResponse[]
}

export interface LegacyProfileAddress {
  id: string
  provinceId: number
  province: string
  regencyId: number
  regency: string
  districtId: number
  district: string
  villageId: number
  village: string
  address: string
  postalCode: string
}

export interface CareerHistoryRequest {
  title: string
  company: string
  startYear: number
  startMonth?: number | null
  endYear: number | null
  endMonth?: number | null
  description: string | null
}

export interface CareerHistoryResponse {
  id: string
  title: string
  company: string
  start_year: number
  start_month: number | null
  end_year: number | null
  end_month: number | null
  description: string | null
  startYear?: number
  endYear?: number | null
}
