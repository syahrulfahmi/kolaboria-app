import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'
import { createProjectEditorFixture } from '../app/data/project-editor-fixtures.ts'
import { toProjectDefinition, toProjectEditorRecord } from '../app/utils/project-editor-api.ts'

const projectId = '11111111-1111-4111-8111-111111111111'
const roleId = '44444444-4444-4444-8444-444444444444'
const contributionRoleId = '11111111-1111-4111-8111-111111111112'
const skillId = '22222222-2222-4222-8222-222222222221'
const toolId = '33333333-3333-4333-8333-333333333331'

const detailResponse = () => ({
  id: projectId,
  slug: 'brief-server',
  status: 'open',
  version: 7,
  created_at: '2026-10-01T00:00:00.000Z',
  updated_at: '2026-10-08T00:00:00.000Z',
  creation_mode: 'personal',
  initiator_organization_id: null,
  title: 'Brief server',
  summary: 'Ringkasan server',
  description: 'Deskripsi yang dibaca dari API.',
  project_category: 'product',
  visibility: 'invite_only',
  origin: 'community',
  why_collaborative: 'Butuh banyak perspektif.',
  contributor_outcome: 'Portofolio kolaborasi.',
  owner_commitment: 'Saya aktif review.',
  lead_expectations: '',
  client_acknowledgement: false,
  start_date: null,
  deadline: '2026-12-01',
  availability: 'part_time',
  hours_per_week: 10,
  collaboration_agreement: true,
  ownership: {
    created_by_user_id: projectId,
    initiator_user_id: projectId,
    initiator_organization_id: null,
    owner_id: projectId,
    show_initiator: false,
    can_accept_contributors: true
  },
  owner_role: null,
  roles: [{
    id: roleId,
    contribution_role_id: contributionRoleId,
    contribution_role: { id: contributionRoleId, name: 'Frontend Developer', slug: 'frontend' },
    description: 'Membangun tampilan.',
    capacity: 2,
    position: 0,
    skill_ids: [skillId],
    skills: [{ id: skillId, name: 'Vue', slug: 'vue' }],
    tool_ids: [toolId],
    tools: [{ id: toolId, name: 'Nuxt', slug: 'nuxt' }],
    filled_capacity: 1,
    remaining_capacity: 1,
    status: 'open'
  }]
})

test('definition serializer writes all editor fields with master IDs and omits UI or server-owned fields', () => {
  const fixture = createProjectEditorFixture('platform-portofolio-talenta-digital')
  assert.ok(fixture)
  fixture.draft.owner_contribution_role_id = undefined
  fixture.draft.owner_custom_role_title = 'Designer'
  fixture.draft.roles[0].custom_title = 'Custom contributor title'
  const definition = toProjectDefinition(fixture.draft)

  assert.equal(definition.title, fixture.draft.title)
  assert.equal(definition.creation_mode, fixture.draft.creation_mode)
  assert.equal(definition.visibility, 'public')
  assert.equal(definition.owner_contribution_role_id, null)
  assert.deepEqual(definition.roles[0], {
    id: fixture.draft.roles[0].id,
    contribution_role_id: fixture.draft.roles[0].contribution_role_id,
    description: fixture.draft.roles[0].description,
    capacity: fixture.draft.roles[0].capacity,
    skill_ids: fixture.draft.roles[0].skill_ids,
    tool_ids: fixture.draft.roles[0].tool_ids
  })
  assert.equal(Object.hasOwn(definition, 'tool_ids'), false)
  assert.equal(Object.hasOwn(definition, 'status'), false)
  assert.equal(Object.hasOwn(definition.roles[0], 'client_key'), false)
  assert.equal(Object.hasOwn(definition.roles[0], 'filled_capacity'), false)
  assert.equal(Object.hasOwn(definition.roles[0], 'skill_tags'), false)
  assert.equal(Object.hasOwn(definition.roles[0], 'custom_title'), false)
  assert.equal(Object.hasOwn(definition, 'owner_custom_role_title'), false)
  assert.equal(Object.hasOwn(definition, 'client_request_id'), false)
})

test('detail mapper preserves server version, visibility, role identity, and master selections for edit', () => {
  const record = toProjectEditorRecord(detailResponse())

  assert.equal(record.id, projectId)
  assert.equal(record.version, 7)
  assert.equal(record.saved_at, '2026-10-08T00:00:00.000Z')
  assert.equal(record.draft.visibility, 'invite_only')
  assert.equal(record.draft.roles[0].id, roleId)
  assert.equal(record.draft.roles[0].client_key, roleId)
  assert.deepEqual(record.draft.roles[0].skill_ids, [skillId])
  assert.deepEqual(record.draft.roles[0].tool_ids, [toolId])
  assert.equal(record.draft.owner_contribution_role_id, undefined)
  assert.equal(record.ownership?.owner_id, projectId)
})
