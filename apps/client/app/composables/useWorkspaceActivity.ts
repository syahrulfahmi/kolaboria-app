import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useWorkspaceActivityInvalidation } from '~/composables/useWorkspaceActivityInvalidation'
import { useWorkspaceProjectInfoQuery } from '~/composables/useWorkspaceProjectInfo'
import { WorkspaceActivityService } from '~/services/workspace-activity.service'
import type { ApiPaginationMeta } from '~/types/api'
import type { WorkspaceActivityCache, WorkspaceActivityDTO, WorkspaceActivityGateway, WorkspaceActivityPage } from '~/types/workspace-activity'
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/error'

const PAGE_SIZE = 50
const CACHE_TTL_MS = 15_000
const MAX_CACHE_PAGES = 20
const MAX_MOBILE_ITEMS = 500
const emptyMeta = (): ApiPaginationMeta => ({ page: 1, limit: PAGE_SIZE, total: 0, total_pages: 0 })

export const createWorkspaceActivityController = (
  slug: Ref<string>,
  accountId: Ref<string | null>,
  gateway: WorkspaceActivityGateway,
  cache: Ref<WorkspaceActivityCache>,
  revision: Ref<number>
) => {
  const items = ref<WorkspaceActivityDTO[]>([])
  const meta = ref<ApiPaginationMeta>(emptyMeta())
  const loading = ref(false)
  const refreshing = ref(false)
  const loadingMore = ref(false)
  const error = ref('')
  const refreshError = ref('')
  const moreError = ref('')
  const hasLoaded = ref(false)
  const isMobile = ref(false)
  const firstPage = ref(1)
  let generation = 0
  let active: AbortController | null = null
  let pending: { key: string; promise: Promise<void> } | null = null
  let fetchedAt = 0

  const hasMore = computed(() => meta.value.page < meta.value.total_pages)
  const mobileWindowFull = computed(() => items.value.length >= MAX_MOBILE_ITEMS)
  const rangeStart = computed(() => items.value.length ? (firstPage.value - 1) * PAGE_SIZE + 1 : 0)
  const rangeEnd = computed(() => items.value.length ? rangeStart.value + items.value.length - 1 : 0)
  const prefix = () => `${encodeURIComponent(accountId.value ?? '')}::${encodeURIComponent(slug.value.trim())}::`

  const clear = () => {
    generation++
    active?.abort()
    active = null
    pending = null
    items.value = []
    meta.value = emptyMeta()
    firstPage.value = 1
    hasLoaded.value = false
    loading.value = false
    refreshing.value = false
    loadingMore.value = false
    error.value = ''; refreshError.value = ''; moreError.value = ''
    fetchedAt = 0
  }

  const load = (page = 1, append = false, force = false): Promise<void> => {
    if (!accountId.value || !slug.value.trim()) return Promise.resolve()
    const projectSlug = slug.value.trim()
    const account = accountId.value
    const requestRevision = revision.value
    const key = `${prefix()}${page}:${PAGE_SIZE}`
    const requestKey = `${key}:${requestRevision}`
    if (pending?.key === requestKey) return pending.promise
    active?.abort()
    const controller = new AbortController()
    active = controller
    const sequence = ++generation
    const current = () => generation === sequence && !controller.signal.aborted &&
      accountId.value === account && slug.value.trim() === projectSlug
    const initial = !hasLoaded.value
    loading.value = initial
    loadingMore.value = append
    refreshing.value = !initial && !append
    error.value = ''; refreshError.value = ''; moreError.value = ''

    const apply = (result: WorkspaceActivityPage) => {
      if (append) {
        const known = new Set(items.value.map(item => item.id))
        items.value = [...items.value, ...result.data.filter(item => !known.has(item.id))]
      } else {
        items.value = result.data
        firstPage.value = page
      }
      meta.value = result.meta
      hasLoaded.value = true
      fetchedAt = Date.now()
    }

    const request = (async () => {
      try {
        const entry = cache.value[key]
        if (!force && entry && entry.revision === requestRevision && Date.now() - entry.fetchedAt < CACHE_TTL_MS) {
          if (current()) apply(entry.value)
          return
        }
        const result = await gateway.list(projectSlug, page, PAGE_SIZE, controller.signal)
        if (!current()) return
        if (!result.data.length && result.meta.total_pages > 0 && page > result.meta.total_pages) {
          pending = null
          return load(result.meta.total_pages, false, true)
        }
        const now = Date.now()
        const retained = Object.entries(cache.value)
          .filter(([, cached]) => now - cached.fetchedAt < CACHE_TTL_MS)
          .sort((a, b) => b[1].fetchedAt - a[1].fetchedAt)
          .slice(0, MAX_CACHE_PAGES - 1)
        cache.value = { ...Object.fromEntries(retained), [key]: { value: result, fetchedAt: now, revision: requestRevision } }
        apply(result)
      } catch (cause) {
        if (!current()) return
        const status = getApiErrorStatus(cause)
        const message = getApiErrorMessage(cause, 'Aktivitas proyek belum dapat dimuat.')
        if (status === 401 || status === 404) {
          cache.value = Object.fromEntries(Object.entries(cache.value).filter(([entryKey]) => !entryKey.startsWith(status === 401 ? `${encodeURIComponent(account)}::` : prefix())))
          items.value = []; meta.value = emptyMeta(); hasLoaded.value = false
          error.value = message
        } else if (append) moreError.value = message
        else if (initial) error.value = message
        else refreshError.value = message
      } finally {
        if (current()) {
          loading.value = false; refreshing.value = false; loadingMore.value = false
          active = null; pending = null
        }
      }
    })()
    pending = { key: requestKey, promise: request }
    // Cache hits can complete synchronously before pending is assigned.
    void request.then(() => { if (pending?.promise === request) pending = null })
    return request
  }

  const refresh = () => load(1, false, true)
  const setPage = (page: number) => {
    if (!Number.isInteger(page) || page < 1 || page > Math.max(1, meta.value.total_pages)) return
    return load(page)
  }
  const loadMore = () => {
    if (!hasMore.value || loadingMore.value || refreshing.value) return
    // Keep long mobile sessions bounded. At the window limit the explicit
    // button starts the next older window instead of growing memory forever.
    return load(meta.value.page + 1, !mobileWindowFull.value)
  }
  const setMobile = (mobile: boolean) => {
    if (isMobile.value === mobile) return
    isMobile.value = mobile
    void load(1)
  }
  const refreshIfStale = () => {
    if (Date.now() - fetchedAt >= CACHE_TTL_MS && !loading.value && !refreshing.value && !loadingMore.value) void refresh()
  }

  watch([slug, accountId], ([, account], [, previousAccount]) => {
    clear()
    if (previousAccount && account !== previousAccount) {
      const accountPrefix = `${encodeURIComponent(previousAccount)}::`
      cache.value = Object.fromEntries(Object.entries(cache.value).filter(([key]) => !key.startsWith(accountPrefix)))
    }
    void load()
  }, { immediate: true })
  watch(revision, (next, previous) => { if (next > previous) void refresh() })
  onScopeDispose(clear)

  return { items, meta, loading, refreshing, loadingMore, error, refreshError, moreError, hasLoaded,
    isMobile, hasMore, mobileWindowFull, rangeStart, rangeEnd, refresh, setPage, loadMore, setMobile, refreshIfStale }
}

export const useWorkspaceActivity = (slug: Ref<string>) => {
  const { user } = useAuth()
  const accountId = computed(() => user.value?.id ?? null)
  const cache = useState<WorkspaceActivityCache>('workspace-activity-cache', () => ({}))
  const infoQuery = useWorkspaceProjectInfoQuery(slug)
  const invalidation = useWorkspaceActivityInvalidation(accountId)
  const projectId = computed(() => infoQuery.data.value?.project.id ?? null)
  const revision = invalidation.revisionFor(slug, projectId)
  watch(accountId, (account, previous) => { if (previous && account !== previous) invalidation.clearAccount(previous) })
  const gateway: WorkspaceActivityGateway = {
    async list(projectSlug, page, limit, signal) {
      const account = accountId.value
      try {
        return await WorkspaceActivityService.list(projectSlug, page, limit, signal)
      } catch (cause) {
        const status = getApiErrorStatus(cause)
        if (account === accountId.value && (status === 401 || status === 404)) infoQuery.invalidate(projectSlug)
        throw cause
      }
    }
  }
  return createWorkspaceActivityController(slug, accountId, gateway, cache, revision)
}
