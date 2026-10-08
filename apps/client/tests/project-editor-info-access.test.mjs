import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick, reactive } from 'vue'
import { mountComponent } from './helpers/frontend-runtime.mjs'

const { default: Info } = await import('../app/components/project/editor/ProjectEditorInfo.vue')
const { createBlankProjectEditorDraft } = await import('../app/data/project-editor-fixtures.ts')
const organization = { id: 'organization-a', name: 'Community A' }

test('organization fieldset and selections require both admin role and eligible membership', async () => {
  for (const scenario of [
    { role: 'user', organizations: [organization], allowed: false },
    { role: 'admin', organizations: [], allowed: false },
    { role: undefined, organizations: [organization], allowed: false },
    { role: 'admin', organizations: [organization], allowed: true }
  ]) {
    const context = reactive({ system_role: scenario.role, initiable_organizations: scenario.organizations })
    const events = []
    const mounted = mountComponent(Info, {
      mode: 'create', form: createBlankProjectEditorDraft(), errors: {}, disabled: false,
      creationContext: context,
      onChangeCreationMode: mode => events.push(mode),
      onChangeOrganization: id => events.push(id)
    })
    try {
      const vm = mounted.bindings
      assert.equal(vm.canChooseOrganization, scenario.allowed)
      vm.changeCreationMode('organization_initiated')
      vm.changeOrganization(organization.id)
      assert.deepEqual(events, scenario.allowed ? ['organization_initiated', organization.id] : [])
      vm.changeOrganization('unlisted-organization')
      assert.equal(events.length, scenario.allowed ? 2 : 0)
      context.system_role = 'user'
      await nextTick()
      assert.equal(vm.canChooseOrganization, false)
      vm.changeCreationMode('organization_initiated')
      assert.equal(events.length, scenario.allowed ? 2 : 0)
    } finally { mounted.unmount() }
  }
})
