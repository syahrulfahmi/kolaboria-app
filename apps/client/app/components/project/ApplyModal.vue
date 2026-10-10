<script setup lang="ts">
import { getApiErrorMessage } from '../../utils/error'
import { ref, reactive, computed, watch } from 'vue'
import type {
  ApplicantAvailability,
  ApplyProjectRequest,
  ProjectRole
} from '../../types/project'
import type { UserSkill, UserTool } from '../../types/profile'

const MIN_MOTIVATION_LENGTH = 10
const MAX_APPLICATION_TEXT_LENGTH = 5000
const MAX_PORTFOLIO_LINKS = 10
const MAX_PORTFOLIO_LINK_LENGTH = 2048
const MIN_ESTIMATED_HOURS = 1
const MAX_ESTIMATED_HOURS = 168

const props = defineProps<{
  projectId: string
  show: boolean
  roles: ProjectRole[]
}>()

const emit = defineEmits<{
  close: []
  applied: []
}>()

const { applyToProject } = useProjects()
const { getUserSkills, getUserTools } = useSkill()

const isSubmitting = ref(false)
const submitError = ref('')
const showErrors = ref(false)

const form = reactive({
  motivation: '',
  expected_contribution: '',
  portfolio_links: [] as string[],
  availability: 'flexible' as ApplicantAvailability,
  project_role_id: '',
  estimated_hours_per_week: ''
})

const portfolioInput = ref('')
const portfolioInputError = ref('')
const userSkills = ref<UserSkill[]>([])
const userTools = ref<UserTool[]>([])
const hasLoadedProfileCompetencies = ref(false)
const isLoadingProfileCompetencies = ref(false)

const loadProfileCompetencies = async () => {
  if (hasLoadedProfileCompetencies.value || isLoadingProfileCompetencies.value) {
    return
  }

  isLoadingProfileCompetencies.value = true
  try {
    const [skills, tools] = await Promise.all([getUserSkills(), getUserTools()])
    userSkills.value = skills
    userTools.value = tools
    hasLoadedProfileCompetencies.value = true
  } finally {
    isLoadingProfileCompetencies.value = false
  }
}

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) void loadProfileCompetencies()
  }
)

const addPortfolio = () => {
  const val = portfolioInput.value.trim()
  if (!val) return
  if (val.length > MAX_PORTFOLIO_LINK_LENGTH) {
    portfolioInputError.value = `Link maksimal ${MAX_PORTFOLIO_LINK_LENGTH} karakter.`
    return
  }
  if (form.portfolio_links.includes(val)) {
    portfolioInputError.value = 'Link ini sudah ditambahkan.'
    return
  }
  if (form.portfolio_links.length >= MAX_PORTFOLIO_LINKS) {
    portfolioInputError.value = `Maksimal ${MAX_PORTFOLIO_LINKS} link portfolio.`
    return
  }

  form.portfolio_links.push(val)
  portfolioInput.value = ''
  portfolioInputError.value = ''
}

const removePortfolio = (link: string) => {
  form.portfolio_links = form.portfolio_links.filter((l) => l !== link)
  portfolioInputError.value = ''
}

const motivationError = computed(() => {
  const motivation = form.motivation.trim()
  if (!motivation) return 'Motivasi wajib diisi.'
  if (motivation.length < MIN_MOTIVATION_LENGTH) {
    return `Motivasi harus minimal ${MIN_MOTIVATION_LENGTH} karakter.`
  }
  if (motivation.length > MAX_APPLICATION_TEXT_LENGTH) {
    return `Motivasi maksimal ${MAX_APPLICATION_TEXT_LENGTH} karakter.`
  }
  return ''
})

const expectedContributionError = computed(() =>
  form.expected_contribution.trim().length > MAX_APPLICATION_TEXT_LENGTH
    ? `Kontribusi maksimal ${MAX_APPLICATION_TEXT_LENGTH} karakter.`
    : ''
)

const roleError = computed(() =>
  !form.project_role_id ? 'Pilih role yang ingin kamu lamar.' : ''
)

const estimatedHoursError = computed(() => {
  const value = form.estimated_hours_per_week.trim()
  if (!value) return ''

  const hours = Number(value)
  return Number.isInteger(hours) &&
    hours >= MIN_ESTIMATED_HOURS &&
    hours <= MAX_ESTIMATED_HOURS
    ? ''
    : `Estimasi harus berupa bilangan bulat ${MIN_ESTIMATED_HOURS}–${MAX_ESTIMATED_HOURS} jam.`
})

const isValid = computed(() =>
  !motivationError.value &&
  !expectedContributionError.value &&
  !roleError.value &&
  !estimatedHoursError.value
)

const roleOptions = computed(() => {
  return props.roles.map((role) => {
    const title =
      role.custom_title || role.contribution_role?.name || 'Project Role'
    return {
      label: `${title} — ${role.remaining_capacity} tersisa`,
      value: role.id
    }
  })
})

const selectedRole = computed(() =>
  props.roles.find((role) => role.id === form.project_role_id)
)

const roleIsInProfile = computed(() => {
  const contributionRoleID = selectedRole.value?.contribution_role_id
  return Boolean(
    contributionRoleID &&
    userSkills.value.some((skill) => skill.skill_id === contributionRoleID)
  )
})

const matchedRoleTools = computed(() => {
  const userToolIDs = new Set(userTools.value.map((tool) => tool.tool_id))
  return (
    selectedRole.value?.tools.filter((tool) => userToolIDs.has(tool.id)) || []
  )
})

const missingRoleTools = computed(() => {
  const matchedToolIDs = new Set(matchedRoleTools.value.map((tool) => tool.id))
  return (
    selectedRole.value?.tools.filter((tool) => !matchedToolIDs.has(tool.id)) ||
    []
  )
})

const AVAILABILITY_OPTIONS = [
  { label: 'Fleksibel', value: 'flexible' },
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Hanya Akhir Pekan', value: 'weekends_only' }
]

const createApplicationRequest = (): ApplyProjectRequest => {
  const expectedContribution = form.expected_contribution.trim()
  const estimatedHours = form.estimated_hours_per_week.trim()

  return {
    project_role_id: form.project_role_id,
    motivation: form.motivation.trim(),
    expected_contribution: expectedContribution || null,
    portfolio_links: [...form.portfolio_links],
    availability: form.availability,
    estimated_hours_per_week: estimatedHours ? Number(estimatedHours) : null
  }
}

const submitApplication = async () => {
  if (!isValid.value) {
    showErrors.value = true
    return
  }

  isSubmitting.value = true
  submitError.value = ''
  try {
    await applyToProject(props.projectId, createApplicationRequest())
    emit('applied')
    emit('close')
  } catch (e: unknown) {
    submitError.value = getApiErrorMessage(e, 'Gagal mengirim lamaran.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <OrganismModal
    :model-value="show"
    title="Apply ke Project"
    @close="emit('close')"
  >
    <div class="space-y-5">
      <MoleculeDropdown
        v-model="form.project_role_id"
        label="Role yang Dilamar"
        placeholder="Pilih role..."
        :options="roleOptions"
        required
        :disabled="isSubmitting"
        :error="showErrors && roleError ? roleError : ''"
      />

      <div
        v-if="selectedRole"
        class="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
      >
        <p class="font-label-2 text-secondary">Kecocokan Profil</p>
        <p
          v-if="selectedRole.contribution_role_id"
          class="mt-2 text-sm text-secondary"
        >
          <span v-if="roleIsInProfile" class="text-success-700">
            Role ini tercatat pada profilmu.
          </span>
          <span v-else>
            Role ini belum tercatat pada profilmu. Kamu tetap dapat melamar dan
            menjelaskan pengalamanmu.
          </span>
        </p>
        <p v-else class="mt-2 text-sm text-secondary">
          Ini adalah role custom; jelaskan pengalaman yang relevan pada
          lamaranmu.
        </p>

        <div v-if="selectedRole.tools.length" class="mt-3">
          <p class="text-xs text-secondary">
            Tools: {{ matchedRoleTools.length }} dari
            {{ selectedRole.tools.length }} tercatat pada profil
          </p>
          <div class="mt-1.5 flex flex-wrap gap-1.5">
            <AtomicTagCategory
              v-for="tool in matchedRoleTools"
              :key="tool.id"
              variant="success"
            >
              {{ tool.name }}
            </AtomicTagCategory>
            <AtomicTagCategory
              v-for="tool in missingRoleTools"
              :key="tool.id"
              variant="default"
            >
              {{ tool.name }}
            </AtomicTagCategory>
          </div>
        </div>
        <p v-else class="mt-3 text-xs text-secondary">
          Project belum menetapkan tools khusus untuk role ini.
        </p>
      </div>

      <MoleculeInputField
        :model-value="form.estimated_hours_per_week"
        type="number"
        label="Estimasi Jam per Minggu (Opsional)"
        :min="MIN_ESTIMATED_HOURS"
        :max="MAX_ESTIMATED_HOURS"
        placeholder="Contoh: 10"
        :disabled="isSubmitting"
        :error="showErrors ? estimatedHoursError : ''"
        @update:model-value="form.estimated_hours_per_week = $event"
      />

      <MoleculeTextarea
        v-model="form.motivation"
        label="Kenapa kamu tertarik bergabung?"
        placeholder="Ceritakan ketertarikanmu pada project ini (min. 10 karakter)."
        required
        :rows="4"
        :max-length="MAX_APPLICATION_TEXT_LENGTH"
        :show-counter="true"
        :disabled="isSubmitting"
        :error="showErrors && motivationError ? motivationError : ''"
      />

      <MoleculeTextarea
        v-model="form.expected_contribution"
        label="Kontribusi yang bisa diberikan"
        placeholder="Apa yang akan kamu lakukan di project ini?"
        :rows="3"
        :max-length="MAX_APPLICATION_TEXT_LENGTH"
        :disabled="isSubmitting"
        :error="showErrors ? expectedContributionError : ''"
      />

      <div>
        <label class="mb-1.5 block text-caption text-body text-secondary-900">
          Link Portfolio / Relevan
        </label>
        <div class="flex gap-2 items-center">
          <MoleculeInputField
            v-model="portfolioInput"
            type="url"
            placeholder="https://..."
            class="flex-1"
            :maxlength="MAX_PORTFOLIO_LINK_LENGTH"
            :disabled="isSubmitting"
            :error="portfolioInputError"
            @keydown.enter.prevent="addPortfolio"
          />
          <AtomicButton type="button" variant="outline" :disabled="isSubmitting" @click="addPortfolio"
            >Tambah</AtomicButton
          >
        </div>
        <div
          v-if="form.portfolio_links.length > 0"
          class="mt-3 flex flex-wrap gap-2"
        >
          <span
            v-for="link in form.portfolio_links"
            :key="link"
            class="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-caption font-medium text-neutral-700 max-w-xs truncate"
          >
            <span class="truncate">{{ link }}</span>
            <button
              type="button"
              class="shrink-0 text-neutral-400 hover:text-danger-500 transition-colors"
              :aria-label="`Hapus link ${link}`"
              :disabled="isSubmitting"
              @click="removePortfolio(link)"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <MoleculeDropdown
        v-model="form.availability"
        label="Ketersediaan Waktu"
        placeholder="Pilih ketersediaan waktu"
        :options="AVAILABILITY_OPTIONS"
        :disabled="isSubmitting"
      />

      <MoleculeTicker
        v-if="submitError"
        variant="danger"
        :message="submitError"
        :closable="false"
      />
    </div>

    <template #footer>
      <AtomicButton
        variant="outline"
        @click="emit('close')"
        :disabled="isSubmitting"
        class="flex-1 sm:flex-initial"
      >
        Batal
      </AtomicButton>
      <AtomicButton
        variant="primary"
        :disabled="isSubmitting"
        @click="submitApplication"
        class="flex-1 sm:flex-initial"
      >
        {{ isSubmitting ? 'Mengirim...' : 'Kirim Lamaran' }}
      </AtomicButton>
    </template>
  </OrganismModal>

  <MoleculeLoading
    v-if="isSubmitting"
    type="fullscreen"
    label="Mengirim Lamaran..."
  />
</template>
