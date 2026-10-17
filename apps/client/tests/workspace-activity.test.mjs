import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick, ref } from 'vue'
import { mountSetup } from './helpers/frontend-runtime.mjs'

const { createWorkspaceActivityController } = await import('../app/composables/useWorkspaceActivity.ts')
const { useWorkspaceActivityInvalidation } = await import('../app/composables/useWorkspaceActivityInvalidation.ts')
const flush = async () => { await nextTick(); await new Promise(resolve => setImmediate(resolve)) }
const item = id => ({ id, event_type: 'task.created', occurred_at: '2026-10-17T03:20:00Z',
  actor: { user_id: 'user-a', membership_id: 'member-a', display_name: 'Ayu', avatar: null },
  subject: { type: 'task', id: 'task-a', label: 'Alur onboarding', availability: 'available' }, description: 'membuat task “Alur onboarding”' })
const page = (data, number = 1, total = data.length) => ({ data, meta: { page: number, limit: 50, total, total_pages: Math.ceil(total / 50) } })

const mountActivity = (list, { slug = ref('project-a'), account = ref('account-a'), cache = ref({}), revision = ref(0) } = {}) => ({
  ...mountSetup(() => createWorkspaceActivityController(slug, account, { list }, cache, revision)), slug, account, cache, revision
})

test('activity uses server totals, appends one next page and deduplicates overlapping rows', async () => {
  const calls = []
  const first = Array.from({ length: 50 }, (_, index) => item(`event-${index}`))
  const mounted = mountActivity(async (slug, number, limit) => {
    calls.push({ slug, number, limit })
    return number === 1 ? page(first, 1, 70) : page([item('event-49'), item('event-50')], 2, 70)
  })
  try {
    await flush()
    const c = mounted.bindings
    assert.equal(c.meta.value.total, 70)
    c.setMobile(true)
    await flush()
    await c.loadMore()
    assert.equal(c.items.value.length, 51)
    assert.equal(c.items.value.at(-1).id, 'event-50')
    assert.deepEqual(calls, [{ slug: 'project-a', number: 1, limit: 50 }, { slug: 'project-a', number: 2, limit: 50 }])
  } finally { mounted.unmount() }
})

test('late responses cannot populate another project or account cache', async () => {
  const pending = []
  const mounted = mountActivity((slug, number) => new Promise(resolve => pending.push({ slug, number, resolve })))
  try {
    mounted.slug.value = 'project-b'
    await flush()
    pending[1].resolve(page([item('event-b')]))
    await flush()
    pending[0].resolve(page([item('private-event-a')]))
    await flush()
    assert.equal(mounted.bindings.items.value[0].id, 'event-b')
    assert.equal(Object.keys(mounted.cache.value).some(key => key.includes('project-a')), false)
    mounted.account.value = 'account-b'
    await flush()
    assert.deepEqual(mounted.bindings.items.value, [])
    assert.equal(Object.keys(mounted.cache.value).some(key => key.startsWith('account-a::')), false)
    pending[2].resolve(page([item('account-b-event')]))
    await flush()
    assert.equal(mounted.bindings.items.value[0].id, 'account-b-event')
  } finally { mounted.unmount() }
})

test('refresh failure retains prior rows but access revocation clears private data', async () => {
  let failure
  const mounted = mountActivity(async () => { if (failure) throw failure; return page([item('event-a')]) })
  try {
    await flush()
    failure = new Error('network unavailable')
    await mounted.bindings.refresh()
    assert.equal(mounted.bindings.items.value.length, 1)
    assert.notEqual(mounted.bindings.refreshError.value, '')
    failure = Object.assign(new Error('access revoked'), { statusCode: 404 })
    await mounted.bindings.refresh()
    assert.deepEqual(mounted.bindings.items.value, [])
    assert.equal(mounted.bindings.hasLoaded.value, false)
    assert.deepEqual(mounted.cache.value, {})
  } finally { mounted.unmount() }
})

test('revalidation resets to page one and concurrent loads share a request', async () => {
  const pending = []
  const mounted = mountActivity((slug, number) => new Promise(resolve => pending.push({ slug, number, resolve })))
  try {
    const firstRefresh = mounted.bindings.refresh()
    assert.equal(pending.length, 1)
    pending[0].resolve(page([item('event-a')], 1, 100))
    await firstRefresh
    const secondPage = mounted.bindings.setPage(2)
    pending[1].resolve(page([item('event-b')], 2, 100))
    await secondPage
    mounted.revision.value++
    await flush()
    assert.equal(pending[2].number, 1)
    pending[2].resolve(page([item('latest-event')], 1, 101))
    await flush()
    assert.equal(mounted.bindings.meta.value.page, 1)
    assert.equal(mounted.bindings.items.value[0].id, 'latest-event')
  } finally { mounted.unmount() }
})

test('project invalidation is account scoped and does not fetch inactive feeds', () => {
  const previous = globalThis.useState
  const states = new Map()
  globalThis.useState = (key, factory) => {
    if (!states.has(key)) states.set(key, ref(factory()))
    return states.get(key)
  }
  const account = ref('account-a')
  const invalidation = useWorkspaceActivityInvalidation(account)
  const revision = invalidation.revisionFor(ref('project-a'), ref('project-id-a'))
  try {
    assert.equal(revision.value, 0)
    invalidation.markDirty({ slug: 'project-a', id: 'project-id-a' })
    const dirty = revision.value
    assert.ok(dirty > 0)
    invalidation.markDirty({ id: 'project-id-a' })
    assert.ok(revision.value > dirty)
    account.value = 'account-b'
    assert.equal(revision.value, 0)
  } finally {
    if (previous === undefined) delete globalThis.useState
    else globalThis.useState = previous
  }
})
