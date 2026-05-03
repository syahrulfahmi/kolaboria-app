import type { SubmitOnboardingRequest } from '../types/profile'

export const ProfileService = {
  async getProfile(client: any, userId: string) {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async submitOnboarding(
    client: any,
    userId: string,
    payload: SubmitOnboardingRequest
  ) {
    // 1. Update profiles: set account_type = 'talent' + bio
    const { error: profileError } = await client
      .from('profiles')
      .update({
        account_type: 'talent',
        bio: payload.bio || null,
        ...(payload.externalLink
          ? { external_links: { website: payload.externalLink } }
          : {})
      })
      .eq('id', userId)

    if (profileError) throw profileError

    // 2. Upsert talent_profiles (without skills/tools)
    const { error: talentError } = await client.from('talent_profiles').upsert({
      user_id: userId,
      experience_level: payload.experienceLevel,
      goal: payload.goal || null
    })

    if (talentError) throw talentError

    // 3. Insert primary skill to user_skills
    const { error: skillError } = await client.from('user_skills').upsert({
      user_id: userId,
      skill_id: payload.primarySkillId,
      is_primary: true
    }, { onConflict: 'user_id, skill_id' })

    if (skillError) throw skillError

    // 4. Insert tools to user_tools
    if (payload.toolIds && payload.toolIds.length > 0) {
      const toolInserts = payload.toolIds.map(toolId => ({
        user_id: userId,
        tool_id: toolId
      }))
      const { error: toolError } = await client.from('user_tools').upsert(
        toolInserts,
        { onConflict: 'user_id, tool_id' }
      )
      
      if (toolError) throw toolError
    }
  },

  async checkOnboardingStatus(client: any, userId: string): Promise<boolean> {
    const { data, error } = await client
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error(error)
      return false
    }

    return !!data?.account_type
  }
}
