import { ref } from 'vue'
import { SkillService } from '../services/skill.service'
import { useApi } from './useApi'
import type { Skill, Tool } from '../types/skill'
import type { UserSkill, UserTool } from '../types/profile'
import type { ApiResponse } from '../types/api'

interface UserSkillDTO {
  id: string
  skillId: string
  name: string
  category: string
  slug: string
  isPrimary: boolean
}

interface UserToolDTO {
  id: string
  toolId: string
  name: string
  category: string | null
  slug: string
}

export const useSkill = () => {
  const { $api } = useApi()
  const skills = ref<Skill[]>([])
  const tools = ref<Tool[]>([])
  const isLoadingSkills = ref(false)
  const isLoadingTools = ref(false)

  const loadSkills = async () => {
    isLoadingSkills.value = true
    try {
      skills.value = await SkillService.getSkills()
    } catch (e) {
      console.error('Failed to load skills:', e)
    } finally {
      isLoadingSkills.value = false
    }
  }

  const loadTools = async () => {
    isLoadingTools.value = true
    try {
      tools.value = await SkillService.getTools()
    } catch (e) {
      console.error('Failed to load tools:', e)
    } finally {
      isLoadingTools.value = false
    }
  }

  const getUserSkills = async (userId?: string): Promise<UserSkill[]> => {
    try {
      // Pada Go backend, kita menarik daftar skill user aktif dari /profiles/me/skills
      const res = await $api<ApiResponse<UserSkillDTO[]>>('/profiles/me/skills')
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
    await $api<ApiResponse<null>>('/profiles/me/skills', {
      method: 'POST',
      body: {
        skillId,
        isPrimary
      }
    })
  }

  const removeSkill = async (userSkillId: string) => {
    await $api<ApiResponse<null>>(`/profiles/me/skills/${userSkillId}`, {
      method: 'DELETE'
    })
  }

  const setPrimarySkill = async (userSkillId: string) => {
    await $api<ApiResponse<null>>(`/profiles/me/skills/${userSkillId}/primary`, {
      method: 'PATCH'
    })
  }

  const getUserTools = async (userId?: string): Promise<UserTool[]> => {
    try {
      const res = await $api<ApiResponse<UserToolDTO[]>>('/profiles/me/tools')
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
    await $api<ApiResponse<null>>('/profiles/me/tools', {
      method: 'POST',
      body: {
        toolId
      }
    })
  }

  const removeUserTool = async (userToolId: string) => {
    await $api<ApiResponse<null>>(`/profiles/me/tools/${userToolId}`, {
      method: 'DELETE'
    })
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
