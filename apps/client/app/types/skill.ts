// --- Model ---
export interface Skill {
  id: string
  name: string
  slug: string
  category?: string | null
}

export interface Tool {
  id: string
  name: string
  slug: string
  category?: string | null
}

export interface UserSkill {
  id: string
  userId: string
  skillId: string
  isPrimary: boolean
}

export interface UserTool {
  id: string
  userId: string
  toolId: string
}
