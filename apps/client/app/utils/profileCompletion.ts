import type { Profile, UserSkill, UserTool } from '../types/profile'

export interface CompletionItem {
  key: 'skill' | 'bio' | 'tools' | 'headline' | 'location'
  label: string
  weight: number
  done: boolean
}

export const clampCompletionScore = (score?: number | null) => {
  if (!Number.isFinite(score)) return 0
  return Math.min(100, Math.max(0, Number(score)))
}

export const getProfileCompletionItems = (
  profile: Profile | null,
  skills: UserSkill[] = [],
  tools: UserTool[] = []
): CompletionItem[] => [
  {
    key: 'skill',
    label: 'Primary skill',
    weight: 30,
    done: skills.length > 0
  },
  {
    key: 'bio',
    label: 'Bio',
    weight: 20,
    done: !!profile?.bio?.trim()
  },
  {
    key: 'tools',
    label: 'Tools',
    weight: 20,
    done: tools.length > 0
  },
  {
    key: 'headline',
    label: 'Headline',
    weight: 15,
    done: !!profile?.headline?.trim()
  },
  {
    key: 'location',
    label: 'Location',
    weight: 15,
    done: !!profile?.location?.trim()
  }
]
