import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick, ref } from 'vue'

import './helpers/frontend-runtime.mjs'
import { mountSetup } from './helpers/frontend-runtime.mjs'
const { useProjectEditorNotifications } = await import('../app/composables/useProjectEditorNotifications.ts')

const makeState = () => ({
  submitError: ref(''),
  saveResult: ref(null),
  record: ref(null)
})

test('project editor errors and saves are surfaced through toast notifications', async () => {
  const state = makeState()
  const calls = []
  const toast = {
    error: (...args) => calls.push({ type: 'error', args }),
    success: (...args) => calls.push({ type: 'success', args })
  }
  const mounted = mountSetup(() => useProjectEditorNotifications(state, { toast }))

  state.submitError.value = 'Perubahan belum tersimpan. Coba lagi.'
  await nextTick()
  assert.deepEqual(calls, [{ type: 'error', args: ['Perubahan belum tersimpan. Coba lagi.', 'Proyek belum tersimpan'] }])

  state.submitError.value = ''
  await nextTick()
  assert.equal(calls.length, 1)

  state.record.value = { status: 'awaiting_owner', saved_at: '2026-10-08T08:30:00Z' }
  state.saveResult.value = { kind: 'published', message: 'Proyek dipublikasikan dan menunggu Project Lead.' }
  await nextTick()
  assert.deepEqual(calls[1], {
    type: 'success',
    args: [
      'Proyek dipublikasikan dan menunggu Project Lead.',
      'Proyek dipublikasikan',
      6000
    ]
  })

  mounted.unmount()
})

test('save notifications omit project status and timestamps', async () => {
  const state = makeState()
  const calls = []
  const toast = {
    error: (...args) => calls.push({ type: 'error', args }),
    success: (...args) => calls.push({ type: 'success', args })
  }
  const mounted = mountSetup(() => useProjectEditorNotifications(state, { toast }))

  state.record.value = { status: 'open', saved_at: '2026-10-08T08:30:00Z' }
  state.saveResult.value = { kind: 'draft', message: 'Draft proyek berhasil disimpan.' }
  await nextTick()

  assert.deepEqual(calls[0], {
    type: 'success',
    args: ['Draft proyek berhasil disimpan.', 'Draft tersimpan', 6000]
  })
  mounted.unmount()
})
