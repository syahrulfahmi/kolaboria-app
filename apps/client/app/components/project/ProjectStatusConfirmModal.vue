<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  show: boolean;
  action: "open" | "archived" | "completed" | "in_progress";
  projectTitle: string;
  hasActiveApplicants?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();

const modalContent = computed(() => {
  switch (props.action) {
    case "open":
      return {
        title: "Publikasikan Project?",
        message:
          "Project akan langsung terlihat publik dan bisa dilamar. Pastikan semua informasi sudah lengkap.",
        confirmText: "Ya, Publikasikan",
        confirmVariant: "primary" as const,
      };
    case "in_progress":
      return {
        title: "Tandai Sedang Berjalan?",
        message: "Project tidak akan menerima pelamar baru setelah ini.",
        confirmText: "Ya, Tandai Berjalan",
        confirmVariant: "primary" as const,
      };
    case "completed":
      return {
        title: "Tandai Selesai?",
        message: "Project akan ditutup. Aksi ini tidak bisa dibatalkan.",
        confirmText: "Ya, Tandai Selesai",
        confirmVariant: "primary" as const,
      };
    case "archived":
      return {
        title: "Arsipkan Project?",
        message: props.hasActiveApplicants
          ? "Project akan disembunyikan. Peringatan: Ada pelamar aktif yang lamarannya akan dibatalkan."
          : "Project akan disembunyikan dari publik. Kamu tetap bisa melihatnya di daftar project.",
        confirmText: "Ya, Arsipkan",
        confirmVariant: "danger" as const,
      };
    default:
      return {
        title: "Konfirmasi",
        message: "Apakah kamu yakin?",
        confirmText: "Konfirmasi",
        confirmVariant: "primary" as const,
      };
  }
});
</script>

<template>
  <OrganismModal :modelValue="show" @update:modelValue="emit('close')">
    <div class="text-center">
      <!-- Icon -->
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        :class="
          action === 'archived'
            ? 'bg-danger-50 text-danger-500'
            : 'bg-primary-50 text-primary-500'
        "
      >
        <svg
          v-if="action === 'open'"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else-if="action === 'archived'"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        <svg
          v-else
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 class="text-title text-secondary-900">{{ modalContent.title }}</h3>

      <p class="mt-2 text-body text-neutral-600">
        {{ modalContent.message }}
      </p>

      <div class="mt-4 rounded-lg bg-neutral-50 p-3">
        <p class="text-caption font-medium text-neutral-500 line-clamp-1">
          Project:
          <span class="font-bold text-secondary-900">{{ projectTitle }}</span>
        </p>
      </div>

      <div class="mt-8 flex items-center justify-end gap-3">
        <AtomicButton variant="outline" @click="emit('close')">
          Batal
        </AtomicButton>
        <AtomicButton
          :variant="modalContent.confirmVariant"
          @click="emit('confirm')"
        >
          {{ modalContent.confirmText }}
        </AtomicButton>
      </div>
    </div>
  </OrganismModal>
</template>
