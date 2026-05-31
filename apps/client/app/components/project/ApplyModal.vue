<script setup lang="ts">
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

const isValid = computed(() => form.motivation.trim().length > 10)

const submitApplication = async () => {
  if (!isValid.value) return

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
        <label
          class="mb-1.5 block text-caption font-semibold text-secondary-900"
        >
          Kenapa kamu tertarik bergabung? <span class="text-danger-500">*</span>
        </label>
        <textarea
          v-model="form.motivation"
          rows="4"
          placeholder="Ceritakan ketertarikanmu pada project ini (min. 10 karakter)."
          class="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-body outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 resize-none"
        />
      </div>

      <div>
        <label
          class="mb-1.5 block text-caption font-semibold text-secondary-900"
        >
          Kontribusi yang bisa diberikan
        </label>
        <textarea
          v-model="form.expected_contribution"
          rows="3"
          placeholder="Apa yang akan kamu lakukan di project ini?"
          class="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-body outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 resize-none"
        />
      </div>

      <div>
        <label
          class="mb-1.5 block text-caption font-semibold text-secondary-900"
        >
          Link Portfolio / Relevan
        </label>
        <div class="flex gap-2">
          <input
            v-model="portfolioInput"
            type="url"
            placeholder="https://..."
            class="h-11 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-body outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
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
        <label
          class="mb-1.5 block text-caption font-semibold text-secondary-900"
        >
          Ketersediaan Waktu
        </label>
        <select
          v-model="form.availability"
          class="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-body outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
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
        :disabled="!isValid || isSubmitting"
        @click="submitApplication"
      >
        {{ isSubmitting ? 'Mengirim...' : 'Kirim Lamaran' }}
      </AtomicButton>
    </template>
  </OrganismModal>
</template>
