import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useWorkspaceActivityInvalidation } from '~/composables/useWorkspaceActivityInvalidation'
import { WorkspaceOverviewService } from '~/services/workspace-overview.service'
import type { WorkspaceOverviewCache, WorkspaceOverviewDTO, WorkspaceOverviewGateway, WorkspaceOverviewViewModel } from '~/types/workspace-overview'
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/error'
import { mapWorkspaceOverview } from '~/utils/workspace-overview'

const CACHE_TTL_MS = 15_000
const MAX_CACHED_PROJECTS = 20
const cacheKey = (account: string, slug: string) => `${encodeURIComponent(account)}::${encodeURIComponent(slug.trim())}`

interface SharedOverviewRequest {
  controller: AbortController
  promise: Promise<WorkspaceOverviewDTO>
  consumers: number
}

export type WorkspaceOverviewRequestRegistry = Map<string, SharedOverviewRequest>

const requestRegistries = new WeakMap<object, WorkspaceOverviewRequestRegistry>()

const requestRegistryFor = (nuxtApp: object): WorkspaceOverviewRequestRegistry => {
  let registry = requestRegistries.get(nuxtApp)
  if (!registry) {
    registry = new Map()
    requestRegistries.set(nuxtApp, registry)
  }
  return registry
}

const acquireRequest = (
  registry: WorkspaceOverviewRequestRegistry,
  key: string,
  slug: string,
  gateway: WorkspaceOverviewGateway
) => {
  let request = registry.get(key)
  if (!request) {
    const controller = new AbortController()
    const created: SharedOverviewRequest = {
      controller,
      consumers: 0,
      promise: gateway.get(slug, controller.signal).finally(() => {
        if (registry.get(key) === created) registry.delete(key)
      })
    }
    request = created
    registry.set(key, request)
  }

  request.consumers += 1
  let released = false
  return {
    promise: request.promise,
    release() {
      if (released) return
      released = true
      request!.consumers -= 1
      if (request!.consumers === 0 && registry.get(key) === request) {
        request!.controller.abort()
        registry.delete(key)
      }
    }
  }
}

export const createWorkspaceOverviewController = (
  slug: Ref<string>, accountId: Ref<string | null>, gateway: WorkspaceOverviewGateway,
  cache: Ref<WorkspaceOverviewCache>, revision: Ref<number>, now: () => number = Date.now,
  requestRegistry: WorkspaceOverviewRequestRegistry = new Map()
) => {
  const data = ref<WorkspaceOverviewViewModel | null>(null)
  const loading = ref(false)
  const refreshing = ref(false)
  const error = ref<string | null>(null)
  let generation = 0
  let pending: { key: string; revision: number; promise: Promise<void>; release: () => void } | null = null
  let lastForegroundRefresh = 0
  let lastManualRetry = 0

  const currentKey = computed(() => accountId.value && slug.value.trim() ? cacheKey(accountId.value, slug.value) : '')
  const isCurrent = (requestGeneration: number, key: string, requestRevision: number) =>
    generation === requestGeneration && currentKey.value === key && revision.value === requestRevision

  const load = (force = false): Promise<void> => {
    const key = currentKey.value
    if (!key) {
      pending?.release()
      pending = null
      generation += 1
      data.value = null; loading.value = false; refreshing.value = false; error.value = null
      return Promise.resolve()
    }
    const requestRevision = revision.value
    if (pending?.key === key && pending.revision === requestRevision) return pending.promise
    if (pending) {
      pending.release()
      pending = null
      generation += 1
    }
    const cached = cache.value[key]
    if (!force && cached && cached.revision === requestRevision && now() - cached.fetched_at < CACHE_TTL_MS) {
      data.value = mapWorkspaceOverview(cached.data); error.value = null; return Promise.resolve()
    }
    const requestGeneration = ++generation
    const initial = !data.value || data.value.project.slug !== slug.value.trim()
    lastForegroundRefresh = now()
    loading.value = initial; refreshing.value = !initial; error.value = null
    const lease = acquireRequest(requestRegistry, key, slug.value.trim(), gateway)
    const promise = (async () => {
      try {
        const dto = await lease.promise
        const viewModel = mapWorkspaceOverview(dto)
        if (!isCurrent(requestGeneration, key, requestRevision)) return
        const timestamp = now()
        const retained = Object.entries(cache.value).filter(([, entry]) => timestamp - entry.fetched_at < CACHE_TTL_MS * 4)
          .sort((a, b) => b[1].fetched_at - a[1].fetched_at).slice(0, MAX_CACHED_PROJECTS - 1)
        cache.value = { ...Object.fromEntries(retained), [key]: { data: dto, fetched_at: timestamp, revision: requestRevision } }
        data.value = viewModel; lastForegroundRefresh = timestamp
      } catch (cause) {
        if (!isCurrent(requestGeneration, key, requestRevision)) return
        const status = getApiErrorStatus(cause)
        if (status === 401 || status === 403 || status === 404) {
          const prefix = status === 401 ? `${encodeURIComponent(accountId.value ?? '')}::` : `${key}`
          cache.value = Object.fromEntries(Object.entries(cache.value).filter(([entryKey]) => !entryKey.startsWith(prefix)))
          data.value = null
        }
        error.value = getApiErrorMessage(cause, 'Ringkasan workspace belum dapat dimuat.')
      } finally {
        lease.release()
        if (isCurrent(requestGeneration, key, requestRevision)) { loading.value = false; refreshing.value = false }
      }
    })()
    pending = { key, revision: requestRevision, promise, release: lease.release }
    void promise.finally(() => { if (pending?.promise === promise) pending = null })
    return promise
  }

  const refreshIfStale = () => {
    const cached = currentKey.value ? cache.value[currentKey.value] : null
    if (!cached || now() - cached.fetched_at >= CACHE_TTL_MS) void load(true)
  }
  const onFocus = () => {
    if (now() - lastForegroundRefresh < 5_000) return
    refreshIfStale()
  }
  const refresh = () => {
    if (now() - lastManualRetry < 1_000) return Promise.resolve()
    lastManualRetry = now()
    return load(true)
  }
  const hasWindow = import.meta.client && typeof window !== 'undefined'
  if (hasWindow) window.addEventListener('focus', onFocus)
  watch([slug, accountId], () => { data.value = null; void load() }, { immediate: true })
  watch(revision, (next, previous) => { if (next > previous) void load(true) })
  onScopeDispose(() => { generation += 1; pending?.release(); pending = null; if (hasWindow) window.removeEventListener('focus', onFocus) })
  return { data, loading, refreshing, error, load, refresh, refreshIfStale }
}

export type WorkspaceOverviewController = ReturnType<typeof createWorkspaceOverviewController>

export const useWorkspaceOverview = (slug: Ref<string>) => {
  const { user } = useAuth()
  const accountId = computed(() => user.value?.id ?? null)
  const cache = useState<WorkspaceOverviewCache>('workspace-overview-cache', () => ({}))
  const nuxtApp = useNuxtApp()
  const invalidation = useWorkspaceActivityInvalidation(accountId)
  const projectId = computed(() => cache.value[cacheKey(accountId.value ?? '', slug.value)]?.data.project.id ?? null)
  const revision = invalidation.revisionFor(slug, projectId)
  watch(accountId, (next, previous) => {
    if (previous && next !== previous) {
      invalidation.clearAccount(previous)
      const prefix = `${encodeURIComponent(previous)}::`
      cache.value = Object.fromEntries(Object.entries(cache.value).filter(([key]) => !key.startsWith(prefix)))
    }
  })
  return createWorkspaceOverviewController(slug, accountId, WorkspaceOverviewService, cache, revision, Date.now, requestRegistryFor(nuxtApp))
}
