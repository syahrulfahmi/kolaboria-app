import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'

const presentation = await import('../app/utils/workspace-project-info.ts').catch(() => ({}))

const response = (overrides = {}) => ({
  project: {
    id: 'project-1',
    slug: 'platform-edukasi',
    version: 7,
    status: 'open',
    title: 'Platform edukasi',
    summary: 'Ringkasan project',
    description: 'Deskripsi project',
    project_category: 'education',
    creation_mode: 'organization_initiated',
    initiator_organization_id: 'org-1',
    start_date: '2026-10-20',
    deadline: '2026-12-01',
    ownership: {
      owner_id: 'owner-1',
      owner_profile: { id: 'owner-1', username: 'dian', full_name: 'Dian Owner' },
      initiator_organization_id: 'org-1',
      initiator_organization: { id: 'org-1', name: 'Komunitas Edukasi', slug: 'komunitas-edukasi' },
      initiator_profile: null,
      show_initiator: true
    }
  },
  closure: { eligible: false, completion: null, task_summary: { version: 0, total_tasks: 0, done_tasks: 0, closed_tasks: 0, outstanding_tasks: 0, deleted_tasks: 0, invalid_closed_tasks: 0 } },
  positions: [
    { id: 'role-full', name: 'Designer', capacity: 3, active_contributor_count: 3, remaining_capacity: 0, recruitment_status: 'filled', readiness_state: 'ready' },
    { id: 'role-partial', name: 'Developer', capacity: 3, active_contributor_count: 2, remaining_capacity: 1, recruitment_status: 'open', readiness_state: 'to_fill' },
    { id: 'role-empty', name: 'Editor', capacity: 2, active_contributor_count: 0, remaining_capacity: 2, recruitment_status: 'open', readiness_state: 'to_fill' }
  ],
  position_capacity_summary: { all_positions_filled: false, underfilled_position_count: 2, total_remaining_capacity: 3 },
  viewer: { scope: 'owner', capabilities: { can_view_info: true, can_start_project: true, can_manage_workspace: true } },
  ...overrides
})

test('maps capacity readiness from Workspace API and keeps owner separate from organization initiator', () => {
  assert.equal(typeof presentation.mapWorkspaceProjectInfo, 'function')
  const model = presentation.mapWorkspaceProjectInfo(response())

  assert.equal(model.project.ownerName, 'Dian Owner')
  assert.equal(model.project.initiatorOrganizationName, 'Komunitas Edukasi')
  assert.equal(model.project.projectCategory, 'Pendidikan')
  assert.equal(model.positions[0].readinessLabel, 'Siap')
  assert.equal(model.positions[1].readinessLabel, 'Masih perlu diisi')
  assert.equal(model.positions[1].occupancyLabel, '2/3')
  assert.equal(model.positions[1].remainingCapacity, 1)
  assert.equal(model.positionCapacitySummary.totalRemainingCapacity, 3)
  assert.equal(model.canStartProject, true)
})

test('does not fabricate project identity or position data when optional server facts are absent', () => {
  const source = response({
    project: {
      id: 'project-2', slug: 'personal', version: 1, status: 'open', title: 'Personal',
      summary: '', description: '', project_category: 'product', creation_mode: 'personal',
      initiator_organization_id: null, start_date: null, deadline: null,
      ownership: { owner_id: null, owner_profile: null, initiator_organization_id: null, initiator_organization: null, initiator_profile: null, show_initiator: false }
    },
    positions: [],
    position_capacity_summary: { all_positions_filled: false, underfilled_position_count: 0, total_remaining_capacity: 0 },
    viewer: { scope: 'member', capabilities: { can_view_info: true, can_start_project: false, can_manage_workspace: false } }
  })
  const model = presentation.mapWorkspaceProjectInfo(source)

  assert.equal(model.project.ownerName, 'Pemilik belum tersedia')
  assert.equal(model.project.initiatorOrganizationName, null)
  assert.deepEqual(model.positions, [])
  assert.equal(model.canStartProject, false)
})

test('rejects inconsistent or invalid position capacity payloads instead of using prototype data', () => {
  assert.equal(typeof presentation.mapWorkspaceProjectInfo, 'function')
  assert.throws(() => presentation.mapWorkspaceProjectInfo(response({
    positions: [{ id: 'bad', name: 'Role', capacity: 0, active_contributor_count: 0, remaining_capacity: 0, recruitment_status: 'filled', readiness_state: 'ready' }]
  })))
})

test('legacy Info without closure still maps the project and readiness without inventing task counts', () => {
  const source = response()
  source.project.status = 'in_progress'
  source.project.version = 6
  delete source.closure
  const model = presentation.mapWorkspaceProjectInfo(source)
  assert.equal(model.project.title, source.project.title)
  assert.equal(model.project.status, 'in_progress')
  assert.equal(model.project.version, 6)
  assert.equal(model.positions[0].readinessLabel, 'Siap')
  assert.equal(model.positions[1].remainingCapacity, 1)
  assert.equal(model.closure, null, 'missing counts must remain unavailable, not zero')
  assert.equal(model.canCompleteProject, false)
})

test('missing or null closure cannot enable completion even when a capability is present', () => {
  for (const closure of [undefined, null]) {
    const source = response({ closure })
    source.project.status = 'in_progress'
    source.viewer.capabilities.can_complete_project = true
    assert.equal(presentation.mapWorkspaceProjectInfo(source).canCompleteProject, false)
  }
})

test('current completion contract keeps real counts and requires explicit server authority', () => {
  const source = response()
  source.project.status = 'in_progress'
  source.closure = { eligible: true, completion: null, task_summary: {
    version: 8, total_tasks: 2, done_tasks: 1, closed_tasks: 1, outstanding_tasks: 0,
    deleted_tasks: 3, invalid_closed_tasks: 0
  } }
  assert.equal(presentation.mapWorkspaceProjectInfo(source).canCompleteProject, false)
  source.viewer.capabilities.can_complete_project = true
  const model = presentation.mapWorkspaceProjectInfo(source)
  assert.equal(model.canCompleteProject, true)
  assert.deepEqual(model.closure, source.closure)
  source.closure.task_summary.total_tasks = 9
  assert.throws(() => presentation.mapWorkspaceProjectInfo(source), /Ringkasan penutupan/)
})
