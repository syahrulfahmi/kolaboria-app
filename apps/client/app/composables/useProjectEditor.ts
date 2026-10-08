import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { z } from 'zod'
import { createBlankProjectEditorDraft } from '../data/project-editor-fixtures'
import {
  getProjectEditorStepForError,
  validateProjectEditorDraft,
  validateProjectEditorStructure,
  validateProjectEditorStep
} from '../data/project-editor-validation'
import { toProjectDefinition, toProjectEditorRecord } from '../utils/project-editor-api'
import {
  createProjectEditorRecoveryStorageKey,
  extractLegacyProjectEditorText,
  getProjectEditorRecoveryScope
} from '../utils/project-editor-recovery'
import type { LegacyProjectEditorText, ProjectEditorRecoveryRecord } from '../utils/project-editor-recovery'
import { getApiErrorMessage, getApiErrorStatus } from '../utils/error'
import type {
  ProjectEditorDraft,
  ProjectCreationMode,
  ProjectEditorErrors,
  ProjectEditorOptions,
  ProjectEditorRecord,
  ProjectEditorStep
} from '../types/project-editor'

const roleSchema = z.object({
  client_key: z.string().min(1),
  id: z.string().optional(),
  contribution_role_id: z.string().optional(),
  description: z.string(),
  capacity: z.number().int(),
  filled_capacity: z.number().int().nonnegative(),
  tool_ids: z.array(z.string()),
  skill_ids: z.array(z.string())
})

const draftSchema = z.object({
  creation_mode: z.enum(['personal', 'organization_initiated']).default('personal'),
  initiator_organization_id: z.string().nullable().default(null),
  lead_expectations: z.string().default(''),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  slug: z.string(),
  project_category: z.enum(['product', 'community', 'open_source', 'research', 'education', 'business', 'other']),
  visibility: z.enum(['public', 'private', 'invite_only']),
  roles: z.array(roleSchema),
  owner_contribution_role_id: z.string().optional(),
  origin: z.enum(['personal', 'community', 'experiment', 'client']),
  why_collaborative: z.string(),
  contributor_outcome: z.string(),
  owner_commitment: z.string(),
  client_acknowledgement: z.boolean(),
  start_date: z.string().nullable(),
  deadline: z.string().nullable(),
  availability: z.enum(['flexible', 'part_time', 'weekends_only', 'full_time']),
  hours_per_week: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)]),
  collaboration_agreement: z.boolean()
})

const recordSchema = z.object({
  id: z.string().min(1),
  slug: z.string(),
  status: z.enum(['draft', 'open', 'awaiting_owner', 'in_progress', 'completed', 'archived']),
  ownership: z.object({
    created_by_user_id: z.string(), initiator_user_id: z.string().nullable(),
    initiator_organization_id: z.string().nullable(), owner_id: z.string().nullable(),
    show_initiator: z.boolean(), can_accept_contributors: z.boolean()
  }).optional(),
  draft: draftSchema,
  saved_at: z.string().datetime(),
  version: z.number().int().positive()
})

const pendingCreateSchema = z.object({
  clientRequestId: z.string().uuid(),
  draft: draftSchema
})
const recoverySchema = z.object({
  schema_version: z.literal(1),
  account_id: z.string().min(1),
  scope: z.string().min(1),
  attempt_id: z.string().min(1),
  project_id: z.string().nullable(),
  base_version: z.number().int().positive().nullable(),
  saved_at: z.string().datetime(),
  draft: draftSchema
})

type PendingCreate = { clientRequestId: string; draft: ProjectEditorDraft }

const getBrowserSessionStorage = (): ProjectEditorOptions['pendingCreateStorage'] => {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage
  } catch {
    return null
  }
}

const readPendingCreates = (
  storage: ProjectEditorOptions['pendingCreateStorage'],
  key: string
): Map<string, PendingCreate> => {
  if (!storage) return new Map()
  try {
    const raw = storage.getItem(key)
    if (!raw) return new Map()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return new Map()
    const result = new Map<string, PendingCreate>()
    for (const [scope, value] of Object.entries(parsed)) {
      const validated = pendingCreateSchema.safeParse(value)
      if (validated.success) result.set(scope, validated.data as PendingCreate)
    }
    return result
  } catch {
    return new Map()
  }
}

export const createProjectEditorStorageKey = (
  userId: string,
  mode: 'create' | 'edit',
  slug?: string
) => [
  'kolaboria:project-editor-preview:v1',
  encodeURIComponent(userId || 'unknown-account'),
  mode === 'create' ? 'create' : 'edit:' + encodeURIComponent(slug || '')
].join(':')

const getBrowserStorage = (): ProjectEditorOptions['storage'] => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

const getBrowserRecoveryStorage = (): ProjectEditorOptions['recoveryStorage'] => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

const clone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T

const newRequestId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16)
    return (character === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

const snapshotDraft = (draft: ProjectEditorDraft) => JSON.stringify(draft)
const draftScope = (draft: ProjectEditorDraft) => draft.creation_mode === 'personal'
  ? 'personal' : 'organization:' + (draft.initiator_organization_id || 'unselected')

const hasValidOrganizationFields = (draft: ProjectEditorDraft) =>
  draft.visibility === 'public' && !draft.owner_commitment.trim() &&
  !draft.owner_contribution_role_id

const createRecord = (
  draft: ProjectEditorDraft,
  status: ProjectEditorRecord['status'],
  existingId?: string
): ProjectEditorRecord => ({
  id: existingId || 'preview-project-' + (draft.slug || 'draft'),
  slug: draft.slug,
  status,
  draft: clone(draft),
  saved_at: new Date().toISOString(),
  version: 1
})

export const useProjectEditor = (options: ProjectEditorOptions) => {
  const storage = options.storage === undefined ? getBrowserStorage() : options.storage
  const recoveryStorage = options.recoveryStorage === undefined
    ? options.persistence ? getBrowserRecoveryStorage() : null
    : options.recoveryStorage
  const pendingCreateStorage = options.pendingCreateStorage === undefined
    ? getBrowserSessionStorage()
    : options.pendingCreateStorage
  const pendingCreateStorageKey = `kolaboria:project-editor-pending-create:v1:${encodeURIComponent(options.currentUserId || 'unknown-account')}`
  const recoveredPendingCreates = options.mode === 'create'
    ? readPendingCreates(pendingCreateStorage, pendingCreateStorageKey)
    : new Map<string, PendingCreate>()
  const blankDraft = createBlankProjectEditorDraft()
  const pendingForInitialScope = recoveredPendingCreates.get(draftScope(options.initialDraft ?? blankDraft))
  const recoveredPendingDraft = pendingForInitialScope?.draft ??
    (recoveredPendingCreates.size === 1 ? [...recoveredPendingCreates.values()][0]?.draft : undefined)
  const initialDraft = options.initialRecord?.draft ?? options.initialDraft ?? recoveredPendingDraft ?? blankDraft
  const record = ref<ProjectEditorRecord | null>(options.initialRecord ? clone(options.initialRecord) : null)
  const draft = ref<ProjectEditorDraft>(clone(initialDraft))
  const currentStep = ref<ProjectEditorStep>(0)
  const errors = ref<ProjectEditorErrors>({})
  const submitError = ref('')
  const storageWarning = ref('')
  const isSubmitting = ref(false)
  const saveResult = ref<{ kind: 'draft' | 'published' | 'updated'; message: string } | null>(null)
  const recoveryAvailable = ref<'draft' | null>(null)
  const legacyTextRecoveryAvailable = ref(false)
  const recoveryRecord = ref<ProjectEditorRecoveryRecord | null>(null)
  const legacyTextRecovery = ref<LegacyProjectEditorText | null>(null)
  const recoveryStorageKey = ref('')
  const baseline = ref(snapshotDraft(draft.value))
  const pendingCreates = new Map<string, PendingCreate>(
    [...recoveredPendingCreates].map(([scope, pending]) => [`${options.currentUserId}:${scope}`, pending])
  )
  const modeDrafts = ref(new Map<string, { draft: ProjectEditorDraft; record: ProjectEditorRecord | null; baseline: string }>())
  const isDirty = computed(() => snapshotDraft(draft.value) !== baseline.value ||
    [...modeDrafts.value].some(([scope, saved]) => scope !== draftScope(draft.value) && snapshotDraft(saved.draft) !== saved.baseline))
  const totalCapacity = computed(() =>
    draft.value.roles.reduce((sum, role) => sum + (Number.isSafeInteger(role.capacity) && role.capacity > 0 ? role.capacity : 0), 0)
  )
  const canPublish = computed(() =>
    (options.contextAvailable?.() ?? true) &&
    (draft.value.creation_mode === 'personal' || selectedOrganization.value !== null) &&
    options.eligibility?.email_verified === true &&
    options.eligibility.onboarding_completed === true
  )
  const organizations = computed(() => options.creationContext?.system_role === 'admin'
    ? options.creationContext.initiable_organizations : [])
  const selectedOrganization = computed(() => organizations.value.find(org => org.id === draft.value.initiator_organization_id) ?? null)
  const canInitiateOrganization = computed(() => organizations.value.length > 0)

  const getOwnership = (status: ProjectEditorRecord['status']) => {
    const isOrganization = draft.value.creation_mode === 'organization_initiated'
    return {
      created_by_user_id: options.currentUserId,
      initiator_user_id: isOrganization ? null : options.currentUserId,
      initiator_organization_id: isOrganization ? selectedOrganization.value?.id ?? null : null,
      owner_id: isOrganization ? null : options.currentUserId,
      show_initiator: isOrganization,
      can_accept_contributors: !isOrganization && status === 'open'
    }
  }

  const getStorageKey = (slug = record.value?.slug || draft.value.slug || options.slug) =>
    createProjectEditorStorageKey(options.currentUserId, options.mode, slug) +
    (options.storageScope ? ':' + encodeURIComponent(options.storageScope) : '') +
    (options.mode === 'create' ? ':' + draftScope(draft.value) : '')
  const originalStorageKey = getStorageKey(options.slug)

  const restore = () => {
    if (!storage) return
    try {
      const stored = storage.getItem(getStorageKey()) ||
        (!options.storageScope && draft.value.creation_mode === 'personal'
          ? storage.getItem(createProjectEditorStorageKey(options.currentUserId, options.mode, options.slug)) : null)
      if (stored) {
        const result = recordSchema.safeParse(JSON.parse(stored))
        if (result.success && result.data.draft.creation_mode === draft.value.creation_mode &&
          result.data.draft.initiator_organization_id === draft.value.initiator_organization_id &&
          (result.data.draft.creation_mode === 'personal' || (selectedOrganization.value && hasValidOrganizationFields(result.data.draft))) &&
          (options.mode === 'create' || result.data.slug === options.slug)) {
          record.value = result.data
          draft.value = clone(result.data.draft)
        } else {
          storageWarning.value = 'Draft pratinjau ini tidak dapat dibaca. Kamu dapat mulai lagi dari data yang tersedia.'
        }
      }
    } catch {
      storageWarning.value = 'Penyimpanan pratinjau tidak tersedia. Isi formulir tetap dapat dicoba pada halaman ini.'
    }
  }
  restore()
  if (!storage && options.storage !== null) {
    storageWarning.value = 'Penyimpanan pratinjau tidak tersedia. Isi formulir tetap dapat dicoba pada halaman ini.'
  }

  baseline.value = snapshotDraft(draft.value)

  let roleSequence = draft.value.roles.length + 1
  let activeTimer: ReturnType<typeof setTimeout> | undefined
  let isMounted = true

  const persistenceScope = () => options.currentUserId + ':' + draftScope(draft.value)

  const getRecoveryScope = () => getProjectEditorRecoveryScope(
    options.mode,
    draftScope(draft.value),
    record.value?.id
  )

  const getLegacyPreviewKeys = () => {
    const base = createProjectEditorStorageKey(options.currentUserId, options.mode, options.slug)
    const scoped = options.storageScope ? base + ':' + encodeURIComponent(options.storageScope) : base
    return options.mode === 'create'
      ? [
          base,
          scoped,
          scoped + ':' + draftScope(draft.value),
          scoped + ':personal'
        ]
      : [base]
  }

  const refreshRecoveryChoices = () => {
    recoveryAvailable.value = null
    legacyTextRecoveryAvailable.value = false
    recoveryRecord.value = null
    legacyTextRecovery.value = null
    recoveryStorageKey.value = ''
    if (!recoveryStorage) return

    const scope = getRecoveryScope()
    const key = createProjectEditorRecoveryStorageKey(options.currentUserId, scope)
    try {
      const stored = recoveryStorage.getItem(key)
      if (stored) {
        const parsed = recoverySchema.safeParse(JSON.parse(stored))
        if (parsed.success && parsed.data.account_id === options.currentUserId && parsed.data.scope === scope &&
          (options.mode !== 'edit' || parsed.data.project_id === record.value?.id) &&
          (options.mode !== 'create' || draftScope(parsed.data.draft) === draftScope(draft.value))) {
          recoveryRecord.value = parsed.data as ProjectEditorRecoveryRecord
          recoveryStorageKey.value = key
          recoveryAvailable.value = 'draft'
          return
        }
        storageWarning.value = 'Draft lokal tidak cocok dengan proyek atau akun yang sedang dibuka, jadi tidak dipulihkan.'
      }

      for (const legacyKey of getLegacyPreviewKeys()) {
        const legacyValue = recoveryStorage.getItem(legacyKey)
        if (!legacyValue) continue
        const extracted = extractLegacyProjectEditorText(JSON.parse(legacyValue))
        if (!extracted) continue
        legacyTextRecovery.value = extracted
        legacyTextRecoveryAvailable.value = true
        recoveryStorageKey.value = legacyKey
        return
      }
    } catch {
      storageWarning.value = 'Draft lokal tidak dapat dibaca. Isian server tetap aman dan bisa diedit.'
    }
  }

  const removeRecoveryForCurrentScope = () => {
    if (!recoveryStorage) return
    try {
      recoveryStorage.removeItem(createProjectEditorRecoveryStorageKey(options.currentUserId, getRecoveryScope()))
      recoveryRecord.value = null
      recoveryStorageKey.value = ''
    } catch {
      storageWarning.value = 'Draft tersimpan ke server, tetapi salinan pemulihan lokal belum dapat dibersihkan.'
    }
  }

  const restoreRecovery = () => {
    const recovered = recoveryRecord.value
    if (!recovered || recovered.account_id !== options.currentUserId || recovered.scope !== getRecoveryScope()) return false
    draft.value = clone(recovered.draft)
    recoveryAvailable.value = null
    return true
  }

  const restoreLegacyTextRecovery = () => {
    if (!legacyTextRecovery.value) return false
    draft.value = { ...draft.value, ...legacyTextRecovery.value }
    legacyTextRecovery.value = null
    legacyTextRecoveryAvailable.value = false
    return true
  }

  const dismissRecovery = () => {
    if (recoveryStorage && legacyTextRecoveryAvailable.value && recoveryStorageKey.value) {
      try {
        recoveryStorage.removeItem(recoveryStorageKey.value)
      } catch {
        storageWarning.value = 'Salinan pemulihan lama belum dapat dibersihkan.'
      }
    } else {
      removeRecoveryForCurrentScope()
    }
    recoveryRecord.value = null
    legacyTextRecovery.value = null
    recoveryAvailable.value = null
    legacyTextRecoveryAvailable.value = false
  }

  const writeRecoverySnapshot = () => {
    if (!recoveryStorage || !isMounted || recoveryAvailable.value || legacyTextRecoveryAvailable.value) return
    const currentKey = createProjectEditorRecoveryStorageKey(options.currentUserId, getRecoveryScope())
    if (snapshotDraft(draft.value) === baseline.value) {
      try {
        recoveryStorage.removeItem(currentKey)
      } catch {
        storageWarning.value = 'Draft lokal lama belum dapat dibersihkan.'
      }
      return
    }
    const currentProjectId = options.mode === 'edit' ? record.value?.id ?? null : null
    const previous = recoveryRecord.value
    const candidate: ProjectEditorRecoveryRecord = {
      schema_version: 1,
      account_id: options.currentUserId,
      scope: getRecoveryScope(),
      attempt_id: previous?.scope === getRecoveryScope() ? previous.attempt_id : newRequestId(),
      project_id: currentProjectId,
      base_version: options.mode === 'edit' ? record.value?.version ?? null : null,
      saved_at: new Date().toISOString(),
      draft: clone(draft.value)
    }
    try {
      recoveryStorage.setItem(currentKey, JSON.stringify(candidate))
      recoveryStorageKey.value = currentKey
      recoveryRecord.value = candidate
      storageWarning.value = ''
    } catch {
      storageWarning.value = 'Draft lokal belum dapat dipulihkan jika halaman ditutup. Isian tetap tersedia selama sesi ini.'
    }
  }

  refreshRecoveryChoices()
  if (options.persistence && !recoveryStorage) {
    storageWarning.value = 'Pemulihan draft lokal tidak tersedia di perangkat ini. Simpan ke server sebelum meninggalkan halaman.'
  }
  watch(draft, writeRecoverySnapshot, { deep: true, flush: 'post' })

  const persistPendingCreates = () => {
    if (!pendingCreateStorage) {
      storageWarning.value = 'Pemulihan retry create tidak tersedia di sesi browser ini. Simpan proyek sebelum meninggalkan halaman.'
      return
    }
    const prefix = `${options.currentUserId}:`
    const values: Record<string, PendingCreate> = {}
    for (const [scope, pending] of pendingCreates) {
      if (scope.startsWith(prefix)) values[scope.slice(prefix.length)] = pending
    }
    try {
      if (Object.keys(values).length) pendingCreateStorage.setItem(pendingCreateStorageKey, JSON.stringify(values))
      else pendingCreateStorage.removeItem(pendingCreateStorageKey)
    } catch {
      storageWarning.value = 'Pemulihan retry create tidak tersedia di sesi browser ini. Simpan proyek sebelum meninggalkan halaman.'
    }
  }

  const validateForPersistence = (published: boolean) => {
    errors.value = published
      ? validateProjectEditorDraft(draft.value, options.references)
      : validateProjectEditorStructure(draft.value)
    if (Object.keys(errors.value).length) {
      const firstInvalid = getProjectEditorStepForError(errors.value)
      if (firstInvalid !== null) currentStep.value = firstInvalid
      return false
    }
    return true
  }

  const reconcileCreateResult = (
    latest: ProjectEditorDraft,
    frozen: ProjectEditorDraft,
    persisted: ProjectEditorRecord
  ) => {
    const next = clone(latest)
    for (const role of next.roles) {
      if (role.id) continue
      const originalIndex = frozen.roles.findIndex(item => item.client_key === role.client_key)
      if (originalIndex >= 0) role.id = persisted.draft.roles[originalIndex]?.id
    }
    return next
  }

  const persistToServer = async (kind: 'draft' | 'updated'): Promise<boolean> => {
    const persistence = options.persistence
    if (!persistence) return false
    if (!(options.contextAvailable?.() ?? true)) {
      submitError.value = 'Informasi akunmu perlu dimuat kembali sebelum menyimpan. Isian tetap tersedia.'
      return false
    }
    if (!validateForPersistence(kind === 'updated' && record.value?.status !== 'draft')) return false
    if ((draft.value.creation_mode === 'organization_initiated' &&
      (!selectedOrganization.value || !hasValidOrganizationFields(draft.value))) ||
      (draft.value.creation_mode === 'personal' && draft.value.initiator_organization_id)) {
      submitError.value = 'Pilihan inisiasi tidak sesuai. Pilih organisasi yang diizinkan dan pertahankan ownership sesuai mode proyek.'
      return false
    }

    const scope = persistenceScope()
    const frozenDraft = clone(draft.value)
    try {
      let detail: Awaited<ReturnType<typeof persistence.create>>
      let frozenCreate: { clientRequestId: string; draft: ProjectEditorDraft } | null = null
      if (options.mode === 'create' && !record.value?.id) {
        frozenCreate = pendingCreates.get(scope) ?? { clientRequestId: newRequestId(), draft: frozenDraft }
        pendingCreates.set(scope, frozenCreate)
        persistPendingCreates()
        detail = await persistence.create({
          client_request_id: frozenCreate.clientRequestId,
          definition: toProjectDefinition(frozenCreate.draft)
        })
      } else {
        if (!record.value?.id) {
          submitError.value = 'Proyek belum termuat dari server. Muat ulang halaman sebelum menyimpan.'
          return false
        }
        detail = await persistence.update(record.value.id, {
          version: record.value.version,
          definition: toProjectDefinition(frozenDraft)
        })
      }

      if (!isMounted || !(options.contextAvailable?.() ?? true) || scope !== persistenceScope()) return false
      const serverRecord = toProjectEditorRecord(detail)
      let savedRecord = serverRecord
      if (frozenCreate) {
        pendingCreates.delete(scope)
        persistPendingCreates()
        const latest = clone(draft.value)
        const unchangedSinceRequest = snapshotDraft(latest) === snapshotDraft(frozenCreate.draft)
        draft.value = unchangedSinceRequest
          ? clone(serverRecord.draft)
          : reconcileCreateResult(latest, frozenCreate.draft, serverRecord)
        record.value = serverRecord
        baseline.value = snapshotDraft(serverRecord.draft)
        if (!unchangedSinceRequest) {
          const updatedDetail = await persistence.update(serverRecord.id, {
            version: serverRecord.version,
            definition: toProjectDefinition(draft.value)
          })
          if (!isMounted || !(options.contextAvailable?.() ?? true) || scope !== persistenceScope()) return false
          savedRecord = toProjectEditorRecord(updatedDetail)
          draft.value = clone(savedRecord.draft)
        }
      } else {
        draft.value = clone(serverRecord.draft)
      }
      record.value = savedRecord
      baseline.value = snapshotDraft(savedRecord.draft)
      removeRecoveryForCurrentScope()
      submitError.value = ''
      storageWarning.value = ''
      saveResult.value = {
        kind,
        message: kind === 'draft' ? 'Draft tersimpan di server.' : 'Perubahan tersimpan di server.'
      }
      return true
    } catch (error: unknown) {
      const status = getApiErrorStatus(error)
      const definitiveCreateConflict = status === 409 && options.mode === 'create' && !record.value?.id
      if ((status !== undefined && status >= 400 && status < 500 && status !== 409) || definitiveCreateConflict) {
        pendingCreates.delete(scope)
        persistPendingCreates()
      }
      if (isMounted && (options.contextAvailable?.() ?? true) && scope === persistenceScope()) {
        submitError.value = getApiErrorMessage(error, kind === 'draft'
          ? 'Draft belum tersimpan. Coba lagi; isianmu tetap tersedia.'
          : 'Perubahan belum tersimpan. Periksa koneksi lalu coba lagi.')
      }
      return false
    }
  }

  const persist = (
    nextStatus: ProjectEditorRecord['status'],
    kind: 'draft' | 'published' | 'updated'
  ) => {
    if (kind === 'published' && !canPublish.value) {
      submitError.value = 'Persyaratan publikasi berubah. Periksa kembali informasi akun dan pilihan organisasi sebelum mencoba lagi.'
      return false
    }
    if (!(options.contextAvailable?.() ?? true)) {
      submitError.value = 'Informasi akunmu perlu dimuat kembali sebelum menyimpan. Isian draft tetap tersedia.'
      return false
    }
    if ((draft.value.creation_mode === 'organization_initiated' &&
      (!selectedOrganization.value || !hasValidOrganizationFields(draft.value))) ||
      (draft.value.creation_mode === 'personal' && draft.value.initiator_organization_id)) {
      submitError.value = 'Pilihan inisiasi tidak sesuai. Pilih organisasi yang diizinkan, gunakan visibilitas publik, dan biarkan ownership kosong.'
      return false
    }
    const candidate = createRecord(draft.value, nextStatus, record.value?.id)
    candidate.ownership = getOwnership(nextStatus)
    const parsed = recordSchema.safeParse(candidate)
    if (!parsed.success) {
      submitError.value = 'Data pratinjau belum dapat disimpan. Periksa nilai jumlah orang dan tanggal.'
      return false
    }
    if (!storage) {
      submitError.value = 'Penyimpanan pratinjau tidak tersedia di perangkat ini.'
      return false
    }

    const nextKey = getStorageKey(parsed.data.slug)
    // Creation modes are separate drafts; only an edit slug rename moves a key.
    const previousKey = options.mode === 'edit'
      ? record.value ? getStorageKey(record.value.slug) : originalStorageKey
      : nextKey
    try {
      storage.setItem(nextKey, JSON.stringify(parsed.data))
      if (previousKey !== nextKey) storage.removeItem(previousKey)
    } catch {
      submitError.value = 'Perubahan belum tersimpan. Periksa ruang penyimpanan perangkat ini, lalu coba lagi.'
      return false
    }

    record.value = parsed.data
    draft.value = clone(parsed.data.draft)
    baseline.value = snapshotDraft(draft.value)
    submitError.value = ''
    storageWarning.value = ''
    const messages = {
      draft: 'Draft tersimpan di perangkat ini.',
      published: 'Simulasi publikasi berhasil. Proyek belum diterbitkan ke server.',
      updated: 'Perubahan tersimpan di perangkat ini.'
    }
    saveResult.value = { kind, message: messages[kind] }
    return true
  }

  const validateStep = (step: ProjectEditorStep) => {
    const stepErrors = validateProjectEditorStep(step, draft.value, options.references)
    errors.value = { ...errors.value, ...stepErrors }
    for (const key of Object.keys(errors.value)) {
      if (!stepErrors[key]) delete errors.value[key]
    }
    return Object.keys(stepErrors).length === 0
  }

  const validateAll = () => {
    errors.value = validateProjectEditorDraft(draft.value, options.references)
    if (Object.keys(errors.value).length) {
      const firstInvalid = getProjectEditorStepForError(errors.value)
      if (firstInvalid !== null) currentStep.value = firstInvalid
      return false
    }
    return true
  }

  const goToStep = (step: number) => {
    if (!Number.isInteger(step) || step < 0 || step > 4 || isSubmitting.value) return false
    if (options.mode === 'create' && step > currentStep.value) {
      for (let index = currentStep.value; index < step; index += 1) {
        if (!validateStep(index as ProjectEditorStep)) {
          currentStep.value = index as ProjectEditorStep
          return false
        }
      }
    }
    currentStep.value = step as ProjectEditorStep
    submitError.value = ''
    saveResult.value = null
    return true
  }

  const next = () => {
    if (currentStep.value >= 4 || isSubmitting.value) return false
    if (!validateStep(currentStep.value)) return false
    currentStep.value = (currentStep.value + 1) as ProjectEditorStep
    submitError.value = ''
    saveResult.value = null
    return true
  }

  const back = () => goToStep(currentStep.value - 1)

  const addRole = () => {
    if (isSubmitting.value) return
    let clientKey = 'role-create-' + roleSequence
    while (draft.value.roles.some(role => role.client_key === clientKey)) {
      roleSequence += 1
      clientKey = 'role-create-' + roleSequence
    }
    roleSequence += 1
    draft.value.roles.push({
      client_key: clientKey,
      description: '',
      capacity: 1,
      filled_capacity: 0,
      tool_ids: [],
      skill_ids: []
    })
    saveResult.value = null
  }

  const removeRole = (clientKey: string) => {
    const index = draft.value.roles.findIndex(role => role.client_key === clientKey)
    if (index < 0 || isSubmitting.value || draft.value.roles.length <= 1) return false
    if ((draft.value.roles[index]?.filled_capacity ?? 0) > 0) {
      errors.value['roles.' + clientKey + '.capacity'] = 'Peran tidak dapat dihapus karena sudah memiliki anggota.'
      return false
    }
    draft.value.roles.splice(index, 1)
    delete errors.value['roles.' + clientKey + '.capacity']
    saveResult.value = null
    return true
  }

  const setOrigin = (origin: ProjectEditorDraft['origin']) => {
    draft.value.origin = origin
    if (origin !== 'client') draft.value.client_acknowledgement = false
    delete errors.value.origin
    delete errors.value.client_acknowledgement
    saveResult.value = null
  }

  const activateDraft = (mode: ProjectCreationMode, organizationId: string | null) => {
    if (options.mode !== 'create' || isSubmitting.value || !(options.contextAvailable?.() ?? true) ||
      !['personal', 'organization_initiated'].includes(mode) ||
      (mode === 'organization_initiated' && !organizations.value.some(org => org.id === organizationId))) return false
    const nextScope = mode === 'personal' ? 'personal' : 'organization:' + organizationId
    if (nextScope === draftScope(draft.value)) return true
    modeDrafts.value.set(draftScope(draft.value), { draft: clone(draft.value), record: clone(record.value), baseline: baseline.value })
    const previous = modeDrafts.value.get(nextScope)
    const pending = pendingCreates.get(`${options.currentUserId}:${nextScope}`)
    draft.value = previous
      ? clone(previous.draft)
      : pending
        ? clone(pending.draft)
        : { ...createBlankProjectEditorDraft(), creation_mode: mode, initiator_organization_id: organizationId }
    record.value = previous ? clone(previous.record) : null
    if (!previous) restore()
    baseline.value = previous?.baseline ?? snapshotDraft(draft.value)
    refreshRecoveryChoices()
    currentStep.value = 0
    errors.value = {}
    submitError.value = ''
    saveResult.value = null
    return true
  }
  const setCreationMode = (mode: ProjectCreationMode) =>
    activateDraft(mode, mode === 'personal' ? null : organizations.value[0]?.id ?? null)
  const selectOrganization = (id: string) => draft.value.creation_mode === 'organization_initiated'
    ? activateDraft('organization_initiated', id) : false

  const waitForCompletion = async () => {
    await new Promise<void>(resolve => {
      activeTimer = setTimeout(resolve, Math.max(0, options.delayMs ?? 220))
    })
    activeTimer = undefined
    return isMounted
  }

  const saveDraft = async () => {
    if (isSubmitting.value || options.mode !== 'create') return false
    isSubmitting.value = true
    submitError.value = ''
    saveResult.value = null
    if (options.persistence) {
      try {
        return await persistToServer('draft')
      } finally {
        isSubmitting.value = false
      }
    }
    try {
      if (!await waitForCompletion()) return false
      return persist('draft', 'draft')
    } catch {
      submitError.value = 'Draft pratinjau tidak dapat disimpan. Coba lagi setelah memeriksa perangkat ini.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const saveChanges = async () => {
    if (isSubmitting.value || options.mode !== 'edit' || !record.value) return false
    if (options.persistence) {
      isSubmitting.value = true
      submitError.value = ''
      saveResult.value = null
      try {
        return await persistToServer('updated')
      } finally {
        isSubmitting.value = false
      }
    }
    if (!validateAll()) return false
    isSubmitting.value = true
    submitError.value = ''
    saveResult.value = null
    try {
      if (!await waitForCompletion()) return false
      return persist(record.value.status, 'updated')
    } catch {
      submitError.value = 'Perubahan pratinjau tidak dapat disimpan. Coba lagi setelah memeriksa perangkat ini.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const publish = async () => {
    const publishingSavedDraft = options.mode === 'edit' && record.value?.status === 'draft'
    if (isSubmitting.value || (options.mode !== 'create' && !publishingSavedDraft) || !validateAll()) return false
    if (!canPublish.value) {
      submitError.value = 'Verifikasi email dan selesaikan onboarding untuk mencoba publikasi pratinjau.'
      return false
    }
    isSubmitting.value = true
    submitError.value = ''
    saveResult.value = null
    if (options.persistence) {
      try {
        if (!record.value || isDirty.value) {
          const saved = await persistToServer(record.value ? 'updated' : 'draft')
          if (!saved) return false
        }
        if (isDirty.value && !await persistToServer('updated')) return false
        if (!record.value?.id || !(options.contextAvailable?.() ?? true)) return false
        const detail = await options.persistence.publish(record.value.id, { version: record.value.version })
        if (!isMounted || !(options.contextAvailable?.() ?? true)) return false
        record.value = toProjectEditorRecord(detail)
        draft.value = clone(record.value.draft)
        baseline.value = snapshotDraft(draft.value)
        removeRecoveryForCurrentScope()
        saveResult.value = {
          kind: 'published',
          message: draft.value.creation_mode === 'organization_initiated'
            ? 'Proyek dipublikasikan dan menunggu Project Lead.'
            : 'Proyek berhasil dipublikasikan.'
        }
        return true
      } catch (error: unknown) {
        if (isMounted && (options.contextAvailable?.() ?? true)) {
          submitError.value = getApiErrorMessage(error, 'Draft tersimpan, tetapi publikasi belum berhasil. Coba lagi.')
        }
        return false
      } finally {
        isSubmitting.value = false
      }
    }
    try {
      if (!await waitForCompletion()) return false
      return persist(draft.value.creation_mode === 'organization_initiated' ? 'awaiting_owner' : 'open', 'published')
    } catch {
      submitError.value = 'Simulasi publikasi gagal. Draft tetap berada di formulir.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  onBeforeUnmount(() => {
    isMounted = false
    if (activeTimer !== undefined) clearTimeout(activeTimer)
  })

  return {
    draft,
    record,
    currentStep,
    errors,
    submitError,
    storageWarning,
    recoveryAvailable,
    legacyTextRecoveryAvailable,
    isSubmitting,
    saveResult,
    isDirty,
    totalCapacity,
    canPublish,
    canInitiateOrganization,
    selectedOrganization,
    goToStep,
    next,
    back,
    addRole,
    removeRole,
    setOrigin,
    setCreationMode,
    selectOrganization,
    restoreRecovery,
    restoreLegacyTextRecovery,
    dismissRecovery,
    validateStep,
    validateAll,
    saveDraft,
    saveChanges,
    publish
  }
}
