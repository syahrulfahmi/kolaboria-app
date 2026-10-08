import assert from 'node:assert/strict'
import test from 'node:test'

import '../tests/helpers/frontend-runtime.mjs'

test('BottomSheet organism component defines standard props and defaults', async () => {
  const { default: BottomSheet } = await import(
    '../app/components/ui/organisms/BottomSheet.vue'
  )
  assert.equal(BottomSheet.props.modelValue.required, true)
  assert.equal(BottomSheet.props.zIndex.default, 60)
  assert.equal(BottomSheet.props.maxHeight.default, '85dvh')
  assert.equal(BottomSheet.props.showClose.default, true)
  assert.equal(BottomSheet.props.showHandle.default, true)
  assert.equal(BottomSheet.props.persistent.default, false)
  assert.equal(BottomSheet.props.primaryVariant.default, 'primary')
  assert.equal(BottomSheet.props.secondaryVariant.default, 'outline')
})
