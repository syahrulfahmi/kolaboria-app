import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const actionsSource = await readFile(
  new URL('../app/components/project/editor/ProjectEditorActions.vue', import.meta.url),
  'utf8'
)
const buttons = [...actionsSource.matchAll(/<AtomicButton\b[\s\S]*?<\/AtomicButton>/g)]
  .map(([button]) => button)

test('create offers draft save before review on desktop and intermediate mobile steps', () => {
  const desktopDraftButton = buttons.find(button => button.includes("emit('save-draft')") && button.includes('Simpan sebagai Draft'))
  assert.ok(desktopDraftButton)
  assert.match(desktopDraftButton, /v-if="mode === 'create'"/)
  assert.doesNotMatch(desktopDraftButton, /currentStep === 4/)

  const mobileSteps = actionsSource.slice(
    actionsSource.indexOf('v-if="isIntermediateCreateStep"'),
    actionsSource.indexOf('v-if="isCreateReviewStep"')
  )
  assert.match(mobileSteps, /@click="emit\('save-draft'\)"/)
})

test('saving an edit does not depend on publication eligibility', () => {
  const editSaveButton = buttons.find(button => button.includes("emit('save-changes')"))
  assert.ok(editSaveButton)
  assert.match(editSaveButton, /:disabled="isSubmitting \|\| canSave === false"/)
})
