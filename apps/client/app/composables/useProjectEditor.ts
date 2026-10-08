import { computed, onBeforeUnmount, ref } from 'vue'
import { z } from 'zod'
import { createBlankProjectEditorDraft } from '../data/project-editor-fixtures'
import {
  getProjectEditorStepForError,
  validateProjectEditorDraft,
  validateProjectEditorStep
} from '../data/project-editor-validation'
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
  custom_title: z.string().optional(),
  description: z.string(),
  capacity: z.number().int(),
  filled_capacity: z.number().int().nonnegative(),
  tool_ids: z.array(z.string()),
  skill_tags: z.array(z.string())
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
  visibility: z.enum(['public', 'invite_only']),
  roles: z.array(roleSchema),
  tool_ids: z.array(z.string()),
  owner_contribution_role_id: z.string().optional(),
  owner_custom_role_title: z.string().optional(),
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
  version: z.literal(1)
})

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

const clone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T

const snapshotDraft = (draft: ProjectEditorDraft) => JSON.stringify(draft)
const draftScope = (draft: ProjectEditorDraft) => draft.creation_mode === 'personal'
  ? 'personal' : 'organization:' + (draft.initiator_organization_id || 'unselected')

const hasValidOrganizationFields = (draft: ProjectEditorDraft) =>
  draft.visibility === 'public' && !draft.owner_commitment.trim() &&
  !draft.owner_contribution_role_id && !draft.owner_custom_role_title

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
  const record = ref<ProjectEditorRecord | null>(options.initialRecord ? clone(options.initialRecord) : null)
  const draft = ref<ProjectEditorDraft>(
    options.initialRecord
      ? clone(options.initialRecord.draft)
      : options.initialDraft
        ? clone(options.initialDraft)
        : createBlankProjectEditorDraft()
  )
  const currentStep = ref<ProjectEditorStep>(0)
  const errors = ref<ProjectEditorErrors>({})
  const submitError = ref('')
  const storageWarning = ref('')
  const isSubmitting = ref(false)
  const saveResult = ref<{ kind: 'draft' | 'published' | 'updated'; message: string } | null>(null)
  const baseline = ref(snapshotDraft(draft.value))
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
      skill_tags: []
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
    draft.value = previous ? clone(previous.draft) : { ...createBlankProjectEditorDraft(), creation_mode: mode, initiator_organization_id: organizationId }
    record.value = previous ? clone(previous.record) : null
    if (!previous) restore()
    baseline.value = previous?.baseline ?? snapshotDraft(draft.value)
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
    if (isSubmitting.value || options.mode !== 'edit' || !record.value || !validateAll()) return false
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
    if (isSubmitting.value || options.mode !== 'create' || !validateAll()) return false
    if (!canPublish.value) {
      submitError.value = 'Verifikasi email dan selesaikan onboarding untuk mencoba publikasi pratinjau.'
      return false
    }
    isSubmitting.value = true
    submitError.value = ''
    saveResult.value = null
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
    validateStep,
    validateAll,
    saveDraft,
    saveChanges,
    publish
  }
}
