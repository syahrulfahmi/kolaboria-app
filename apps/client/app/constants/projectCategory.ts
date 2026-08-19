export type ProjectCategory =
  | 'product'
  | 'community'
  | 'open_source'
  | 'research'
  | 'education'
  | 'business'
  | 'other'

export const PROJECT_CATEGORY_OPTIONS = [
  { value: 'product', label: 'Product' },
  { value: 'community', label: 'Community' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'research', label: 'Research' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Lainnya' }
] as const satisfies ReadonlyArray<{ value: ProjectCategory; label: string }>

export const getProjectCategoryLabel = (
  value: ProjectCategory | string
): string =>
  PROJECT_CATEGORY_OPTIONS.find((option) => option.value === value)?.label ??
  'Lainnya'
