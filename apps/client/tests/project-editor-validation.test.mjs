import assert from 'node:assert/strict'
import test from 'node:test'

import '../tests/helpers/frontend-runtime.mjs'
import {
  getProjectEditorCapacity,
  normalizeProjectEditorTag,
  validateProjectEditorDraft,
  validateProjectEditorStep
} from '../app/data/project-editor-validation.ts'
import {
  createBlankProjectEditorDraft,
  createProjectEditorFixture
} from '../app/data/project-editor-fixtures.ts'

test('create fixture starts with one role and edit fixture reconstructs prototype team', () => {
  const blank = createBlankProjectEditorDraft()
  const fixture = createProjectEditorFixture('platform-portofolio-talenta-digital')

  assert.equal(blank.roles.length, 1)
  assert.equal(blank.roles[0].capacity, 1)
  assert.equal(fixture?.draft.roles.length, 3)
  assert.equal(getProjectEditorCapacity(fixture?.draft.roles ?? []), 5)
})

test('each fixture is isolated and unknown project slugs do not reuse example content', () => {
  const first = createProjectEditorFixture('platform-portofolio-talenta-digital')
  const second = createProjectEditorFixture('platform-portofolio-talenta-digital')

  assert.notEqual(first, second)
  assert.notEqual(first?.draft, second?.draft)
  assert.equal(createProjectEditorFixture('wrong-slug'), null)
})

test('tags trim surrounding whitespace and compare duplicate skill labels without casing', () => {
  assert.equal(normalizeProjectEditorTag('  TypeScript  '), 'TypeScript')
  assert.equal(normalizeProjectEditorTag('   '), '')
})

test('basic section requires its brief, category, visibility and bounded text lengths', () => {
  const draft = createBlankProjectEditorDraft()
  assert.match(validateProjectEditorStep(0, draft).title, /wajib/i)

  draft.title = 'Platform Portofolio untuk Talenta'
  draft.summary = 'Membantu talenta membagikan pengalaman.'
  draft.description = 'Produk untuk menunjukkan hasil kolaborasi nyata.'
  assert.deepEqual(validateProjectEditorStep(0, draft), {})

  draft.title = 't'.repeat(81)
  assert.match(validateProjectEditorStep(0, draft).title, /80/)
})

test('team section requires a complete role and caps aggregate capacity at twenty', () => {
  const draft = createBlankProjectEditorDraft()
  draft.roles[0].contribution_role_id = 'role-frontend'
  draft.roles[0].description = 'Membangun dan mengevaluasi antarmuka.'
  draft.roles[0].skill_tags = ['Vue']
  assert.deepEqual(validateProjectEditorStep(1, draft), {})

  draft.roles[0].capacity = 21
  assert.match(validateProjectEditorStep(1, draft)['roles.role-create-1.capacity'], /20/)
})

test('filled role capacity cannot be reduced or deleted into an invalid team', () => {
  const draft = createBlankProjectEditorDraft()
  draft.roles[0].contribution_role_id = 'role-frontend'
  draft.roles[0].description = 'Membangun dan mengevaluasi antarmuka.'
  draft.roles[0].skill_tags = ['Vue']
  draft.roles[0].filled_capacity = 2
  draft.roles[0].capacity = 1

  assert.match(validateProjectEditorStep(1, draft)['roles.role-create-1.capacity'], /sudah terisi/i)
})

test('client transparency, agreement and date ordering have targeted validation', () => {
  const draft = createProjectEditorFixture('platform-portofolio-talenta-digital').draft
  draft.origin = 'client'
  draft.client_acknowledgement = false
  draft.start_date = '2026-12-15'
  draft.deadline = '2026-10-15'
  draft.collaboration_agreement = false

  assert.match(validateProjectEditorStep(2, draft).client_acknowledgement, /konfirmasi/i)
  const timeErrors = validateProjectEditorStep(3, draft)
  assert.match(timeErrors.deadline, /sesudah|setelah/i)
  assert.match(timeErrors.collaboration_agreement, /setujui/i)
})

test('full publish validation checks all sections and permits empty optional project dates', () => {
  const draft = createProjectEditorFixture('platform-portofolio-talenta-digital').draft
  draft.start_date = null
  draft.deadline = null

  assert.deepEqual(validateProjectEditorDraft(draft), {})
  draft.roles[0].skill_tags = []
  assert.ok(validateProjectEditorDraft(draft)['roles.role-fixture-frontend.skill_tags'])
})
