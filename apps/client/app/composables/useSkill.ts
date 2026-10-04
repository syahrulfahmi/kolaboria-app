import { ref } from 'vue'
import { MasterService } from '../services/master.service'
import { ProfileService } from '../services/profile.service'
import type { Skill, Tool } from '../types/skill'
import type { UserSkill, UserTool } from '../types/profile'

export const useSkill = () => {
  const skills = ref<Skill[]>([])
  const tools = ref<Tool[]>([])
  const isLoadingSkills = ref(false)
  const isLoadingTools = ref(false)

  const loadSkills = async () => {
    isLoadingSkills.value = true
    try {
      skills.value = await MasterService.getSkills()
    } catch (e) {
      console.error('Failed to load skills:', e)
    } finally {
      isLoadingSkills.value = false
    }
  }

  const loadTools = async () => {
    isLoadingTools.value = true
    try {
      tools.value = await MasterService.getTools()
    } catch (e) {
      console.error('Failed to load tools:', e)
    } finally {
      isLoadingTools.value = false
    }
  }

  const getUserSkills = async (_userId?: string): Promise<UserSkill[]> => {
    try {
      const res = await ProfileService.getMySkills()
      return (res.data || []).map((s) => ({
        id: s.id,
        skill_id: s.skillId,
        is_primary: s.isPrimary,
        skills: { name: s.name, category: s.category }
      }))
    } catch (err) {
      console.error('Failed to get user skills:', err)
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

  const getUserTools = async (_userId?: string): Promise<UserTool[]> => {
    try {
      const res = await ProfileService.getMyTools()
      return (res.data || []).map((t) => ({
        id: t.id,
        tool_id: t.toolId,
        tools: { name: t.name, category: t.category, slug: t.slug }
      }))
    } catch (err) {
      console.error('Failed to get user tools:', err)
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
