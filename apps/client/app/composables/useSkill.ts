import { ref } from 'vue'
import { SkillService } from '../services/skill.service'
import type { Skill, Tool } from '../types/skill'
import type { UserSkill } from '../types/profile'

export const useSkill = () => {
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()
  const skills = ref<Skill[]>([])
  const tools = ref<Tool[]>([])
  const isLoadingSkills = ref(false)
  const isLoadingTools = ref(false)

  const loadSkills = async () => {
    isLoadingSkills.value = true
    try {
      skills.value = await SkillService.getSkills(client)
    } catch (e) {
      console.error('Failed to load skills:', e)
    } finally {
      isLoadingSkills.value = false
    }
  }

  const loadTools = async () => {
    isLoadingTools.value = true
    try {
      tools.value = await SkillService.getTools(client)
    } catch (e) {
      console.error('Failed to load tools:', e)
    } finally {
      isLoadingTools.value = false
    }
  }

  const getUserSkills = async (userId: string): Promise<UserSkill[]> => {
    const { data, error } = await client
      .from('user_skills')
      .select('*, skills(*)')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })

    if (error) throw error
    return data || []
  }

  const addSkill = async (skillId: string, isPrimary = false) => {
    if (!user.value) throw new Error('User tidak ditemukan')
    if (isPrimary) {
      await client
        .from('user_skills')
        .update({ is_primary: false })
        .eq('user_id', user.value.id)
    }

    const { error } = await client
      .from('user_skills')
      .upsert({
        user_id: user.value.id,
        skill_id: skillId,
        is_primary: isPrimary
      }, { onConflict: 'user_id, skill_id' })
    if (error) throw error
  }

  const removeSkill = async (userSkillId: string) => {
    const { error } = await client
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
    if (error) throw error
  }

  const setPrimarySkill = async (userSkillId: string) => {
    if (!user.value) throw new Error('User tidak ditemukan')
    // First, set all to false
    const { error: resetError } = await client
      .from('user_skills')
      .update({ is_primary: false })
      .eq('user_id', user.value.id)
    if (resetError) throw resetError
      
    // Then set the selected one to true
    const { error } = await client
      .from('user_skills')
      .update({ is_primary: true })
      .eq('id', userSkillId)
    if (error) throw error
  }

  return {
    skills,
    tools,
    isLoadingSkills,
    isLoadingTools,
    loadSkills,
    loadTools,
    getUserSkills,
    addSkill,
    removeSkill,
    setPrimarySkill
  }
}
