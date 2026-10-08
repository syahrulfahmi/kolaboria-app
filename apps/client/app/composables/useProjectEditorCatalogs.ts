import { onScopeDispose, reactive } from 'vue'
import { MasterService } from '../services/master.service'
import { getApiErrorMessage } from '../utils/error'
import type { Skill, Tool } from '../types/skill'
import type {
  ProjectDetailResponse,
  ProjectEditorCatalogKey,
  ProjectEditorCatalogStates,
  ProjectEditorReferences,
  ProjectEditorRoleOption
} from '../types/project-editor'

export interface ProjectEditorCatalogLoaders {
  contribution_roles?: () => Promise<ProjectEditorRoleOption[]>
  skills?: () => Promise<Skill[]>
  tools?: () => Promise<Tool[]>
}

interface CatalogOptions {
  references: ProjectEditorReferences
  loaders?: ProjectEditorCatalogLoaders
  scopeKey?: () => string
}

interface PendingRequest {
  scope: string
  promise: Promise<void>
}

const emptyStates = (): ProjectEditorCatalogStates => ({
  contribution_roles: { loaded: false, loading: false, error: '' },
  skills: { loaded: false, loading: false, error: '' },
  tools: { loaded: false, loading: false, error: '' }
})

const mergeById = <T extends { id: string }>(
  existing: T[],
  incoming: readonly T[]
): T[] => {
  const merged = new Map(existing.map((item) => [item.id, item]))
  for (const item of incoming) merged.set(item.id, item)
  return [...merged.values()]
}

export const useProjectEditorCatalogs = (options: CatalogOptions) => {
  const catalogStates = reactive(emptyStates())
  const pending = new Map<ProjectEditorCatalogKey, PendingRequest>()
  let disposed = false

  onScopeDispose(() => {
    disposed = true
  })

  const canApply = (scope: string) =>
    !disposed && (!options.scopeKey || options.scopeKey() === scope)

  const loadCatalog = async (
    key: ProjectEditorCatalogKey,
    scope: string
  ): Promise<void> => {
    if (key === 'contribution_roles') {
      const load = options.loaders?.contribution_roles ??
        (() => MasterService.getContributionRoles())
      const items = await load()
      if (canApply(scope)) {
        options.references.contribution_roles = mergeById(
          options.references.contribution_roles,
          items
        )
      }
      return
    }

    if (key === 'skills') {
      const load = options.loaders?.skills ?? (() => MasterService.getSkills())
      const items = await load()
      if (canApply(scope)) {
        options.references.skills = mergeById(options.references.skills, items)
      }
      return
    }

    const load = options.loaders?.tools ?? (() => MasterService.getTools())
    const items = await load()
    if (canApply(scope)) {
      options.references.tools = mergeById(options.references.tools, items)
    }
  }

  const ensureCatalog = (key: ProjectEditorCatalogKey): Promise<void> => {
    const state = catalogStates[key]
    if (state.loaded || disposed) return Promise.resolve()

    const scope = options.scopeKey?.() ?? ''
    const existing = pending.get(key)
    if (existing?.scope === scope) return existing.promise

    state.loading = true
    state.error = ''
    const request: PendingRequest = { scope, promise: Promise.resolve() }
    request.promise = Promise.resolve()
      .then(() => loadCatalog(key, scope))
      .then(() => {
        if (canApply(scope)) state.loaded = true
      })
      .catch((error: unknown) => {
        if (canApply(scope)) {
          const fallback = key === 'contribution_roles'
            ? 'Daftar nama role belum berhasil dimuat. Coba lagi.'
            : key === 'skills'
              ? 'Daftar skill belum berhasil dimuat. Coba lagi.'
              : 'Daftar tools belum berhasil dimuat. Coba lagi.'
          state.error = getApiErrorMessage(error, fallback)
        }
      })
      .finally(() => {
        if (pending.get(key) === request) {
          state.loading = false
          pending.delete(key)
        }
      })
    pending.set(key, request)
    return request.promise
  }

  const hydrateSelected = (detail: ProjectDetailResponse) => {
    if (disposed) return
    const contributionRoles: ProjectEditorRoleOption[] = []
    const skills: Skill[] = []
    const tools: Tool[] = []

    if (detail.owner_role) {
      contributionRoles.push(detail.owner_role.contribution_role)
    }
    for (const role of detail.roles) {
      if (role.contribution_role) contributionRoles.push(role.contribution_role)
      skills.push(...role.skills)
      tools.push(...role.tools)
    }

    options.references.contribution_roles = mergeById(
      options.references.contribution_roles,
      contributionRoles
    )
    options.references.skills = mergeById(options.references.skills, skills)
    options.references.tools = mergeById(options.references.tools, tools)
  }

  return {
    references: options.references,
    catalogStates,
    ensureCatalog,
    hydrateSelected
  }
}
