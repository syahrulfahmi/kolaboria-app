import { ProfileService } from '../services/profile.service'
import type {
  SubmitOnboardingRequest,
  Profile,
  UserSkill,
  UserTool,
  TalentProfile
} from '../types/profile'
import { getProfileCompletionItems } from '../utils/profileCompletion'
import type { ApiResponse } from '../types/api'
import type { ExperienceCard } from '../types/experience'

// Helper function to map camelCase REST API response properties to snake_case used by frontend components
function mapProfile(data: any): Profile | null {
  if (!data) return null

  let formattedLocation = data.location ?? null
  if (data.address) {
    const parts = [data.address.regency, data.address.province].filter(Boolean)
    if (parts.length > 0) {
      formattedLocation = parts.join(', ')
    }
  }

  return {
    id: data.id,
    username: data.username,
    full_name: data.fullName ?? data.full_name ?? null,
    account_type: data.accountType ?? data.account_type ?? null,
    system_role: data.systemRole ?? data.system_role ?? null,
    avatar: data.avatar ?? null,
    headline: data.headline ?? null,
    bio: data.bio ?? null,
    location: formattedLocation,
    availability_status:
      data.availabilityStatus ?? data.availability_status ?? null,
    external_links: data.externalLinks ?? data.external_links ?? {},
    rating: data.rating ?? 0,
    review_count: data.reviewCount ?? data.review_count ?? 0,
    completion_score: data.completionScore ?? data.completion_score ?? 0,
    is_verified: data.isVerified ?? data.is_verified ?? false,
    last_active_at: data.lastActiveAt ?? data.last_active_at,
    created_at: data.createdAt ?? data.created_at,
    updated_at: data.updatedAt ?? data.updated_at,
    verified_experiences: (data.verifiedExperiences ?? data.verified_experiences ?? []) as ExperienceCard[],
    address: data.address
      ? {
          id: data.address.id,
          provinceId: data.address.provinceId ?? data.address.province_id,
          province: data.address.province,
          regencyId: data.address.regencyId ?? data.address.regency_id,
          regency: data.address.regency,
          districtId: data.address.districtId ?? data.address.district_id,
          district: data.address.district,
          villageId: data.address.villageId ?? data.address.village_id,
          village: data.address.village,
          address: data.address.address,
          postalCode: data.address.postalCode ?? data.address.postal_code
        }
      : null
  }
}

let activeProfilePromise: Promise<Profile | null> | null = null

export const useProfile = () => {
  const profile = useState<Profile | null>('current_profile', () => null)
  const talentProfileState = useState<any | null>(
    'current_talent_profile',
    () => null
  )
  const isOnboarded = useState<boolean | null>('is_onboarded', () => null)

  // Fetch profil user yang login saat ini
  const getProfile = async (force = false): Promise<Profile | null> => {
    if (profile.value && !force) {
      if (!profile.value.username) {
        const { currentUsername } = useAuth()
        profile.value.username = currentUsername.value || ''
      }
      return profile.value
    }

    if (import.meta.client && activeProfilePromise && !force) {
      return activeProfilePromise
    }

    const fetchPromise = (async () => {
      try {
        const res = await ProfileService.getProfile()
        const mapped = mapProfile(res.data)
        if (mapped && !mapped.username) {
          const { currentUsername } = useAuth()
          mapped.username = currentUsername.value || ''
        }
        profile.value = mapped
        if (res.data?.talentProfile) {
          talentProfileState.value = {
            user_id: mapped?.id,
            experience_level: res.data.talentProfile.experienceLevel,
            goal: res.data.talentProfile.goal,
            project_count: res.data.talentProfile.projectCount,
            completed_projects: res.data.talentProfile.completedProjects,
            contribution_score: res.data.talentProfile.contributionScore
          }
        }
        return mapped
      } catch (err) {
        console.error('Failed to get current profile:', err)
        return null
      } finally {
        if (import.meta.client) {
          activeProfilePromise = null
        }
      }
    })()

    if (import.meta.client) {
      activeProfilePromise = fetchPromise
    }

    return fetchPromise
  }

  // Fetch profil talent spesifik berdasarkan username
  const getProfileByUsername = async (
    username: string
  ): Promise<Profile | null> => {
    try {
      const res = await ProfileService.getProfileByUsername(username)
      return mapProfile(res.data)
    } catch (err) {
      console.error(`Failed to get profile for username ${username}:`, err)
      return null
    }
  }

  // Fetch status onboarding
  const checkOnboardingStatus = async (force = false): Promise<boolean> => {
    if (isOnboarded.value !== null && !force) {
      return isOnboarded.value
    }
    const status = await ProfileService.checkOnboardingStatus()
    isOnboarded.value = status
    return status
  }

  // Action: update profile
  const updateProfile = async (payload: any) => {
    const apiPayload: any = {}
    if (payload.full_name !== undefined) apiPayload.fullName = payload.full_name
    if (payload.headline !== undefined) apiPayload.headline = payload.headline
    if (payload.bio !== undefined) apiPayload.bio = payload.bio
    if (payload.location !== undefined) apiPayload.location = payload.location
    if (payload.availability_status !== undefined)
      apiPayload.availabilityStatus = payload.availability_status
    if (payload.external_links !== undefined)
      apiPayload.externalLinks = payload.external_links
    if (payload.address !== undefined) apiPayload.address = payload.address
    if (payload.village_id !== undefined)
      apiPayload.villageId = payload.village_id
    if (payload.villageId !== undefined)
      apiPayload.villageId = payload.villageId
    if (payload.goal !== undefined) apiPayload.goal = payload.goal

    const res = await ProfileService.updateProfile(apiPayload)
    if (res.data) {
      profile.value = mapProfile(res.data)
      if (res.data.talentProfile) {
        talentProfileState.value = {
          user_id: profile.value?.id,
          experience_level: res.data.talentProfile.experienceLevel,
          goal: res.data.talentProfile.goal,
          project_count: res.data.talentProfile.projectCount,
          completed_projects: res.data.talentProfile.completedProjects,
          contribution_score: res.data.talentProfile.contributionScore
        }
      }
    }
    return res
  }

  // Action: onboarding
  const submitOnboarding = async (payload: SubmitOnboardingRequest) => {
    const res = await ProfileService.submitOnboarding(payload)
    // A successful onboarding response intentionally has no data payload.
    // Update the client cache based on the successful request itself.
    isOnboarded.value = true
    // Clear profile caches to force fresh load next time
    profile.value = null
    talentProfileState.value = null
    return res
  }

  // Get Talent Profile
  const getTalentProfile = async (userId: string, force = false) => {
    if (profile.value?.id === userId && talentProfileState.value && !force) {
      return talentProfileState.value
    }
    try {
      const res = await ProfileService.getProfile()
      const talent = res.data?.talentProfile || null
      if (talent) {
        const mappedTalent = {
          user_id: userId,
          experience_level: talent.experienceLevel,
          goal: talent.goal,
          project_count: talent.projectCount,
          completed_projects: talent.completedProjects,
          contribution_score: talent.contributionScore
        }
        if (profile.value?.id === userId) {
          talentProfileState.value = mappedTalent
        }
        return mappedTalent
      }
      return null
    } catch (err) {
      console.error('Failed to get talent profile:', err)
      return null
    }
  }

  // Update Talent Profile
  const updateTalentProfile = async (payload: { goal?: string | null }) => {
    console.warn(
      'Update talent profile (goal) belum didukung oleh Go API backend saat ini.'
    )
  }

  const getProfileWithRelations = async (
    username: string
  ): Promise<{
    profile: Profile
    talentProfile: TalentProfile | null
    skills: UserSkill[]
    tools: UserTool[]
  } | null> => {
    try {
      const res = await ProfileService.getProfileByUsername(username)
      if (!res.data) return null

      const profile = mapProfile(res.data)
      if (!profile) return null

      const talentProfile = res.data.talentProfile
        ? {
            user_id: profile.id,
            experience_level: res.data.talentProfile.experienceLevel,
            goal: res.data.talentProfile.goal,
            project_count: res.data.talentProfile.projectCount,
            completed_projects: res.data.talentProfile.completedProjects,
            contribution_score: res.data.talentProfile.contributionScore
          }
        : null

      const skills = (res.data.skills || []).map((s: any) => ({
        id: s.id,
        skill_id: s.skillId,
        is_primary: s.isPrimary,
        skills: { name: s.name, category: s.category }
      }))

      const tools = (res.data.tools || []).map((t: any) => ({
        id: t.id,
        tool_id: t.toolId,
        tools: { name: t.name, category: t.category }
      }))

      return { profile, talentProfile, skills, tools }
    } catch (err) {
      console.error(
        `Failed to get profile with relations for username ${username}:`,
        err
      )
      return null
    }
  }

  const getPublicCareers = async (username: string): Promise<any[]> => {
    try {
      const res = await ProfileService.getPublicCareers(username)
      return (res.data || []).map((ch) => ({
        id: ch.id,
        title: ch.title,
        company: ch.company,
        start_year: ch.startYear,
        end_year: ch.endYear || null,
        description: ch.description || ''
      }))
    } catch (err) {
      console.error(`Failed to get public careers for ${username}:`, err)
      return []
    }
  }

  const getPublicPortfolio = async (username: string): Promise<any[]> => {
    try {
      const res = await ProfileService.getPublicPortfolio(username)
      return (res.data || []).map((p) => ({
        id: p.projectId,
        title: p.title,
        slug: p.slug
      }))
    } catch (err) {
      console.error(`Failed to get public portfolio for ${username}:`, err)
      return []
    }
  }

  const getChecklist = (
    profile: Profile | null,
    skills: UserSkill[],
    tools: UserTool[]
  ) => getProfileCompletionItems(profile, skills, tools)

  return {
    getProfile,
    getProfileByUsername,
    getTalentProfile,
    updateProfile,
    updateTalentProfile,
    submitOnboarding,
    checkOnboardingStatus,
    getChecklist,
    getProfileWithRelations,
    getPublicCareers,
    getPublicPortfolio
  }
}
