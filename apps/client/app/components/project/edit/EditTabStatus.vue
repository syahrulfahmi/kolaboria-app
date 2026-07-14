<script setup lang="ts">
import type { ProjectStatus } from '~/types/project'

const props = defineProps<{
  status: ProjectStatus
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'action', action: 'open' | 'archived' | 'completed' | 'in_progress'): void
}>()

const formatStatusLabel = (s: ProjectStatus) => {
  switch (s) {
    case 'draft':
      return 'Draft'
    case 'open':
      return 'Membuka Lowongan'
    case 'in_progress':
      return 'Sedang Berjalan'
    case 'completed':
      return 'Selesai'
    case 'archived':
      return 'Diarsipkan'
    default:
      return s
  }
}

const getStatusDescription = (s: ProjectStatus) => {
  switch (s) {
    case 'draft':
      return 'Project ini belum dipublikasikan. Hanya kamu (pemilik) yang dapat melihat dan mengubah project ini.'
    case 'open':
      return 'Project ini aktif dan sedang membuka lowongan. Talenta lain dapat menemukan dan mengirim lamaran.'
    case 'in_progress':
      return 'Project ini sedang berjalan dengan tim yang terpilih. Pendaftaran ditutup untuk umum.'
    case 'completed':
      return 'Project telah berhasil diselesaikan. Riwayat kontribusi akan tercatat secara permanen.'
    case 'archived':
      return 'Project telah diarsipkan. Halaman ini bersifat hanya-baca dan tidak dapat diaktifkan kembali.'
    default:
      return ''
  }
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- ─── Status Context Banner ─── -->
    <div
      class="rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300"
      :class="[
        status === 'draft'
          ? 'bg-neutral-50/70 border-neutral-200 text-neutral-900'
          : '',
        status === 'open'
          ? 'bg-primary-50 border-primary-100 text-primary-900'
          : '',
        status === 'in_progress'
          ? 'bg-accent-50 border-accent-100 text-accent-900'
          : '',
        status === 'completed'
          ? 'bg-success-50 border-success-100 text-success-900'
          : '',
        status === 'archived'
          ? 'bg-neutral-50 border-neutral-200 text-neutral-400'
          : ''
      ]"
    >
      <div
        class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-neutral-100"
        :class="[
          status === 'draft' ? 'text-neutral-500' : '',
          status === 'open' ? 'text-primary-500' : '',
          status === 'in_progress' ? 'text-accent-500' : '',
          status === 'completed' ? 'text-success-500' : '',
          status === 'archived' ? 'text-neutral-400' : ''
        ]"
      >
        <!-- Icon based on status -->
        <svg
          v-if="status === 'draft'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>

        <svg
          v-else-if="status === 'open'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.583 1.828l-3.97 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.888a1 1 0 00-1.175 0l-3.97 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.888c-.777-.576-.38-1.828.582-1.828h4.908a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>

        <svg
          v-else-if="status === 'in_progress'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg
          v-else-if="status === 'completed'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg
          v-else-if="status === 'archived'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </div>

      <div class="space-y-1">
        <span
          class="font-label-3 text-secondary uppercase tracking-widest block"
          >Status Saat Ini</span
        >
        <h3 class="font-title-3 text-primary capitalize">
          {{ formatStatusLabel(status) }}
        </h3>
        <p class="font-paragraph-3 text-secondary">
          {{ getStatusDescription(status) }}
        </p>
      </div>
    </div>

    <!-- ─── Action Cards ─── -->
    <div class="space-y-5">
      <!-- Publish Action (Only for Draft) -->
      <div
        v-if="status === 'draft'"
        class="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-title-3 text-primary">Publikasikan Project</h4>
              <p class="mt-1 font-paragraph-3 text-secondary">
                Project kamu masih Draft. Publikasikan sekarang agar talenta
                lain bisa melihat dan melamar project ini.
              </p>
            </div>
          </div>
          <AtomicButton
            variant="primary"
            :disabled="isSubmitting"
            @click="emit('action', 'open')"
            class="w-full sm:w-auto self-stretch sm:self-center"
          >
            Publikasikan Sekarang
          </AtomicButton>
        </div>
      </div>

      <!-- In Progress Action (Only for Open) -->
      <div
        v-if="status === 'open'"
        class="group relative rounded-2xl border border-neutral-200 bg-white hover:border-accent-300 p-6 transition-all duration-300 hover:shadow-md"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-accent-50 text-accent-500 group-hover:bg-accent-100 group-hover:text-accent-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-title-3 text-primary">Tandai Sedang Berjalan</h4>
              <p class="mt-1 font-paragraph-3 text-secondary">
                Jika tim sudah terbentuk, ubah status project menjadi Sedang
                Berjalan. Project akan ditutup untuk pelamar baru.
              </p>
            </div>
          </div>
          <AtomicButton
            variant="secondary"
            :disabled="isSubmitting"
            @click="emit('action', 'in_progress')"
            class="w-full sm:w-auto self-stretch sm:self-center"
          >
            Tandai Sedang Berjalan
          </AtomicButton>
        </div>
      </div>

      <!-- Complete Action (Only for In Progress) -->
      <div
        v-if="status === 'in_progress'"
        class="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-success-50 text-success-500 group-hover:bg-success-100 group-hover:text-success-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-title-3 text-primary">Tandai Selesai</h4>
              <p class="mt-1 font-paragraph-3 text-secondary">
                Project sudah mencapai tujuannya? Tandai sebagai selesai untuk
                menutup project ini.
              </p>
            </div>
          </div>
          <AtomicButton
            variant="primary"
            :disabled="isSubmitting"
            @click="emit('action', 'completed')"
            class="w-full sm:w-auto self-stretch sm:self-center"
          >
            Tandai Selesai
          </AtomicButton>
        </div>
      </div>
    </div>

    <!-- ─── Danger Zone (For active projects that are not archived) ─── -->
    <div
      v-if="status !== 'archived'"
      class="mt-10 pt-6 border-t border-neutral-200"
    >
      <div class="flex items-center gap-2 mb-4">
        <span class="w-1.5 h-4 bg-danger-500 rounded-full"></span>
        <h4 class="font-title-3 text-danger-600">Tindakan Berisiko</h4>
      </div>

      <div
        class="group relative rounded-2xl border border-danger-100 bg-danger-50/10 p-6 transition-all duration-300"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-danger-50 text-danger-500 group-hover:bg-danger-100 group-hover:text-danger-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-title-3 text-danger-900">Arsipkan Project</h4>
              <p class="mt-1 font-paragraph-3 text-danger-700/80">
                Sembunyikan project ini dari pencarian publik. Jika ada pelamar
                aktif, status lamaran mereka akan otomatis dibatalkan. Tindakan
                ini bersifat permanen.
              </p>
            </div>
          </div>
          <AtomicButton
            variant="danger"
            :disabled="isSubmitting"
            @click="emit('action', 'archived')"
            class="w-full sm:w-auto self-stretch sm:self-center"
          >
            Arsipkan Project
          </AtomicButton>
        </div>
      </div>
    </div>

    <!-- ─── Archived State ─── -->
    <div
      v-if="status === 'archived'"
      class="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-6"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-400 mb-4 border border-neutral-150"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </div>
      <h4 class="font-title-2 text-neutral-900">Project Telah Diarsipkan</h4>
      <p class="font-paragraph-3 text-secondary mt-2">
        Project ini telah diarsipkan dan tidak bisa diubah statusnya lagi.
        Halaman ini bersifat hanya-baca.
      </p>
    </div>
  </div>
</template>
