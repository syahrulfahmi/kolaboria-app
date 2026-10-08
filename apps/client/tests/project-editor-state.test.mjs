import assert from 'node:assert/strict'
import test from 'node:test'

import { mountSetup } from './helpers/frontend-runtime.mjs'

const { useProjectEditor } = await import('../app/composables/useProjectEditor.ts')
const { createProjectEditorFixture, createProjectEditorReferences } = await import('../app/data/project-editor-fixtures.ts')

const memoryStorage = () => {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    keys: () => [...values.keys()]
  }
}

const createEditor = (options = {}) =>
  mountSetup(() => useProjectEditor({
    mode: 'create',
    currentUserId: 'user-a',
    references: createProjectEditorReferences(),
    storage: memoryStorage(),
    delayMs: 0,
    ...options
  }))

test('create navigation remains sequential while edit navigation can visit any section', () => {
  const create = createEditor()
  const edit = createEditor({
    mode: 'edit',
    slug: 'platform-portofolio-talenta-digital',
    initialRecord: createProjectEditorFixture('platform-portofolio-talenta-digital')
  })

  assert.equal(create.bindings.goToStep(3), false)
  assert.equal(edit.bindings.goToStep(3), true)
  assert.equal(edit.bindings.currentStep.value, 3)
  create.unmount()
  edit.unmount()
})

test('leaving client origin resets its owner acknowledgement', () => {
  const editor = createEditor({
    initialDraft: {
      ...createProjectEditorFixture('platform-portofolio-talenta-digital').draft,
      origin: 'client',
      client_acknowledgement: true
    }
  })

  editor.bindings.setOrigin('community')
  assert.equal(editor.bindings.draft.value.client_acknowledgement, false)
  editor.unmount()
})

test('editing loaded data is dirty until a successful save replaces the baseline', async () => {
  const storage = memoryStorage()
  const editor = createEditor({
    mode: 'edit',
    slug: 'platform-portofolio-talenta-digital',
    initialRecord: createProjectEditorFixture('platform-portofolio-talenta-digital'),
    storage
  })
  const vm = editor.bindings

  assert.equal(vm.isDirty.value, false)
  vm.draft.value.title = 'Judul proyek diperbarui'
  assert.equal(vm.isDirty.value, true)
  await vm.saveChanges()
  assert.equal(vm.isDirty.value, false)
  assert.equal(vm.record.value.draft.title, 'Judul proyek diperbarui')
  editor.unmount()
})

test('draft storage is scoped to current user and edit slug and storage errors stay visible', async () => {
  const storage = memoryStorage()
  const editor = createEditor({ storage })
  editor.bindings.draft.value.title = 'Draft pengguna pertama'
  await editor.bindings.saveDraft()
  assert.match(storage.keys()[0], /user-a:create/)

  const other = createEditor({ currentUserId: 'user-b', storage })
  assert.equal(other.bindings.draft.value.title, '')

  const deniedStorage = {
    getItem: () => null,
    setItem: () => { throw new Error('quota') },
    removeItem: () => {}
  }
  const denied = createEditor({ storage: deniedStorage })
  denied.bindings.draft.value.title = 'Tidak hilang'
  await denied.bindings.saveDraft()
  assert.equal(denied.bindings.saveResult.value, null)
  assert.match(denied.bindings.submitError.value, /perangkat/i)
  assert.equal(denied.bindings.draft.value.title, 'Tidak hilang')

  editor.unmount()
  other.unmount()
  denied.unmount()
})

test('mock publish preserves brief, stores an explicit local status and locks duplicate submissions', async () => {
  const storage = memoryStorage()
  const fixture = createProjectEditorFixture('platform-portofolio-talenta-digital')
  const editor = createEditor({
    storage,
    initialDraft: fixture.draft,
    eligibility: { email_verified: true, onboarding_completed: true }
  })
  const pending = editor.bindings.publish()
  assert.equal(editor.bindings.isSubmitting.value, true)
  await editor.bindings.publish()
  await pending

  assert.equal(editor.bindings.record.value.status, 'open')
  assert.match(editor.bindings.saveResult.value.message, /belum diterbitkan ke server/i)
  editor.unmount()
})
