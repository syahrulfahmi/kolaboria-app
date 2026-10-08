import assert from 'node:assert/strict'
import test from 'node:test'

import '../tests/helpers/frontend-runtime.mjs'

test('dropdown teleports its option panel by default', async () => {
  const { default: Dropdown } = await import(
    '../app/components/ui/molecules/Dropdown.vue'
  )
  assert.equal(Dropdown.props.teleport.default, true)
})
