<script setup lang="ts">
import type {
  ProjectEditorDraft,
  ProjectEditorErrors
} from '~/types/project-editor'

const props = defineProps<{ errors: ProjectEditorErrors; disabled: boolean }>()
const draft = defineModel<ProjectEditorDraft>('form', { required: true })
const dateToValue = (value: string | null) => {
  if (!value) return undefined
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}
const valueToDate = (value: Date | undefined) =>
  value
    ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
    : null
const availabilityOptions = [
  { value: 'flexible', label: 'Fleksibel' },
  { value: 'part_time', label: 'Paruh waktu' },
  { value: 'weekends_only', label: 'Akhir pekan' },
  { value: 'full_time', label: 'Penuh waktu' }
]
const hoursOptions = [5, 10, 15, 20].map((value) => ({
  value,
  label: `${value} jam per minggu`
}))
</script>

<template>
  <section
    aria-labelledby="project-timeline-title"
    class="space-y-6 p-4 lg:p-5"
  >
    <header>
      <span class="font-label-2 text-brand">Langkah 4 dari 5</span>
      <h2 id="project-timeline-title" class="mt-2 font-title-1 text-primary">
        Waktu & Komitmen
      </h2>
      <p class="mt-2 font-paragraph-3 text-secondary">
        Berikan gambaran waktu dan komitmen agar calon kontributor bisa menilai
        kecocokannya.
      </p>
    </header>

    <div class="grid gap-5 sm:grid-cols-2">
      <MoleculeDatePicker
        label="Tanggal mulai (opsional)"
        placeholder="Pilih tanggal mulai"
        :model-value="dateToValue(draft.start_date)"
        :error="errors.start_date"
        :disabled="disabled"
        @update:model-value="
          draft.start_date = valueToDate(
            $event instanceof Date ? $event : undefined
          )
        "
      />
      <MoleculeDatePicker
        label="Target selesai (opsional)"
        placeholder="Pilih target selesai"
        :model-value="dateToValue(draft.deadline)"
        :min-date="draft.start_date || undefined"
        :error="errors.deadline"
        :disabled="disabled"
        @update:model-value="
          draft.deadline = valueToDate(
            $event instanceof Date ? $event : undefined
          )
        "
      />
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <MoleculeDropdown
        v-model="draft.availability"
        label="Ketersediaan yang diharapkan"
        :options="availabilityOptions"
        :error="errors.availability"
        :disabled="disabled"
        searchable
        required
      />
      <MoleculeDropdown
        v-model="draft.hours_per_week"
        label="Estimasi waktu kontributor per minggu"
        :options="hoursOptions"
        :error="errors.hours_per_week"
        :disabled="disabled"
        searchable
        required
      />
    </div>

    <section
      class="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 sm:p-5"
      aria-labelledby="agreement-title"
    >
      <h3 id="agreement-title" class="font-label-1 text-primary">
        Prinsip kolaborasi
      </h3>
      <p class="mt-1 font-body-3 text-secondary">
        Kolaboria membantu mempertemukan talenta. Sepakati ruang lingkup,
        komunikasi, dan pembagian kontribusi bersama tim.
      </p>
      <div class="mt-4">
        <AtomicCheckbox
          v-model="draft.collaboration_agreement"
          :label="draft.creation_mode === 'organization_initiated' ? 'Saya memahami bahwa Project Lead dan tim perlu menyepakati kolaborasi sebelum proyek berjalan.' : 'Saya memahami dan akan membangun kesepakatan kolaborasi bersama tim.'"
          :disabled="disabled"
        />
      </div>
      <p
        v-if="errors.collaboration_agreement"
        class="mt-2 font-body-3 text-danger-700"
        role="alert"
      >
        {{ errors.collaboration_agreement }}
      </p>
    </section>
  </section>
</template>
