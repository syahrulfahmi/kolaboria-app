import type { ProjectEditorDraft, ProjectEditorReferences } from '../types/project-editor'

const makeBlankDraft = (): ProjectEditorDraft => ({
  creation_mode: 'personal',
  initiator_organization_id: null,
  lead_expectations: '',
  title: '',
  summary: '',
  description: '',
  slug: '',
  project_category: 'product',
  visibility: 'public',
  roles: [
    {
      client_key: 'role-create-1',
      description: '',
      capacity: 1,
      filled_capacity: 0,
      tool_ids: [],
      skill_ids: []
    }
  ],
  origin: 'personal',
  why_collaborative: '',
  contributor_outcome: '',
  owner_commitment: '',
  client_acknowledgement: false,
  start_date: null,
  deadline: null,
  availability: 'flexible',
  hours_per_week: 10,
  collaboration_agreement: false
})

export const createBlankProjectEditorDraft = (): ProjectEditorDraft =>
  structuredClone(makeBlankDraft())

export const createEmptyProjectEditorReferences = (): ProjectEditorReferences => ({
  contribution_roles: [],
  skills: [],
  tools: []
})
