import { ProfileService } from '../services/profile.service'
import type {
  SubmitOnboardingRequest,
  Profile,
  UserSkill,
  UserTool
} from '../types/profile'
import { getProfileCompletionItems } from '../utils/profileCompletion'

export const useProfile = () => {
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()

  const getProfile = async () => {
    if (!user.value) return null
    return await ProfileService.getProfile(client, user.value.id)
  }

  const getProfileByUsername = async (username: string) => {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  const getTalentProfile = async (userId: string) => {
    const { data, error } = await client
      .from('talent_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  const updateProfile = async (payload: Partial<Profile>) => {
    if (!user.value) throw new Error('User tidak ditemukan')

    const { error } = await client
      .from('profiles')
      .update(payload)
      .eq('id', user.value.id)

    if (error) throw error
  }

  const updateTalentProfile = async (payload: { goal?: string | null }) => {
    if (!user.value) throw new Error('User tidak ditemukan')

    const existing = await getTalentProfile(user.value.id)
    const query = existing
      ? client
          .from('talent_profiles')
          .update({ goal: payload.goal || null })
          .eq('user_id', user.value.id)
      : client.from('talent_profiles').insert({
          user_id: user.value.id,
          experience_level: 'entry',
          goal: payload.goal || null
        })

    const { error } = await query
    if (error) throw error
  }

  const submitOnboarding = async (payload: SubmitOnboardingRequest) => {
    if (!user.value) throw new Error('User tidak ditemukan')
    await ProfileService.submitOnboarding(client, user.value.id, payload)
  }

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!user.value) return false
    return await ProfileService.checkOnboardingStatus(client, user.value.id)
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
    getChecklist
  }
}
