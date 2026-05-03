<script setup lang="ts">
const props = defineProps<{
  isVerified: boolean
  completionScore: number
  username: string
}>()

defineEmits<{
  resend: []
}>()
</script>

<template>
  <div
    class="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
  >
    <div class="px-6 py-5">
      <h3 class="text-title font-semibold text-secondary-900">
        Pintasan Cepat
      </h3>
      <p class="mt-1 text-caption text-neutral-500">
        Aksi yang paling sering dicari.
      </p>
    </div>

    <div class="flex flex-col border-t border-neutral-100 bg-neutral-50/30">
      <!-- Jelajahi Project -->
      <NuxtLink
        to="/projects"
        class="group flex items-center gap-4 border-b border-neutral-100 px-6 py-4 transition-colors hover:bg-neutral-50"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-200/50"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <p
            class="text-sm font-semibold text-secondary-900 transition-colors group-hover:text-primary-700"
          >
            Jelajahi Project Open
          </p>
          <p class="text-caption text-neutral-500">
            Temukan kolaborasi yang tepat
          </p>
        </div>
        <svg
          class="h-4 w-4 text-neutral-400 opacity-0 transition-all group-hover:-translate-x-1 group-hover:text-primary-600 group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </NuxtLink>

      <!-- Lihat Profil Publik -->
      <NuxtLink
        :to="`/profile/${username}`"
        class="group flex items-center gap-4 border-b border-neutral-100 px-6 py-4 transition-colors hover:bg-neutral-50"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-50 text-success-600 ring-1 ring-inset ring-success-200/50"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <p
            class="text-sm font-semibold text-secondary-900 transition-colors group-hover:text-primary-700"
          >
            Lihat Profil Publik
          </p>
          <p class="text-caption text-neutral-500">
            Cek tampilan profilmu di mata orang lain
          </p>
        </div>
        <svg
          class="h-4 w-4 text-neutral-400 opacity-0 transition-all group-hover:-translate-x-1 group-hover:text-primary-600 group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </NuxtLink>

      <!-- Buat Project (Segera Hadir) -->
      <div
        class="flex items-center gap-4 px-6 py-4 opacity-60 grayscale transition-opacity hover:opacity-80 hover:grayscale-0"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-200/50"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-neutral-700">
              Buat Project Baru
            </p>
            <span
              class="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600"
              >Soon</span
            >
          </div>
          <p class="text-caption text-neutral-500">
            Mulai kolaborasimu sendiri
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
