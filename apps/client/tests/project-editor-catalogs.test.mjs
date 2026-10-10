import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'
import { mountComponent, mountSetup } from './helpers/frontend-runtime.mjs'
const { createEmptyProjectEditorReferences } = await import('./helpers/project-editor-fixtures.ts')
const { useProjectEditorCatalogs } = await import('../app/composables/useProjectEditorCatalogs.ts')
const { default: ProjectEditorRoleCard } = await import('../app/components/project/editor/ProjectEditorRoleCard.vue')

const skill = { id: 'e61e074d-34a6-5235-93d7-c2b47ed74f02', name: 'Frontend Development', slug: 'frontend-development' }
const tool = { id: 'c04676b1-1823-54a3-8d5e-f84bb73305b6', name: 'Nuxt', slug: 'nuxt' }
const contributionRole = { id: '5838d3f2-7c00-5cc7-bf80-96e063b006e1', name: 'Frontend Developer', slug: 'frontend-developer' }
const projectRoleId = '50000000-0000-4000-8000-000000000001'

const makeDetail = () => ({
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'brief', status: 'draft', version: 2,
  created_at: '2026-10-01T00:00:00.000Z', updated_at: '2026-10-08T00:00:00.000Z', published_at: null,
  creation_mode: 'personal', initiator_organization_id: null,
  title: 'Brief', summary: '', description: '', project_category: 'product', visibility: 'public',
  origin: 'personal', why_collaborative: '', contributor_outcome: '', owner_commitment: '', lead_expectations: '',
  client_acknowledgement: false, start_date: null, deadline: null, availability: 'flexible', hours_per_week: 10,
  collaboration_agreement: false,
  ownership: { created_by_user_id: 'user-a', initiator_user_id: 'user-a', initiator_organization_id: null, owner_id: 'user-a', show_initiator: false, can_accept_contributors: false },
  owner_role: { contribution_role_id: contributionRole.id, contribution_role: contributionRole },
  roles: [{ id: projectRoleId, contribution_role_id: contributionRole.id, contribution_role: contributionRole, description: '', capacity: 1, position: 0, skill_ids: [skill.id, '22222222-2222-4222-8222-222222222222'], skills: [skill], tool_ids: [tool.id, '33333333-3333-4333-8333-333333333333'], tools: [tool], filled_capacity: 0, remaining_capacity: 1, status: 'open' }]
})

const mountCatalogs = (options) => mountSetup(() => useProjectEditorCatalogs(options))

test('catalog loads once on first open, concurrent callers await the same request, and success is cached', async () => {
  let calls = 0
  let resolveSkills
  const request = new Promise(resolve => { resolveSkills = resolve })
  const references = createEmptyProjectEditorReferences()
  const editor = mountCatalogs({ references, loaders: { skills: () => { calls += 1; return request } } })

  const first = editor.bindings.ensureCatalog('skills')
  const second = editor.bindings.ensureCatalog('skills')
  await Promise.resolve()
  assert.equal(calls, 1)
  let secondSettled = false
  second.then(() => { secondSettled = true })
  await Promise.resolve()
  assert.equal(secondSettled, false)
  resolveSkills([skill])
  await Promise.all([first, second])

  assert.equal(editor.bindings.catalogStates.skills.loaded, true)
  assert.deepEqual(references.skills, [skill])
  await editor.bindings.ensureCatalog('skills')
  assert.equal(calls, 1)
  editor.unmount()
})

test('failed catalogs remain retryable and do not expose raw backend errors', async () => {
  let calls = 0
  const references = createEmptyProjectEditorReferences()
  const editor = mountCatalogs({
    references,
    loaders: { tools: async () => { calls += 1; if (calls === 1) throw new Error('database password secret'); return [tool] } }
  })

  await editor.bindings.ensureCatalog('tools')
  assert.equal(editor.bindings.catalogStates.tools.loaded, false)
  assert.ok(editor.bindings.catalogStates.tools.error)
  assert.doesNotMatch(editor.bindings.catalogStates.tools.error, /database|password|secret/i)
  await editor.bindings.ensureCatalog('tools')
  assert.equal(editor.bindings.catalogStates.tools.loaded, true)
  assert.deepEqual(references.tools, [tool])
  assert.equal(calls, 2)
  editor.unmount()
})

test('selected detail metadata hydrates labels without marking the full catalog loaded or changing form IDs', () => {
  const references = createEmptyProjectEditorReferences()
  const draft = { owner_contribution_role_id: contributionRole.id, roles: [{ id: projectRoleId, skill_ids: [skill.id, '22222222-2222-4222-8222-222222222222'], tool_ids: [tool.id, '33333333-3333-4333-8333-333333333333'] }] }
  const before = structuredClone(draft)
  const editor = mountCatalogs({ references })

  editor.bindings.hydrateSelected(makeDetail())
  const role = { ...makeDetail().roles[0], client_key: projectRoleId }
  const roleCard = mountComponent(ProjectEditorRoleCard, {
    role,
    index: 0,
    totalRoles: 1,
    catalogStates: editor.bindings.catalogStates,
    references,
    errors: {},
    disabled: false
  })

  assert.deepEqual(draft, before)
  assert.equal(references.skills[0].name, skill.name)
  assert.equal(references.tools[0].name, tool.name)
  assert.equal(references.contribution_roles[0].name, contributionRole.name)
  assert.equal(editor.bindings.catalogStates.skills.loaded, false)
  assert.equal(editor.bindings.catalogStates.tools.loaded, false)
  assert.equal(roleCard.bindings.roleOptions[0].label, contributionRole.name)
  assert.equal(roleCard.bindings.toolOptions[0].label, tool.name)
  roleCard.unmount()
  editor.unmount()
})

test('null owner detail never selects a default professional role', () => {
  const references = createEmptyProjectEditorReferences()
  const draft = { owner_contribution_role_id: undefined }
  const editor = mountCatalogs({ references })
  const detail = makeDetail()
  detail.owner_role = null

  editor.bindings.hydrateSelected(detail)

  assert.equal(draft.owner_contribution_role_id, undefined)
  assert.equal(references.contribution_roles.length, 1)
  editor.unmount()
})

test('late catalog response after account scope change cannot update the active references', async () => {
  let scope = 'account-a'
  let resolveSkills
  const request = new Promise(resolve => { resolveSkills = resolve })
  const references = createEmptyProjectEditorReferences()
  const editor = mountCatalogs({ references, scopeKey: () => scope, loaders: { skills: () => request } })
  const pending = editor.bindings.ensureCatalog('skills')
  scope = 'account-b'
  resolveSkills([skill])
  await pending

  assert.deepEqual(references.skills, [])
  assert.equal(editor.bindings.catalogStates.skills.loaded, false)
  editor.unmount()
})

test('late catalog response after disposal cannot mutate its references', async () => {
  let resolveSkills
  const request = new Promise(resolve => { resolveSkills = resolve })
  const references = createEmptyProjectEditorReferences()
  const editor = mountCatalogs({ references, loaders: { skills: () => request } })
  const pending = editor.bindings.ensureCatalog('skills')
  editor.unmount()
  resolveSkills([skill])
  await pending

  assert.deepEqual(references.skills, [])
})
