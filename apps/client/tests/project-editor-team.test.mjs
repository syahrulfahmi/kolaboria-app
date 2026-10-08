import assert from 'node:assert/strict'
import test from 'node:test'
import { reactive } from 'vue'

import './helpers/frontend-runtime.mjs'
import { mountComponent } from './helpers/frontend-runtime.mjs'
import { createProjectEditorReferences, createProjectEditorFixture } from '../app/data/project-editor-fixtures.ts'

const { default: Team } = await import('../app/components/project/editor/ProjectEditorTeam.vue')

test('owner professional role has an explicit clear choice that writes null semantics', () => {
  const references = createProjectEditorReferences()
  const draft = reactive(createProjectEditorFixture('platform-portofolio-talenta-digital').draft)
  draft.owner_contribution_role_id = references.contribution_roles[0].id
  const catalogState = { loaded: false, loading: false, error: '' }
  const mounted = mountComponent(Team, {
    references,
    catalogStates: { contribution_roles: catalogState, skills: catalogState, tools: catalogState },
    errors: {},
    disabled: false,
    form: draft
  })

  const clearOption = mounted.bindings.ownerRoleOptions.find(option => option.value === '')
  assert.ok(clearOption)
  mounted.bindings.selectOwnerRole(clearOption.value)
  assert.equal(draft.owner_contribution_role_id, undefined)
  mounted.unmount()
})
