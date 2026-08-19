<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { ApplicantAvailability, ProjectRole } from '../../types/project'
import type { UserSkill, UserTool } from '../../types/profile'

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
  estimated_hours_per_week: undefined as number | undefined
})

const portfolioInput = ref('')
const userSkills = ref<UserSkill[]>([])
const userTools = ref<UserTool[]>([])
const hasLoadedProfileCompetencies = ref(false)

const loadProfileCompetencies = async () => {
  if (hasLoadedProfileCompetencies.value) return

  const [skills, tools] = await Promise.all([getUserSkills(), getUserTools()])
  userSkills.value = skills
  userTools.value = tools
  hasLoadedProfileCompetencies.value = true
}

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) void loadProfileCompetencies()
  }
)

const addPortfolio = () => {
  const val = portfolioInput.value.trim()
  if (val && !form.portfolio_links.includes(val)) {
    form.portfolio_links.push(val)
  }
  portfolioInput.value = ''
}

const removePortfolio = (link: string) => {
  form.portfolio_links = form.portfolio_links.filter((l) => l !== link)
}

const motivationError = computed(() => {
  if (!form.motivation.trim()) return 'Motivasi wajib diisi.'
  if (form.motivation.trim().length < 10)
    return 'Motivasi harus minimal 10 karakter.'
  return ''
})

const roleError = computed(() => !form.project_role_id ? 'Pilih role yang ingin kamu lamar.' : '')
const isValid = computed(() => !motivationError.value && !roleError.value)

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
  return selectedRole.value?.tools.filter((tool) => userToolIDs.has(tool.id)) || []
})

const missingRoleTools = computed(() => {
  const matchedToolIDs = new Set(matchedRoleTools.value.map((tool) => tool.id))
  return selectedRole.value?.tools.filter((tool) => !matchedToolIDs.has(tool.id)) || []
})

const AVAILABILITY_OPTIONS = [
  { label: 'Fleksibel', value: 'flexible' },
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Hanya Akhir Pekan', value: 'weekends_only' }
]

const submitApplication = async () => {
  if (!isValid.value) {
    showErrors.value = true
    return
  }

  isSubmitting.value = true
  submitError.value = ''
  try {
    await applyToProject({
      project_id: props.projectId,
      ...form
    })
    emit('applied')
    emit('close')
  } catch (e: any) {
    submitError.value = e?.message || 'Gagal mengirim lamaran.'
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
        :error="showErrors && roleError ? roleError : ''"
      />

      <div v-if="selectedRole" class="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <p class="font-label-2 text-secondary">Kecocokan Profil</p>
        <p v-if="selectedRole.contribution_role_id" class="mt-2 text-sm text-secondary">
          <span v-if="roleIsInProfile" class="text-success-700">
            Role ini tercatat pada profilmu.
          </span>
          <span v-else>
            Role ini belum tercatat pada profilmu. Kamu tetap dapat melamar dan menjelaskan pengalamanmu.
          </span>
        </p>
        <p v-else class="mt-2 text-sm text-secondary">
          Ini adalah role custom; jelaskan pengalaman yang relevan pada lamaranmu.
        </p>

        <div v-if="selectedRole.tools.length" class="mt-3">
          <p class="text-xs text-secondary">
            Tools: {{ matchedRoleTools.length }} dari {{ selectedRole.tools.length }} tercatat pada profil
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
        v-model.number="form.estimated_hours_per_week"
        type="number"
        label="Estimasi Jam per Minggu (Opsional)"
        min="1"
        max="168"
        placeholder="Contoh: 10"
      />

      <MoleculeTextarea
        v-model="form.motivation"
        label="Kenapa kamu tertarik bergabung?"
        placeholder="Ceritakan ketertarikanmu pada project ini (min. 10 karakter)."
        required
        :rows="4"
        :error="showErrors && motivationError ? motivationError : ''"
      />

      <MoleculeTextarea
        v-model="form.expected_contribution"
        label="Kontribusi yang bisa diberikan"
        placeholder="Apa yang akan kamu lakukan di project ini?"
        :rows="3"
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
            @keydown.enter.prevent="addPortfolio"
          />
          <AtomicButton type="button" variant="outline" @click="addPortfolio"
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
      >
        Batal
      </AtomicButton>
      <AtomicButton
        variant="primary"
        :disabled="isSubmitting"
        @click="submitApplication"
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
