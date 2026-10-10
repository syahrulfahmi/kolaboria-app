import { onMounted, onScopeDispose, ref, watch, type Ref } from 'vue'
import { ProjectService } from '../services/project.service'
import type { MyProjectSummaryResponse } from '../types/project-editor'

// Publish the first batch while subsequent API pages load in the background.
// Keep the full collection so existing filters, sorting, and counts still work.
export const useMyProjectList = (accountId: Ref<string | null>) => {
  const projects = ref<MyProjectSummaryResponse[]>([])
  const pending = ref(true)
  const loadingMore = ref(false)
  const error = ref<unknown>(null)
  const loadMoreError = ref<unknown>(null)
  let sequence = 0

  const refresh = async () => {
    const requestSequence = ++sequence
    const requestAccount = accountId.value
    pending.value = Boolean(requestAccount)
    loadingMore.value = false
    error.value = null
    loadMoreError.value = null
    if (!requestAccount) {
      projects.value = []
      return
    }

    let page = 1
    let scopes: MyProjectSummaryResponse['my_scope'][] = ['owned', 'initiated']
    const accumulated = new Map<string, MyProjectSummaryResponse>()
    try {
      while (scopes.length) {
        const batches = await Promise.all(scopes.map(async scope => ({
          scope,
          response: await ProjectService.getMyProjectSummaries(scope, { page, limit: 100 })
        })))
        if (requestSequence !== sequence || requestAccount !== accountId.value) return

        const remainingScopes: MyProjectSummaryResponse['my_scope'][] = []
        for (const { scope, response } of batches) {
          for (const project of response.data) {
            // A project may appear in either scope on different API pages.
            if (!accumulated.has(project.id) || scope === 'owned') {
              accumulated.set(project.id, { ...project, my_scope: scope })
            }
          }
          if (page < (response.meta?.total_pages ?? page)) remainingScopes.push(scope)
        }
        projects.value = [...accumulated.values()]
        pending.value = false
        scopes = remainingScopes
        loadingMore.value = scopes.length > 0
        page++
      }
    } catch (failure: unknown) {
      if (requestSequence !== sequence || requestAccount !== accountId.value) return
      if (page === 1) error.value = failure
      else loadMoreError.value = failure
    } finally {
      if (requestSequence === sequence) {
        pending.value = false
        loadingMore.value = false
      }
    }
  }

  onMounted(() => { void refresh() })
  watch(accountId, () => {
    projects.value = []
    void refresh()
  })
  onScopeDispose(() => { sequence++ })

  return { projects, pending, loadingMore, error, loadMoreError, refresh }
}
