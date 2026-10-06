import { ref } from 'vue'
import { MasterService } from '../services/master.service'
import { ProfileService } from '../services/profile.service'
import type { Skill, Tool } from '../types/skill'
import type { UserSkill, UserTool } from '../types/profile'

export const useSkill = () => {
  type FetchOptions = { throwOnError?: boolean }

  const skills = ref<Skill[]>([])
  const tools = ref<Tool[]>([])
  const isLoadingSkills = ref(false)
  const isLoadingTools = ref(false)

  const loadSkills = async (options: FetchOptions = {}) => {
    isLoadingSkills.value = true
    try {
      skills.value = await MasterService.getSkills()
    } catch (e) {
      console.error('Failed to load skills:', e)
      if (options.throwOnError) throw e
    } finally {
      isLoadingSkills.value = false
    }
  }

  const loadTools = async (options: FetchOptions = {}) => {
    isLoadingTools.value = true
    try {
      tools.value = await MasterService.getTools()
    } catch (e) {
      console.error('Failed to load tools:', e)
      if (options.throwOnError) throw e
    } finally {
      isLoadingTools.value = false
    }
  }

  const getUserSkills = async (
    _userId?: string,
    options: FetchOptions = {}
  ): Promise<UserSkill[]> => {
    try {
      const res = await ProfileService.getMySkills()
      return (res.data || []).map((s) => ({
        id: s.id,
        skill_id: s.skill_id,
        is_primary: s.is_primary,
        skills: { name: s.name, category: '' }
      }))
    } catch (err) {
      console.error('Failed to get user skills:', err)
      if (options.throwOnError) throw err
      return []
    }
  }

  const addSkill = async (skillId: string, isPrimary = false) => {
    await ProfileService.addSkill({ skillId, isPrimary })
  }

  const removeSkill = async (userSkillId: string) => {
    await ProfileService.removeSkill(userSkillId)
  }

  const setPrimarySkill = async (userSkillId: string) => {
    await ProfileService.setPrimarySkill(userSkillId)
  }

  const getUserTools = async (
    _userId?: string,
    options: FetchOptions = {}
  ): Promise<UserTool[]> => {
    try {
      const res = await ProfileService.getMyTools()
      return (res.data || []).map((t) => ({
        id: t.id,
        tool_id: t.tool_id,
        tools: { name: t.name, category: null, slug: t.slug }
      }))
    } catch (err) {
      console.error('Failed to get user tools:', err)
      if (options.throwOnError) throw err
      return []
    }
  }

  const addUserTool = async (toolId: string) => {
    await ProfileService.addTool({ toolId })
  }

  const removeUserTool = async (userToolId: string) => {
    await ProfileService.removeTool(userToolId)
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
    setPrimarySkill,
    getUserTools,
    addUserTool,
    removeUserTool
  }
}
