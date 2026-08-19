<script setup lang="ts">
defineProps<{
  projects: any[]
  isOwner: boolean
  username: string
}>()
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-label-1 flex items-center gap-2">
        <svg
          class="w-6 h-6 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Karya Unggulan
      </h3>
      <NuxtLink
        v-if="projects && projects.length > 0 && isOwner"
        to="/profile/me/edit/portfolio"
        class="font-label-2 text-primary-600 hover:text-primary-800 transition-colors"
        >Lihat Semua</NuxtLink
      >
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      <!-- Project Card -->
      <NuxtLink
        v-for="project in projects"
        :key="project.id"
        :to="project.slug ? `/projects/${project.slug}` : '#'"
        class="p-5 rounded-xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100/70 hover:border-neutral-200 transition-all duration-300 cursor-pointer group flex flex-col"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 text-2xl"
          >
            🚀
          </div>
        </div>

        <h4
          class="font-body-1 mb-2 group-hover:text-primary-600 transition-colors"
        >
          {{ project.title }}
        </h4>
        <p class="font-paragraph-2 text-secondary mb-6 flex-1 line-clamp-3">
          {{ project.description || 'Tidak ada deskripsi.' }}
        </p>
      </NuxtLink>

      <!-- Empty State -->
      <div
        v-if="!projects || projects.length === 0"
        class="col-span-1 sm:col-span-2 p-6 rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-center hover:bg-neutral-50 transition-colors min-h-[220px]"
      >
        <div
          class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h4 class="font-body-1">Belum Ada Karya Unggulan</h4>
        <p class="font-paragraph-2 text-secondary mt-1 max-w-sm">
          {{
            isOwner
              ? 'Kamu belum memilih karya unggulan apapun untuk ditampilkan di profil.'
              : 'User ini belum menambahkan karya unggulan.'
          }}
        </p>
        <NuxtLink to="/profile/me/edit/portfolio" v-if="isOwner">
          <AtomicButton variant="ghost-primary" class="mt-4">
            Jelajahi Project Selesai
          </AtomicButton>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
