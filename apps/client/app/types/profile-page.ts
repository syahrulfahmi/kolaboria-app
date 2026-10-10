import type {
  ExperienceCard,
  ExperienceCardSummary
} from './experience'

export interface ProfileIdentity {
  username: string
  fullName: string | null
  avatar: string | null
  headline: string | null
  location: string | null
  bio: string | null
  externalLinks: Record<string, string>
  isVerified: boolean
}

export interface ProfileTalentDetails {
  experienceLevel: string | null
  collaborationGoal: string | null
}

export interface ProfileSkill {
  id: string
  name: string
  isPrimary: boolean
}

export interface ProfileTool {
  id: string
  name: string
}

export interface FeaturedProject {
  id: string
  title: string
  slug: string
  description: string
  category: string
  role?: string
  year?: string
  skills?: string[]
}

export type ProfileExperience = ExperienceCardSummary & Pick<
  ExperienceCard,
  'visibility'
> & {
  username: string
}

export interface CareerJourney {
  id: string
  title: string
  company: string
  startYear: string
  startMonth: number | null
  endYear: string | null
  endMonth: number | null
  description: string | null
}

export interface PortfolioItem {
  id: string
  title: string
  role: string
  year: string
  summary: string
  url: string
  thumbnailUrl: string | null
}

export interface ProfilePageData {
  profile: ProfileIdentity
  talent: ProfileTalentDetails
  completedProjects: number | null
  skills: ProfileSkill[]
  tools: ProfileTool[]
  projects: FeaturedProject[]
  experiences: ProfileExperience[] | null
  careerJourneys: CareerJourney[]
  portfolio: PortfolioItem[]
}
