<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

const form = defineModel<CreateProjectPayload>('form', { required: true })
const emit = defineEmits<{ (e: 'save'): void }>()

const typeOptions = [
  { value: 'web_app', label: 'Web App' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'ui_ux', label: 'UI/UX Design' },
  { value: 'backend', label: 'Backend' },
  { value: 'data_analytics', label: 'Data & Analytics' },
  { value: 'devops', label: 'DevOps' },
  { value: 'other', label: 'Lainnya' }
]

const visibilityOptions = [
  { value: 'public', label: 'Publik' },
  { value: 'invite_only', label: 'Invite Only' }
]

const isValid = computed(() => {
  return form.value.title.trim().length > 0 && form.value.summary.trim().length > 0
})
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Section: Identitas Utama -->
    <div class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100">
      <MoleculeInputField
        v-model="form.title"
        label="Judul Project"
        placeholder="Cth: Platform Edukasi Bahasa Daerah"
        hint="Gunakan judul yang singkat, jelas, dan mendeskripsikan inti project."
        required
      />

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
          Ringkasan Singkat <span class="text-primary-400 text-base leading-none">*</span>
        </label>
        <textarea
          v-model="form.summary"
          rows="3"
          placeholder="Deskripsikan project dalam 1-2 kalimat. Apa masalah yang dipecahkan?"
          class="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none hover:border-primary-300 shadow-sm"
        />
        <span class="text-caption text-neutral-500">Akan ditampilkan di halaman pencarian project.</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
          Deskripsi Lengkap
        </label>
        <textarea
          v-model="form.description"
          rows="5"
          placeholder="Jelaskan lebih detail tentang latar belakang, tujuan, dan ruang lingkup project ini..."
          class="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none hover:border-primary-300 shadow-sm"
        />
      </div>
    </div>

    <!-- Section: Kategori & Visibilitas -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <MoleculeDropdown
          v-model="form.type"
          label="Kategori Project"
          :options="typeOptions"
        />
      </div>
      
      <div class="flex flex-col gap-2">
        <MoleculeDropdown
          v-model="form.visibility"
          label="Visibilitas"
          :options="visibilityOptions"
        />
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end pt-4 border-t border-neutral-100">
      <AtomicButton
        variant="primary"
        :disabled="!isValid"
        @click="emit('save')"
      >
        Simpan Perubahan
      </AtomicButton>
    </div>
  </div>
</template>
