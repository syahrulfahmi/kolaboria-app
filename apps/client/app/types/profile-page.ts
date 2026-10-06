import type {
  ExperienceCard,
  ExperienceCardSummary
} from './experience'

export interface ProfileIdentity {
  username: string
  fullName: string
  avatar: string | null
  headline: string
  location: string
  bio: string
  externalLinks: Record<string, string>
  isVerified: boolean
}

export interface ProfileTalentDetails {
  experienceLevel: string
  collaborationGoal: string
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
  description: string
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
  completedProjects: number
  skills: ProfileSkill[]
  tools: ProfileTool[]
  projects: FeaturedProject[]
  experiences: ProfileExperience[]
  careerJourneys: CareerJourney[]
  portfolio: PortfolioItem[]
}
