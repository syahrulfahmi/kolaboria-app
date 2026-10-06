export const EXPERIENCE_LEVEL_VALUES = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
] as const

export const EXPERIENCE_LEVELS = [
  { value: EXPERIENCE_LEVEL_VALUES[0], desc: '0–1 tahun' },
  { value: EXPERIENCE_LEVEL_VALUES[1], desc: '1–3 tahun' },
  { value: EXPERIENCE_LEVEL_VALUES[2], desc: '3–5 tahun' },
  { value: EXPERIENCE_LEVEL_VALUES[3], desc: '5+ tahun' }
] as const

export const PROFILE_EXPERIENCE_LEVELS = [
  {
    value: EXPERIENCE_LEVEL_VALUES[0],
    label: 'Pemula',
    description: '0–2 Tahun'
  },
  {
    value: EXPERIENCE_LEVEL_VALUES[1],
    label: 'Menengah',
    description: '3–5 Tahun'
  },
  {
    value: EXPERIENCE_LEVEL_VALUES[2],
    label: 'Mahir',
    description: '3–5 tahun'
  },
  { value: EXPERIENCE_LEVEL_VALUES[3], label: 'Ahli', description: '5+ tahun' }
] as const
