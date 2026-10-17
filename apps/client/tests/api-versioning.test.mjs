import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import { effectScope, ref } from 'vue'
import './helpers/frontend-runtime.mjs'

const require = createRequire(import.meta.resolve('nuxt/package.json'))
const { ofetch } = await import(pathToFileURL(require.resolve('ofetch')).href)
const { useApi } = await import('../app/composables/useApi.ts')
const { API_ENDPOINTS } = await import('../app/constants/api-endpoints.ts')
const { AuthService } = await import('../app/services/auth.service.ts')
const { ProfileService } = await import('../app/services/profile.service.ts')
const { ProjectService } = await import('../app/services/project.service.ts')
const { ApplicationService } = await import('../app/services/application.service.ts')
const { WorkspaceService } = await import('../app/services/workspace.service.ts')
const { useWorkspaceDiscussionService } = await import('../app/services/workspace-discussion.service.ts')
const { MasterService } = await import('../app/services/master.service.ts')
const { SkillService } = await import('../app/services/skill.service.ts')
const { LocationService } = await import('../app/services/location.service.ts')
const { CareerService } = await import('../app/services/career.service.ts')
const { PortfolioService } = await import('../app/services/portfolio.service.ts')
const { ExperienceService } = await import('../app/services/experience.service.ts')
const { NotificationService } = await import('../app/services/notification.service.ts')

function fixture(t, baseUrl) {
  const calls = []
  const app = { _scope: effectScope(true), runWithContext: fn => fn() }
  const globals = {
    useApi,
    useNuxtApp: () => app,
    useRuntimeConfig: () => ({ public: { apiBaseUrl: baseUrl } }),
    useCookie: () => ref(null),
    $fetch: ofetch.create({}, { fetch: async (request, options) => {
      calls.push({ url: new URL(String(request)), method: options.method ?? 'GET' })
      return new Response(JSON.stringify({ status: 200, data: [],
        meta: { page: 1, limit: 100, total: 0, total_pages: 1 } }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } })
  }
  const previous = Object.fromEntries(Object.keys(globals).map(key => [key, globalThis[key]]))
  Object.assign(globalThis, globals)
  t.after(() => {
    app._scope.stop()
    for (const key of Object.keys(globals)) {
      if (previous[key] === undefined) delete globalThis[key]
      else globalThis[key] = previous[key]
    }
  })
  return calls
}

for (const baseUrl of [
  'http://localhost:8081', 'http://localhost:8081/',
  'https://api.dev.kolaboria.com', 'https://api.dev.kolaboria.com/'
]) {
  test(`services own the v1 path with server-only base URL ${baseUrl}`, async t => {
    const calls = fixture(t, baseUrl)
    t.mock.method(console, 'warn', () => {})
    await AuthService.login({ email: 'audit@example.invalid', password: 'unused' })
    await ProfileService.getProfile()
    await ProjectService.getProjects()
    await ApplicationService.getMyApplications({ page: 1, limit: 20 })
    await WorkspaceService.getProjectInfo('my project')
    await useWorkspaceDiscussionService().list('my project')
    await MasterService.getSkills()
    await SkillService.getSkills()
    await LocationService.searchLocations('Jakarta')
    await CareerService.getMyCareerHistories()
    await PortfolioService.getPortfolio()
    await ExperienceService.listMine()
    await NotificationService.list()
    await ProjectService.leaveProject('project-1')
    await ProjectService.updateMemberStatus('project-1', 'member-1', 'active')
    await ProjectService.changeMemberRole('project-1', 'member-1', 'role-1')
    assert.deepEqual(calls.map(call => call.url.pathname), [
      '/v1/auth/login', '/v1/profiles/me', '/v1/projects',
      '/v1/applications/my-applications', '/v1/workspaces/my%20project/info',
      '/v1/workspaces/my%20project/discussions', '/v1/master-data/skills',
      '/v1/master-data/skills', '/v1/master-data/locations/search',
      '/v1/profiles/me/careers', '/v1/profiles/me/portfolio', '/v1/experiences/me',
      '/v1/notifications', '/v1/projects/project-1/members/leave',
      '/v1/projects/project-1/members/member-1/status',
      '/v1/projects/project-1/members/member-1/role'
    ])
    for (const call of calls) assert.equal(call.url.origin, new URL(baseUrl).origin)
  })
}

test('every registry endpoint supplies its own v1 path at the transport boundary', async t => {
  const calls = fixture(t, 'http://localhost:8081/')
  const { $api } = useApi()
  for (const endpoints of Object.values(API_ENDPOINTS)) {
    for (const endpoint of Object.values(endpoints)) {
      const path = typeof endpoint === 'function'
        ? endpoint(...Array(endpoint.length).fill('resource-id')) : endpoint
      await $api(path)
    }
  }
  assert.ok(calls.length > 0)
  for (const { url } of calls) {
    assert.match(url.pathname, /^\/v1\//)
    assert.doesNotMatch(url.pathname, /^\/v1\/v1\//)
  }
})

test('transport preserves endpoint-owned versions and unversioned root paths', async t => {
  const calls = fixture(t, 'http://localhost:8081/')
  const { $api } = useApi()
  await $api('/health')
  await $api('/v1/projects')
  await $api('/v2/example')
  assert.deepEqual(calls.map(call => call.url.pathname), ['/health', '/v1/projects', '/v2/example'])
})
