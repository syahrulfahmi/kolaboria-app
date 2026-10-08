import { ProfileService } from '../services/profile.service'
import type {
  SubmitOnboardingRequest,
  Profile,
  UserSkill,
  UserTool,
  TalentProfile
} from '../types/profile'
import { getProfileCompletionItems } from '../utils/profileCompletion'
import type { ExperienceCard } from '../types/experience'
import type { ProfileResponse, UpdateProfileRequest } from '../types/profile-api'

function mapProfile(data: ProfileResponse | null | undefined): Profile | null {
  if (!data) return null
  const legacyAddress =
    typeof data.address === 'object' && data.address ? data.address : null
  const address = data.village
    ? {
        id: '',
        provinceId: 0,
        province: data.village.province,
        regencyId: 0,
        regency: data.village.regency,
        districtId: 0,
        district: data.village.district,
        villageId: data.village.village_id,
        village: data.village.village,
        address: typeof data.address === 'string' ? data.address : '',
        postalCode: data.village.postal_code
      }
    : legacyAddress
      ? legacyAddress
      : typeof data.address === 'string' && data.address
        ? {
            id: '',
            provinceId: 0,
            province: '',
            regencyId: 0,
            regency: '',
            districtId: 0,
            district: '',
            villageId: 0,
            village: '',
            address: data.address,
            postalCode: ''
          }
        : null
  const legacyLocation = legacyAddress
    ? [legacyAddress.regency, legacyAddress.province].filter(Boolean).join(', ')
    : null

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name ?? data.fullName ?? null,
    account_type: (data.account_type ?? data.accountType ?? null) as Profile['account_type'],
    system_role: (data.system_role ?? data.systemRole ?? null) as Profile['system_role'],
    avatar: data.avatar ?? null,
    headline: data.headline ?? null,
    bio: data.bio ?? null,
    location: data.location ?? legacyLocation,
    availability_status: (data.availability_status ?? data.availabilityStatus ?? null) as Profile['availability_status'],
    external_links: data.external_links ?? data.externalLinks ?? {},
    rating: data.rating ?? 0,
    review_count: data.review_count ?? data.reviewCount ?? 0,
    completion_score: data.completion_score ?? data.completionScore ?? 0,
    is_verified: data.is_verified ?? data.isVerified ?? false,
    last_active_at: data.last_active_at ?? data.lastActiveAt ?? '',
    created_at: data.created_at ?? data.createdAt ?? '',
    updated_at: data.updated_at ?? data.updatedAt ?? '',
    verified_experiences: (data.verified_experiences ?? data.verifiedExperiences ?? []) as ExperienceCard[],
    address
  }
}

let activeProfilePromise: Promise<Profile | null> | null = null

export const useProfile = () => {
  const profile = useState<Profile | null>('current_profile', () => null)
  const talentProfileState = useState<TalentProfile | null>(
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
        const talent = res.data?.talent_profile ?? (res.data?.talentProfile
          ? {
              experience_level: res.data.talentProfile.experienceLevel,
              goal: res.data.talentProfile.goal
            }
          : null)
        if (talent) {
          talentProfileState.value = {
            user_id: mapped?.id,
            experience_level: talent.experience_level,
            goal: talent.goal,
            project_count: 0,
            completed_projects: 0,
            contribution_score: 0
          }
        } else {
          talentProfileState.value = null
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
  const checkOnboardingStatus = async (force = false, options: { throwOnError?: boolean } = {}): Promise<boolean> => {
    if (isOnboarded.value !== null && !force) {
      return isOnboarded.value
    }
    const status = await ProfileService.checkOnboardingStatus(options)
    isOnboarded.value = status
    return status
  }

  // Action: update profile
  const updateProfile = async (payload: UpdateProfileRequest) => {
    const res = await ProfileService.updateProfile(payload)
    if (res.data) {
      profile.value = mapProfile(res.data)
      const talent = res.data.talent_profile ?? (res.data.talentProfile
        ? {
            experience_level: res.data.talentProfile.experienceLevel,
            goal: res.data.talentProfile.goal
          }
        : null)
      if (talent) {
        talentProfileState.value = {
          user_id: profile.value?.id,
          experience_level: talent.experience_level,
          goal: talent.goal,
          project_count: 0,
          completed_projects: 0,
          contribution_score: 0
        }
      } else {
        talentProfileState.value = null
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
      const talent = res.data?.talent_profile ?? (res.data?.talentProfile
        ? {
            experience_level: res.data.talentProfile.experienceLevel,
            goal: res.data.talentProfile.goal
          }
        : null)
      if (talent) {
        const mappedTalent = {
          user_id: userId,
          experience_level: talent.experience_level,
          goal: talent.goal,
          project_count: 0,
          completed_projects: 0,
          contribution_score: 0
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

      const talent = res.data.talent_profile ?? (res.data.talentProfile
        ? {
            experience_level: res.data.talentProfile.experienceLevel,
            goal: res.data.talentProfile.goal
          }
        : null)
      const talentProfile = talent
        ? {
            user_id: profile.id,
            experience_level: talent.experience_level,
            goal: talent.goal,
            project_count: 0,
            completed_projects: 0,
            contribution_score: 0
          }
        : null

      const skills = (res.data.skills || []).map((s) => ({
        id: s.id,
        skill_id: s.skill_id ?? s.skillId ?? '',
        is_primary: s.is_primary ?? s.isPrimary ?? false,
        skills: { name: s.name, category: '' }
      }))

      const tools = (res.data.tools || []).map((t) => ({
        id: t.id,
        tool_id: t.tool_id ?? t.toolId ?? '',
        tools: { name: t.name, category: null }
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

  const getPublicCareers = async (username: string) => {
    try {
      const res = await ProfileService.getPublicCareers(username)
      return (res.data || []).map((ch) => ({
        id: ch.id,
        title: ch.title,
        company: ch.company,
        start_year: ch.start_year ?? ch.startYear ?? 0,
        start_month: ch.start_month ?? null,
        end_year: ch.end_year ?? ch.endYear ?? null,
        end_month: ch.end_month ?? null,
        description: ch.description || ''
      }))
    } catch (err) {
      console.error(`Failed to get public careers for ${username}:`, err)
      return []
    }
  }

  const getPublicPortfolio = async (username: string) => {
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
    submitOnboarding,
    checkOnboardingStatus,
    getChecklist,
    getProfileWithRelations,
    getPublicCareers,
    getPublicPortfolio
  }
}
