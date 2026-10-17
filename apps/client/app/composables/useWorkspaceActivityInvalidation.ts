import { computed, type Ref } from 'vue'
import type { User } from '~/types/auth'

const scopeKey = (account: string, kind: 'slug' | 'id', value: string) =>
  `${encodeURIComponent(account)}::${kind}:${encodeURIComponent(value.trim())}`

/** Marks cached feeds stale without fetching an inactive Workspace page. */
export const useWorkspaceActivityInvalidation = (accountId?: Ref<string | null>) => {
  const user = accountId ? null : useState<User | null>('user', () => null)
  const currentAccount = accountId ?? computed(() => user?.value?.id ?? null)
  const revisions = useState<Record<string, number>>('workspace-activity-revisions', () => ({}))

  const markDirty = (project: { slug?: string; id?: string }) => {
    const account = currentAccount.value
    if (!account) return
    const nextRevision = Object.values(revisions.value).reduce((max, value) => Math.max(max, value), Date.now()) + 1
    for (const kind of ['slug', 'id'] as const) {
      const value = project[kind]?.trim()
      if (!value) continue
      const key = scopeKey(account, kind, value)
      revisions.value = { ...revisions.value, [key]: nextRevision }
    }
  }

  const revisionFor = (slug: Ref<string>, projectId: Ref<string | null>) => computed(() => {
    const account = currentAccount.value ?? ''
    return Math.max(revisions.value[scopeKey(account, 'slug', slug.value)] ?? 0,
      projectId.value ? revisions.value[scopeKey(account, 'id', projectId.value)] ?? 0 : 0)
  })

  const clearAccount = (account: string) => {
    const prefix = `${encodeURIComponent(account)}::`
    revisions.value = Object.fromEntries(Object.entries(revisions.value).filter(([key]) => !key.startsWith(prefix)))
  }

  return { markDirty, revisionFor, clearAccount }
}
