import type { ProjectEditorDraft, ProjectEditorMode } from '~/types/project-editor'

export interface ProjectEditorRecoveryRecord {
  schema_version: 1
  account_id: string
  scope: string
  attempt_id: string
  project_id: string | null
  base_version: number | null
  saved_at: string
  draft: ProjectEditorDraft
}

export type LegacyProjectEditorText = Partial<Pick<
  ProjectEditorDraft,
  'title' | 'summary' | 'description' | 'why_collaborative' |
  'contributor_outcome' | 'owner_commitment' | 'lead_expectations'
>>

export const createProjectEditorRecoveryStorageKey = (accountId: string, scope: string) =>
  `kolaboria:project-editor-recovery:v1:${encodeURIComponent(accountId || 'unknown-account')}:${encodeURIComponent(scope)}`

export const getProjectEditorRecoveryScope = (
  mode: ProjectEditorMode,
  creationScope: string,
  projectId?: string | null
) => mode === 'edit'
  ? projectId ? `project:${projectId}` : 'project:unloaded'
  : `create:${creationScope}`

export const extractLegacyProjectEditorText = (value: unknown): LegacyProjectEditorText | null => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  const outer = value as Record<string, unknown>
  const candidate = typeof outer.draft === 'object' && outer.draft !== null && !Array.isArray(outer.draft)
    ? outer.draft as Record<string, unknown>
    : outer
  const fields: Array<keyof LegacyProjectEditorText> = [
    'title', 'summary', 'description', 'why_collaborative',
    'contributor_outcome', 'owner_commitment', 'lead_expectations'
  ]
  const result: LegacyProjectEditorText = {}
  for (const field of fields) {
    if (typeof candidate[field] === 'string') result[field] = candidate[field]
  }
  return Object.keys(result).length ? result : null
}
