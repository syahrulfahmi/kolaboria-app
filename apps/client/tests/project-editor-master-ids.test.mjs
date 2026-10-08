import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'
import { createProjectEditorFixture, createProjectEditorReferences } from '../app/data/project-editor-fixtures.ts'
import { validateProjectEditorDraft } from '../app/data/project-editor-validation.ts'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

test('editor fixture selections are UUIDs represented by the matching master references', () => {
  const record = createProjectEditorFixture('platform-portofolio-talenta-digital')
  const references = createProjectEditorReferences()
  assert.ok(record)
  assert.ok(references.contribution_roles.length > 0)
  assert.ok(references.skills.length > 0)
  assert.ok(references.tools.length > 0)

  for (const role of record.draft.roles) {
    assert.match(role.contribution_role_id, uuid)
    assert.ok(role.skill_ids.length > 0)
    assert.ok(role.skill_ids.every((id) => uuid.test(id)))
    assert.ok(role.tool_ids.every((id) => uuid.test(id)))
    assert.ok(references.contribution_roles.some((item) => item.id === role.contribution_role_id))
    assert.ok(role.skill_ids.every((id) => references.skills.some((item) => item.id === id)))
    assert.ok(role.tool_ids.every((id) => references.tools.some((item) => item.id === id)))
  }
})

test('publish validation rejects labels where master skill UUIDs are required', () => {
  const record = createProjectEditorFixture('platform-portofolio-talenta-digital')
  assert.ok(record)
  for (const role of record.draft.roles) role.skill_tags = role.skill_ids
  record.draft.roles[0].skill_ids = ['Vue.js']
  record.draft.roles[0].skill_tags = ['Vue.js']

  const errors = validateProjectEditorDraft(record.draft)
  assert.match(errors['roles.role-fixture-frontend.skill_ids'], /skill|master|valid/i)
})
