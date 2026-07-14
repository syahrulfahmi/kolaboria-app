<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { ApplicantAvailability } from '../../types/project'

const props = defineProps<{
  projectId: string
  show: boolean
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
  availability: 'flexible' as ApplicantAvailability
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

const isValid = computed(() => !motivationError.value)

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
      <div>
        <label class="mb-1.5 block text-caption text-body text-secondary-900">
          Kenapa kamu tertarik bergabung? <span class="text-danger-500">*</span>
        </label>
        <textarea
          v-model="form.motivation"
          rows="4"
          placeholder="Ceritakan ketertarikanmu pada project ini (min. 10 karakter)."
          class="w-full rounded-lg border bg-white px-4 py-3 text-body text-neutral-900 outline-none transition duration-150 resize-none focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
          :class="
            showErrors && motivationError
              ? 'border-red-300 focus:border-red-500'
              : 'border-neutral-300 focus:border-primary-500'
          "
        />
        <p
          v-if="showErrors && motivationError"
          class="mt-1.5 text-xs text-red-500 font-medium"
        >
          {{ motivationError }}
        </p>
      </div>

      <div>
        <label class="mb-1.5 block text-caption text-body text-secondary-900">
          Kontribusi yang bisa diberikan
        </label>
        <textarea
          v-model="form.expected_contribution"
          rows="3"
          placeholder="Apa yang akan kamu lakukan di project ini?"
          class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 outline-none transition duration-150 resize-none focus:outline-none focus:border-primary-500 disabled:bg-neutral-100 disabled:text-neutral-500"
        />
      </div>

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

      <div>
        <label class="mb-1.5 block text-caption text-body text-secondary-900">
          Ketersediaan Waktu
        </label>
        <select
          v-model="form.availability"
          class="h-[42px] w-full rounded-lg border border-neutral-300 bg-white px-3 text-body text-neutral-900 outline-none transition duration-150 focus:border-primary-500 disabled:bg-neutral-100 disabled:text-neutral-500"
        >
          <option value="flexible">Fleksibel</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="weekends_only">Hanya Akhir Pekan</option>
        </select>
      </div>

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
