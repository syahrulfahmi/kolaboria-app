import type {
  ProjectEditorDraft,
  ProjectEditorErrors,
  ProjectEditorReferences,
  ProjectEditorRole,
  ProjectEditorStep
} from '../types/project-editor'

const availableOrigin = new Set([
  'personal',
  'community',
  'experiment',
  'client'
])
const availableVisibility = new Set(['public', 'invite_only'])
const availableAvailability = new Set([
  'flexible',
  'part_time',
  'weekends_only',
  'full_time'
])
const availableHours = new Set([5, 10, 15, 20])
const categoryIds = new Set([
  'product',
  'community',
  'open_source',
  'research',
  'education',
  'business',
  'other'
])

export const normalizeProjectEditorTag = (value: string) => value.trim()

export const addProjectEditorTag = (tags: string[], value: string) => {
  const normalized = normalizeProjectEditorTag(value)
  if (
    !normalized ||
    tags.some(
      (tag) =>
        tag.toLocaleLowerCase('id-ID') === normalized.toLocaleLowerCase('id-ID')
    )
  )
    return [...tags]
  return [...tags, normalized]
}

export const getProjectEditorCapacity = (roles: ProjectEditorRole[]) =>
  roles.reduce(
    (total, role) =>
      total +
      (Number.isSafeInteger(role.capacity) && role.capacity > 0
        ? role.capacity
        : 0),
    0
  )

const validDateOnly = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

const validateBasic = (draft: ProjectEditorDraft): ProjectEditorErrors => {
  const errors: ProjectEditorErrors = {}
  if (!['personal', 'organization_initiated'].includes(draft.creation_mode))
    errors.creation_mode = 'Pilih atas nama siapa proyek dibuat.'
  if (draft.creation_mode === 'organization_initiated' && !draft.initiator_organization_id)
    errors.initiator_organization_id = 'Pilih organisasi yang kamu wakili.'
  if (draft.creation_mode === 'personal' && draft.initiator_organization_id)
    errors.initiator_organization_id = 'Proyek pribadi tidak mewakili organisasi.'
  if (draft.creation_mode === 'organization_initiated' && draft.visibility !== 'public')
    errors.visibility = 'Proyek organisasi harus publik agar dapat menemukan Project Lead.'
  if (!draft.title.trim()) errors.title = 'Judul proyek wajib diisi.'
  else if (draft.title.trim().length > 80)
    errors.title = 'Judul proyek maksimal 80 karakter.'
  if (!draft.summary.trim()) errors.summary = 'Ringkasan proyek wajib diisi.'
  else if (draft.summary.trim().length > 180)
    errors.summary = 'Ringkasan maksimal 180 karakter.'
  if (!draft.description.trim())
    errors.description = 'Ceritakan deskripsi proyek terlebih dahulu.'
  if (!categoryIds.has(draft.project_category))
    errors.project_category = 'Pilih kategori proyek yang tersedia.'
  if (!availableVisibility.has(draft.visibility))
    errors.visibility = 'Pilih visibilitas proyek.'
  if (draft.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug))
    errors.slug =
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.'
  return errors
}

const validateTeam = (
  draft: ProjectEditorDraft,
  references?: ProjectEditorReferences
): ProjectEditorErrors => {
  const errors: ProjectEditorErrors = {}
  if (!draft.roles.length)
    errors.roles = 'Tambahkan minimal satu kebutuhan peran.'
  draft.roles.forEach((role) => {
    const prefix = 'roles.' + role.client_key
    const validMasterRole = references?.contribution_roles.some(
      ({ id }) => id === role.contribution_role_id
    )
    if (!role.contribution_role_id && !role.custom_title?.trim())
      errors[prefix + '.contribution_role_id'] = 'Pilih atau tulis nama peran.'
    else if (role.contribution_role_id && references && !validMasterRole)
      errors[prefix + '.contribution_role_id'] = 'Pilih peran yang tersedia.'
    if (!role.description.trim())
      errors[prefix + '.description'] = 'Jelaskan tanggung jawab peran.'
    if (
      !Number.isSafeInteger(role.capacity) ||
      role.capacity < 1 ||
      role.capacity > 20
    )
      errors[prefix + '.capacity'] =
        'Jumlah orang harus berupa bilangan bulat 1–20.'
    else if (role.capacity < role.filled_capacity)
      errors[prefix + '.capacity'] =
        'Jumlah orang tidak boleh di bawah ' +
        role.filled_capacity +
        ' anggota yang sudah terisi.'
    if (!role.skill_tags.length || role.skill_tags.some((tag) => !tag.trim()))
      errors[prefix + '.skill_tags'] =
        'Tambahkan minimal satu skill yang relevan.'
    if (role.tool_ids.length > 8)
      errors[prefix + '.tool_ids'] =
        'Pilih maksimal 8 tools untuk setiap peran.'
    if (
      references &&
      role.tool_ids.some(
        (id) => !references.tools.some((tool) => tool.id === id)
      )
    )
      errors[prefix + '.tool_ids'] = 'Pilih tools yang tersedia.'
  })
  if (getProjectEditorCapacity(draft.roles) > 20)
    errors.capacity = 'Total kebutuhan kontributor maksimal 20 orang.'
  if (draft.tool_ids.length > 12)
    errors.tool_ids = 'Pilih maksimal 12 tools untuk keseluruhan proyek.'
  if (
    references &&
    draft.tool_ids.some(
      (id) => !references.tools.some((tool) => tool.id === id)
    )
  )
    errors.tool_ids = 'Pilih tools proyek yang tersedia.'
  const ownerRoleValid = references?.contribution_roles.some(
    ({ id }) => id === draft.owner_contribution_role_id
  )
  if (draft.creation_mode === 'personal' && draft.owner_contribution_role_id && references && !ownerRoleValid)
    errors.owner_contribution_role_id = 'Pilih peran profesional yang tersedia.'
  if (draft.creation_mode === 'organization_initiated' && (draft.owner_contribution_role_id || draft.owner_custom_role_title))
    errors.owner_contribution_role_id = 'Proyek ini belum memiliki Project Lead. Hapus peran pribadimu.'
  return errors
}

const validateContext = (draft: ProjectEditorDraft): ProjectEditorErrors => {
  const errors: ProjectEditorErrors = {}
  if (!availableOrigin.has(draft.origin)) errors.origin = 'Pilih asal proyek.'
  if (!draft.why_collaborative.trim())
    errors.why_collaborative = 'Jelaskan alasan proyek dibuka untuk kolaborasi.'
  if (!draft.contributor_outcome.trim())
    errors.contributor_outcome = 'Jelaskan hasil yang diharapkan kontributor.'
  if (draft.creation_mode === 'organization_initiated') {
    if (!draft.lead_expectations.trim()) errors.lead_expectations = 'Jelaskan ekspektasi untuk Project Lead.'
    if (draft.owner_commitment.trim()) errors.owner_commitment = 'Proyek ini belum memiliki Project Lead. Isi ekspektasi untuk lead, bukan komitmen pribadi.'
  } else if (!draft.owner_commitment.trim())
    errors.owner_commitment = 'Jelaskan komitmenmu sebagai Project Lead.'
  if (draft.origin === 'client' && !draft.client_acknowledgement)
    errors.client_acknowledgement =
      'Konfirmasikan transparansi kebutuhan klien.'
  return errors
}

const validateTimeline = (draft: ProjectEditorDraft): ProjectEditorErrors => {
  const errors: ProjectEditorErrors = {}
  if (draft.start_date && !validDateOnly(draft.start_date))
    errors.start_date = 'Masukkan tanggal mulai yang valid.'
  if (draft.deadline && !validDateOnly(draft.deadline))
    errors.deadline = 'Masukkan tanggal target yang valid.'
  if (
    draft.start_date &&
    draft.deadline &&
    validDateOnly(draft.start_date) &&
    validDateOnly(draft.deadline) &&
    draft.deadline < draft.start_date
  )
    errors.deadline = 'Tanggal target harus sama atau sesudah tanggal mulai.'
  if (!availableAvailability.has(draft.availability))
    errors.availability = 'Pilih ketersediaan yang tersedia.'
  if (!availableHours.has(draft.hours_per_week))
    errors.hours_per_week = 'Pilih estimasi jam yang tersedia.'
  if (!draft.collaboration_agreement)
    errors.collaboration_agreement =
      'Setujui prinsip kolaborasi sebelum melanjutkan.'
  return errors
}

const mergeErrors = (...groups: ProjectEditorErrors[]) =>
  Object.assign({}, ...groups)

export const validateProjectEditorStep = (
  step: ProjectEditorStep,
  draft: ProjectEditorDraft,
  references?: ProjectEditorReferences
): ProjectEditorErrors => {
  if (step === 0) return validateBasic(draft)
  if (step === 1) return validateTeam(draft, references)
  if (step === 2) return validateContext(draft)
  if (step === 3) return validateTimeline(draft)
  return validateProjectEditorDraft(draft, references)
}

export const validateProjectEditorDraft = (
  draft: ProjectEditorDraft,
  references?: ProjectEditorReferences
): ProjectEditorErrors =>
  mergeErrors(
    validateBasic(draft),
    validateTeam(draft, references),
    validateContext(draft),
    validateTimeline(draft)
  )

export const getProjectEditorStepForError = (
  errors: ProjectEditorErrors
): ProjectEditorStep | null => {
  const keys = Object.keys(errors)
  if (!keys.length) return null
  if (
    keys.some((key) =>
      [
        'title',
        'creation_mode',
        'initiator_organization_id',
        'summary',
        'description',
        'project_category',
        'visibility',
        'slug'
      ].includes(key)
    )
  )
    return 0
  if (
    keys.some(
      (key) =>
        key === 'roles' ||
        key === 'capacity' ||
        key.startsWith('roles.') ||
        ['tool_ids', 'owner_contribution_role_id'].includes(key)
    )
  )
    return 1
  if (
    keys.some((key) =>
      [
        'origin',
        'why_collaborative',
        'contributor_outcome',
        'owner_commitment',
        'lead_expectations',
        'client_acknowledgement'
      ].includes(key)
    )
  )
    return 2
  return 3
}
