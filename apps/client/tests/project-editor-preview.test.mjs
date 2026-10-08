import assert from 'node:assert/strict'
import test from 'node:test'

import '../tests/helpers/frontend-runtime.mjs'
import { isProjectEditorPreview } from '../app/utils/project-editor-preview.ts'

test('preview route requires both the development build and one exact query value', () => {
  assert.equal(isProjectEditorPreview(true, '1'), true)
  assert.equal(isProjectEditorPreview(false, '1'), false)
  assert.equal(isProjectEditorPreview(true, ['1', '1']), false)
  assert.equal(isProjectEditorPreview(true, 'true'), false)
  assert.equal(isProjectEditorPreview(true, undefined), false)
})
