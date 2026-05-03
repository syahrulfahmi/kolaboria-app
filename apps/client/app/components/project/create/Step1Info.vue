<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

const form = defineModel<CreateProjectPayload>('form', { required: true })

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
</script>

<template>
  <OrganismCard variant="elevated" class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50">
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="text-title text-secondary-900">1. Informasi Dasar</h3>
      <p class="mt-1.5 text-body text-neutral-500">Berikan identitas yang jelas untuk project kolaborasimu agar talenta lain mudah memahaminya.</p>
    </div>

    <div class="space-y-8">
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
      </div>

      <!-- Section: Kategori & Visibilitas -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <MoleculeDropdown
            v-model="form.type"
            label="Kategori Project"
            :options="typeOptions"
          />
          <span class="text-[13px] text-neutral-500">Kategori membantu sistem merekomendasikan project ke talenta yang tepat.</span>
        </div>
        
        <div class="flex flex-col gap-2">
          <MoleculeDropdown
            v-model="form.visibility"
            label="Visibilitas"
            :options="visibilityOptions"
          />
          <span class="text-[13px] text-neutral-500">
            <template v-if="form.visibility === 'public'">Project dapat dilihat oleh semua orang di Kolaboria.</template>
            <template v-else>Hanya orang yang kamu undang yang bisa melihat project ini.</template>
          </span>
        </div>
      </div>
    </div>
  </OrganismCard>
</template>
