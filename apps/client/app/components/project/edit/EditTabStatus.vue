<script setup lang="ts">
import type { ProjectStatus } from "~/types/project";

const props = defineProps<{
  status: ProjectStatus;
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  (
    e: "action",
    action: "open" | "archived" | "completed" | "in_progress",
  ): void;
}>();
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Publish Action (Only for Draft) -->
    <div
      v-if="status === 'draft'"
      class="rounded-2xl border border-primary-100 bg-primary-50 p-6"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h4 class="text-base font-bold text-primary-900">
            Publikasikan Project
          </h4>
          <p class="mt-1 text-sm text-primary-700">
            Project kamu masih Draft. Publikasikan sekarang agar talenta lain
            bisa melihat dan melamar project ini.
          </p>
        </div>
        <AtomicButton
          variant="primary"
          :disabled="isSubmitting"
          @click="emit('action', 'open')"
          class="whitespace-nowrap"
        >
          Publikasikan Sekarang
        </AtomicButton>
      </div>
    </div>

    <!-- In Progress Action (Only for Open) -->
    <div
      v-if="status === 'open'"
      class="rounded-2xl border border-accent-200 bg-accent-50 p-6"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h4 class="text-base font-bold text-accent-900">
            Tandai Sedang Berjalan
          </h4>
          <p class="mt-1 text-sm text-accent-700">
            Jika tim sudah terbentuk, ubah status project menjadi Sedang
            Berjalan. Project akan ditutup untuk pelamar baru.
          </p>
        </div>
        <AtomicButton
          variant="primary"
          :disabled="isSubmitting"
          @click="emit('action', 'in_progress')"
          class="whitespace-nowrap bg-accent-500 hover:bg-accent-600 border-accent-500 text-white"
        >
          Tandai Sedang Berjalan
        </AtomicButton>
      </div>
    </div>

    <!-- Complete Action (Only for In Progress) -->
    <div
      v-if="status === 'in_progress'"
      class="rounded-2xl border border-success-200 bg-success-50 p-6"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h4 class="text-base font-bold text-success-900">Tandai Selesai</h4>
          <p class="mt-1 text-sm text-success-700">
            Project sudah mencapai tujuannya? Tandai sebagai selesai untuk
            menutup project ini.
          </p>
        </div>
        <AtomicButton
          variant="primary"
          :disabled="isSubmitting"
          @click="emit('action', 'completed')"
          class="whitespace-nowrap bg-success-600 hover:bg-success-700 border-success-600"
        >
          Tandai Selesai
        </AtomicButton>
      </div>
    </div>

    <!-- Archive Action (For any active status except archived) -->
    <div
      v-if="status !== 'archived'"
      class="rounded-2xl border border-danger-100 bg-danger-50/50 p-6 mt-8"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h4 class="text-base font-bold text-danger-900">Arsipkan Project</h4>
          <p class="mt-1 text-sm text-danger-700">
            Sembunyikan project ini. Jika ada pelamar aktif, status lamaran
            mereka akan dibatalkan.
          </p>
        </div>
        <AtomicButton
          variant="danger"
          :disabled="isSubmitting"
          @click="emit('action', 'archived')"
          class="whitespace-nowrap"
        >
          Arsipkan Project
        </AtomicButton>
      </div>
    </div>

    <div
      v-if="status === 'archived'"
      class="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center"
    >
      <p class="text-sm font-medium text-neutral-600">
        Project ini telah diarsipkan dan tidak bisa diubah statusnya lagi.
      </p>
    </div>
  </div>
</template>
