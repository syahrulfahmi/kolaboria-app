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

test('continue is only available before the final step in create and edit', () => {
  const continueButtons = buttons.filter(button => button.includes("emit('next')"))
  assert.equal(continueButtons.length, 3)

  const desktopContinueButton = continueButtons.find(button => button.includes('v-else-if'))
  assert.ok(desktopContinueButton)
  assert.match(desktopContinueButton, /v-else-if="currentStep < 4"/)

  const mobileEditActions = actionsSource.slice(
    actionsSource.indexOf('v-if="isEditStepAfterFirst"'),
    actionsSource.indexOf('v-if="isIntermediateCreateStep"')
  )
  assert.match(mobileEditActions, /currentStep < 4/)
  assert.match(mobileEditActions, /@click="emit\('next'\)"/)
  assert.match(actionsSource, /isIntermediateCreateStep[\s\S]*props\.currentStep < 4/)
})

test('edit shows a desktop back button and mobile chevron after the first step', () => {
  const desktopEditBack = buttons.find(button =>
    button.includes("mode === 'edit' && currentStep > 0") &&
    button.includes("emit('back')")
  )
  assert.ok(desktopEditBack)
  assert.match(desktopEditBack, /!hidden sm:!inline-flex/)

  const mobileEditActions = actionsSource.slice(
    actionsSource.indexOf('v-if="isEditStepAfterFirst"'),
    actionsSource.indexOf('v-if="isIntermediateCreateStep"')
  )
  assert.match(mobileEditActions, /sm:hidden/)
  assert.match(mobileEditActions, /aria-label="Kembali ke langkah sebelumnya"/)
  assert.match(mobileEditActions, /<ChevronLeft/)
})
