import { MasterService } from './master.service'
import type { Skill, Tool } from '../types/skill'

/**
 * SkillService - Backward compatible proxy to MasterService
 * @deprecated Use MasterService directly for master data, or ProfileService for user skills
 */
export const SkillService = {
  getSkills: MasterService.getSkills,
  getTools: MasterService.getTools
}

export type { Skill, Tool }
