import type { Skill, Tool } from '../types/skill'

export const SkillService = {
  async getSkills(client: any): Promise<Skill[]> {
    const { data, error } = await client
      .from('skills')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  async getTools(client: any): Promise<Tool[]> {
    const { data, error } = await client.from('tools').select('*').order('name')

    if (error) throw error
    return data || []
  }
}
