import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick, ref } from 'vue'
import { mountSetup } from './helpers/frontend-runtime.mjs'

const { createWorkspaceOverviewController } = await import('../app/composables/useWorkspaceOverview.ts')
const { mapWorkspaceOverview } = await import('../app/utils/workspace-overview.ts')

const overview = {
  project: { id: 'project-1', slug: 'sample-project', title: 'Sample project', status: 'in_progress', version: 1 },
  viewer: { scope: 'member', membership_id: 'member-1', capabilities: { can_manage_workspace: false, can_create_task: false } },
  task_summary: { total_tasks: 2, todo_tasks: 1, in_progress_tasks: 0, review_tasks: 0, done_tasks: 1, closed_tasks: 0, outstanding_tasks: 1 },
  team_summary: { active_member_count: 2 },
  my_tasks: [],
  recent_discussions: [],
  recent_activities: []
}

test('overview derives progress while excluding closed tasks from its denominator', () => {
  const result = mapWorkspaceOverview({
    ...overview,
    task_summary: { total_tasks: 3, todo_tasks: 0, in_progress_tasks: 0, review_tasks: 0, done_tasks: 1, closed_tasks: 2, outstanding_tasks: 0 }
  })

  assert.deepEqual(result.progress, { completed: 1, denominator: 1, percent: 100 })
})

test('overview rejects inconsistent totals and previews beyond API limits', () => {
  assert.throws(() => mapWorkspaceOverview({
    ...overview,
    task_summary: { ...overview.task_summary, total_tasks: 3 }
  }), /tidak konsisten/)
  assert.throws(() => mapWorkspaceOverview({ ...overview, my_tasks: Array(6).fill({}) }), /preview/)
})

test('concurrent overview controllers share one request and one unmount does not cancel another consumer', async () => {
  let resolveRequest
  let requestSignal
  let calls = 0
  const gateway = {
    get(_slug, signal) {
      calls += 1
      requestSignal = signal
      return new Promise((resolve) => { resolveRequest = resolve })
    }
  }
  const registry = new Map()
  const cache = ref({})
  const create = () => mountSetup(() => createWorkspaceOverviewController(
    ref('sample-project'), ref('account-1'), gateway, cache, ref(0), () => 10_000, registry
  ))

  const first = create()
  const second = create()
  assert.equal(calls, 1)

  first.unmount()
  assert.equal(requestSignal.aborted, false)
  resolveRequest(overview)
  await second.bindings.load()
  await nextTick()

  assert.equal(second.bindings.data.value.project.id, 'project-1')
  assert.equal(requestSignal.aborted, false)
  second.unmount()
})

