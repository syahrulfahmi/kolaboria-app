<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { ApplicantAvailability, ProjectRole } from '../../types/project'

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
