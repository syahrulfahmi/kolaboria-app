<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CreateProjectPayload } from '~/types/project'
import { sanitizeSlug } from '~/utils/slug'
import { PROJECT_CATEGORY_OPTIONS } from '~/constants/projectCategory'

const form = defineModel<CreateProjectPayload>('form', { required: true })

const isSlugModified = ref(false)

watch(
  () => form.value.title,
  (newTitle) => {
    if (!isSlugModified.value) {
      form.value.slug = sanitizeSlug(newTitle)
    }
  }
)

const onSlugInput = (val: string) => {
  isSlugModified.value = true
  form.value.slug = sanitizeSlug(val)
}

const visibilityOptions = [
  { value: 'public', label: 'Publik' },
  { value: 'invite_only', label: 'Invite Only' }
]
</script>

<template>
  <OrganismCard
    variant="elevated"
    class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50"
  >
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="font-title-2">Informasi Dasar</h3>
      <p class="mt-1 font-paragraph-2 text-secondary">
        Berikan identitas yang jelas untuk project kolaborasimu agar talenta
        lain mudah memahaminya.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Section: Identitas Utama -->
      <div
        class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100"
      >
        <MoleculeInputField
          v-model="form.title"
          label="Judul Project"
          placeholder="Cth: Platform Edukasi Bahasa Daerah"
          hint="Gunakan judul yang singkat, jelas, dan mendeskripsikan inti project."
          required
        />

        <div class="flex flex-col gap-1.5">
          <MoleculeInputField
            :model-value="form.slug"
            @update:model-value="onSlugInput"
            label="Slug URL Project"
            placeholder="cth: platform-edukasi-bahasa-daerah"
            hint="Hanya huruf kecil, angka, dan tanda hubung (-)."
            required
          />
          <span class="font-label-2">
            Preview URL:
            <span class="font-label-2">
              kolaboria.com/projects/{{ form.slug || '***' }}
            </span>
          </span>
        </div>

        <MoleculeTextarea
          v-model="form.summary"
          label="Ringkasan Singkat"
          placeholder="Jelaskan secara singkat apa tujuan atau masalah yang ingin diselesaikan oleh proyek ini?"
          :rows="6"
          max-length="200"
          show-counter
          required
          hint="Akan ditampilkan di halaman pencarian project."
        />
      </div>

      <!-- Section: Kategori & Visibilitas -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MoleculeDropdown
          v-model="form.project_category"
          label="Kategori Project"
          :options="[...PROJECT_CATEGORY_OPTIONS]"
          hint="Kategori membantu sistem merekomendasikan project ke talenta yang tepat."
        />

        <MoleculeDropdown
          v-model="form.visibility"
          label="Visibilitas"
          :options="visibilityOptions"
          :hint="
            form.visibility === 'public'
              ? 'Project dapat dilihat oleh semua orang di Kolaboria.'
              : 'Hanya orang yang kamu undang yang bisa melihat project ini.'
          "
        />
      </div>
    </div>
  </OrganismCard>
</template>
