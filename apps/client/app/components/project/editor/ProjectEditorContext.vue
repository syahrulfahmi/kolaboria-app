<script setup lang="ts">
import type {
  ProjectEditorDraft,
  ProjectEditorErrors,
  ProjectOrigin
} from '~/types/project-editor'

const props = defineProps<{
  errors: ProjectEditorErrors
  disabled: boolean
}>()
const setOrigin = (value: string | number | boolean) => {
  if (props.disabled) return

  if (
    typeof value === 'string' &&
    choices.some((choice) => choice.value === value)
  ) {
    emit('set-origin', value as ProjectOrigin)
  }
}
const emit = defineEmits<{
  (event: 'set-origin', origin: ProjectOrigin): void
}>()
const draft = defineModel<ProjectEditorDraft>('form', { required: true })

const choices: Array<{
  value: ProjectOrigin
  title: string
  description: string
}> = [
  {
    value: 'personal',
    title: 'Proyek pribadi',
    description: 'Wujudkan gagasanmu menjadi proyek nyata bersama kontributor.'
  },
  {
    value: 'community',
    title: 'Komunitas',
    description: 'Bangun solusi yang bermanfaat bagi komunitas bersama.'
  },
  {
    value: 'experiment',
    title: 'Eksperimen',
    description: 'Uji ide, belajar dari proses, dan hasilkan karya bersama.'
  },
  {
    value: 'client',
    title: 'Proyek klien',
    description: 'Penuhi kebutuhan klien secara transparan bersama kontributor.'
  }
]
</script>

<template>
  <section aria-labelledby="project-context-title" class="space-y-6 p-4 lg:p-5">
    <header>
      <span class="font-label-2 text-brand">Langkah 3 dari 5</span>
      <h2 id="project-context-title" class="mt-2 font-title-1 text-primary">
        Konteks Kolaborasi
      </h2>
      <p class="mt-2 font-paragraph-3 text-secondary">
        Jelaskan alasan proyek dibangun bersama, hasil yang diharapkan, dan
        {{ draft.creation_mode === 'organization_initiated' ? 'ekspektasi untuk Project Lead yang akan memimpin.' : 'bagaimana kamu akan terlibat sebagai Project Lead.' }}
      </p>
    </header>

    <fieldset class="space-y-5">
      <legend class="font-label-1 text-primary">Asal proyek</legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="choice in choices"
          :key="choice.value"
          class="flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors duration-200 sm:p-4"
          :class="
            draft.origin === choice.value
              ? 'border-primary-400 bg-primary-50'
              : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-neutral-50'
          "
          @click="setOrigin(choice.value)"
        >
          <AtomicRadio
            :model-value="draft.origin"
            name="project-editor-origin"
            :value="choice.value"
            :label="choice.title"
            :description="choice.description"
            :disabled="disabled"
            class="w-full min-w-0"
            @click.stop
            @update:model-value="setOrigin"
          />
        </div>
      </div>
      <p v-if="errors.origin" class="font-body-3 text-danger-700" role="alert">
        {{ errors.origin }}
      </p>
    </fieldset>

    <section
      v-if="draft.origin === 'client'"
      class="rounded-xl border border-accent-200 bg-accent-50 p-4"
      aria-labelledby="client-acknowledgement-title"
    >
      <h3
        id="client-acknowledgement-title"
        class="font-label-1 text-accent-900"
      >
        Transparansi proyek klien
      </h3>
      <p class="mt-1 font-body-3 text-accent-700">
        Jelaskan kebutuhan klien, ruang lingkup, dan bentuk kolaborasi dengan terbuka kepada calon tim.
      </p>
      <div class="mt-3">
        <AtomicCheckbox
          :model-value="draft.client_acknowledgement"
          label="Saya telah menjelaskan kebutuhan klien dan bentuk kolaborasi secara transparan."
          :disabled="disabled"
          @update:model-value="draft.client_acknowledgement = $event"
        />
        <p
          v-if="errors.client_acknowledgement"
          class="mt-2 font-body-3 text-danger-700"
          role="alert"
        >
          {{ errors.client_acknowledgement }}
        </p>
      </div>
    </section>

    <div class="space-y-5">
      <MoleculeTextarea
        id="why-collaborative"
        v-model="draft.why_collaborative"
        label="Kenapa proyek ini dibuka untuk kolaborasi?"
        placeholder="Jelaskan mengapa sudut pandang atau kontribusi dari tim dibutuhkan."
        :error="errors.why_collaborative"
        :disabled="disabled"
        :rows="4"
        required
      />
      <MoleculeTextarea
        id="contributor-outcome"
        v-model="draft.contributor_outcome"
        label="Apa yang diharapkan didapat kontributor?"
        placeholder="Jelaskan pengalaman dan hasil kerja yang ingin diwujudkan bersama."
        :error="errors.contributor_outcome"
        :disabled="disabled"
        :rows="4"
        required
      />
      <MoleculeTextarea
        v-if="draft.creation_mode === 'personal'"
        id="owner-commitment"
        v-model="draft.owner_commitment"
        label="Komitmenmu sebagai Project Lead"
        placeholder="Ceritakan bentuk keterlibatanmu selama proyek berjalan."
        :error="errors.owner_commitment"
        :disabled="disabled"
        :rows="4"
        required
      />
      <MoleculeTextarea
        v-else
        id="lead-expectations"
        v-model="draft.lead_expectations"
        label="Ekspektasi untuk Project Lead"
        placeholder="Contoh: Menentukan arah pengerjaan, menyeleksi kontributor, dan menjaga komunikasi tim."
        hint="Ini adalah ekspektasi untuk calon lead. Kamu tidak otomatis menjadi owner proyek."
        :error="errors.lead_expectations"
        :disabled="disabled"
        :rows="4"
        required
      />
    </div>
  </section>
</template>
