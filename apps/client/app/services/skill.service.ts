import type { Skill, Tool } from '../types/skill'
import type { ApiResponse } from '../types/api'

export const SkillService = {
  async getSkills(): Promise<Skill[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<Skill[]>>('/master-data/skills')
    return res.data || []
  },

  async getTools(): Promise<Tool[]> {
    const { $api } = useApi()
    const res = await $api<ApiResponse<Tool[]>>('/master-data/tools')
    return res.data || []
  }
}
