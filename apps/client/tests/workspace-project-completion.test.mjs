import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick, ref } from 'vue'
import './helpers/frontend-runtime.mjs'
import { mountSetup } from './helpers/frontend-runtime.mjs'

const { createWorkspaceProjectCompletionController } = await import('../app/composables/useWorkspaceProjectCompletion.ts')
const flush = async () => { await nextTick(); await new Promise(resolve => setImmediate(resolve)); await nextTick() }
const summary = (changes = {}) => ({ version: 15, total_tasks: 3, done_tasks: 2, closed_tasks: 1, outstanding_tasks: 0, deleted_tasks: 1, invalid_closed_tasks: 0, ...changes })
const project = () => ({ project: { id: 'project-1', slug: 'platform', version: 7, status: 'in_progress' }, canCompleteProject: true,
  closure: { eligible: true, completion: null, task_summary: summary() } })
const completion = (request) => ({ id: 'closure-1', completed_at: '2026-10-17T01:00:00Z', completed_by: 'owner',
  result_summary: request.result_summary, review_basis: request.review_basis, project_version: request.version + 1, task_summary: summary({ version: request.task_version }) })

test('review fetches current task facts before opening and saves the server-confirmed closure locally', async () => {
  const info = ref(project())
  const requests = []
  let reads = 0
  const harness = mountSetup(() => createWorkspaceProjectCompletionController(ref('platform'), ref('owner'), info, {
    refreshInfo: async () => { reads++; info.value = { ...project(), project: { ...project().project, version: 9 }, closure: { ...project().closure, task_summary: summary({ version: 21 }) } } },
    complete: async (slug, request) => { requests.push({ slug, request }); return completion(request) }
  }))
  const c = harness.bindings
  await c.requestReview()
  assert.equal(reads, 1)
  assert.equal(c.open.value, true)
  c.resultSummary.value = '  Demo hasil proyek  '
  await c.confirm()
  assert.deepEqual(requests, [{ slug: 'platform', request: { version: 9, task_version: 21, result_summary: 'Demo hasil proyek', review_basis: '' } }])
  assert.equal(info.value.project.status, 'completed')
  assert.equal(info.value.canCompleteProject, false)
  assert.equal(info.value.closure.completion.id, 'closure-1')
  assert.equal(c.open.value, false)
  assert.equal(reads, 1, 'the command response should not require another GET')
  harness.unmount()
})

test('no structured tasks requires a review basis and scope exclusions do not inflate completed work', async () => {
  const info = ref({ ...project(), closure: { eligible: true, completion: null, task_summary: summary({ total_tasks: 0, done_tasks: 0, closed_tasks: 0 }) } })
  const harness = mountSetup(() => createWorkspaceProjectCompletionController(ref('platform'), ref('owner'), info, { refreshInfo: async () => {}, complete: async request => completion(request) }))
  const c = harness.bindings
  await c.requestReview()
  c.resultSummary.value = 'Tinjauan hasil'
  assert.equal(c.canConfirm.value, false)
  c.reviewBasis.value = 'Demo ditinjau bersama; tidak ada bukti task terstruktur.'
  assert.equal(c.canConfirm.value, true)
  info.value.closure.task_summary = summary({ done_tasks: 0, closed_tasks: 3 })
  assert.equal(info.value.closure.task_summary.done_tasks, 0)
  harness.unmount()
})

test('conflict keeps the review text and requires another confirmation using refreshed versions', async () => {
  const info = ref(project())
  const requests = []
  let reads = 0
  const harness = mountSetup(() => createWorkspaceProjectCompletionController(ref('platform'), ref('owner'), info, {
    refreshInfo: async () => { if (++reads === 2) info.value.closure.task_summary.version = 16 },
    complete: async (_slug, request) => { requests.push(request); if (requests.length === 1) throw { status: 409 }; return completion(request) }
  }))
  const c = harness.bindings
  await c.requestReview(); c.resultSummary.value = 'Keputusan owner'
  await c.confirm()
  assert.equal(requests.length, 1)
  assert.equal(c.resultSummary.value, 'Keputusan owner')
  assert.match(c.error.value, /berubah/)
  assert.equal(c.open.value, true)
  await c.confirm()
  assert.deepEqual(requests.map(item => item.task_version), [15, 16])
  harness.unmount()
})

test('failed conflict refresh disables confirmation and can be retried with the existing form', async () => {
  const info = ref(project())
  let reads = 0
  const harness = mountSetup(() => createWorkspaceProjectCompletionController(ref('platform'), ref('owner'), info, {
    refreshInfo: async () => { if (++reads === 2) { info.value = null; throw new Error('offline') }; info.value = project() },
    complete: async () => { throw { status: 409 } }
  }))
  const c = harness.bindings
  await c.requestReview(); c.resultSummary.value = 'Keputusan tetap tersimpan di formulir'
  await c.confirm()
  assert.equal(c.needsRefresh.value, true)
  assert.equal(c.canConfirm.value, false)
  await c.requestReview()
  assert.equal(c.needsRefresh.value, false)
  assert.equal(c.resultSummary.value, 'Keputusan tetap tersimpan di formulir')
  assert.equal(c.canConfirm.value, true)
  harness.unmount()
})

test('a late completion response cannot change another project or account', async () => {
  for (const changeAccount of [false, true]) {
    const info = ref(project()), slug = ref('platform'), account = ref('owner')
    let resolveRequest
    const harness = mountSetup(() => createWorkspaceProjectCompletionController(slug, account, info, {
      refreshInfo: async () => {}, complete: (_slug, request) => new Promise(resolve => { resolveRequest = () => resolve(completion(request)) })
    }))
    const c = harness.bindings
    await c.requestReview(); c.resultSummary.value = 'Hasil'
    const pending = c.confirm()
    if (changeAccount) account.value = 'other-owner'; else slug.value = 'other-project'
    await flush()
    info.value = { ...project(), project: { ...project().project, id: 'other-project' } }
    resolveRequest(); await pending
    assert.equal(info.value.project.id, 'other-project')
    assert.equal(info.value.project.status, 'in_progress')
    assert.equal(c.open.value, false)
    harness.unmount()
  }
})

test('a blocked project or member without closure authority cannot submit', async () => {
  for (const canCompleteProject of [true, false]) {
    const info = ref({ ...project(), canCompleteProject, closure: { ...project().closure, eligible: false, task_summary: summary({ outstanding_tasks: 1 }) } })
    let writes = 0
    const harness = mountSetup(() => createWorkspaceProjectCompletionController(ref('platform'), ref('owner'), info, { refreshInfo: async () => {}, complete: async () => { writes++ } }))
    await harness.bindings.requestReview()
    harness.bindings.resultSummary.value = 'Hasil'
    await harness.bindings.confirm()
    assert.equal(writes, 0)
    harness.unmount()
  }
})

test('a missing closure summary never permits a completion command', async () => {
  const info = ref({ ...project(), closure: null })
  let writes = 0
  const harness = mountSetup(() => createWorkspaceProjectCompletionController(ref('platform'), ref('owner'), info, {
    refreshInfo: async () => {}, complete: async () => { writes++ }
  }))
  const c = harness.bindings
  c.open.value = true
  c.resultSummary.value = 'Hasil proyek'
  c.reviewBasis.value = 'Review owner'
  assert.equal(c.canConfirm.value, false)
  await c.confirm()
  assert.equal(writes, 0)
  harness.unmount()
})
