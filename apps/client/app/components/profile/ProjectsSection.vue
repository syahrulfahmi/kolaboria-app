<script setup lang="ts">
import type { FeaturedProject } from '../../types/profile-page'

defineProps<{
  projects: FeaturedProject[]
  isOwner: boolean
}>()
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
    <div class="mb-6 flex items-center">
      <h3 class="font-label-1 flex items-center gap-2">
        <Icon name="lucide:layout-grid" class="w-6 h-6 text-primary-600" aria-hidden="true" />
        Karya Unggulan
      </h3>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      <NuxtLink v-for="project in projects" :key="project.id" :to="'/projects/' + project.slug" class="p-5 rounded-xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100/70 hover:border-neutral-200 transition-all duration-300 cursor-pointer group flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            <Icon name="lucide:link-2" class="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        <h4 class="font-body-1 mb-2 group-hover:text-primary-600 transition-colors">{{ project.title }}</h4>
        <p class="font-paragraph-2 text-secondary mb-6 flex-1 line-clamp-3">{{ project.description || 'Tidak ada deskripsi.' }}</p>
        <span class="text-xs font-semibold uppercase tracking-wide text-primary-700">{{ project.category }}</span>
      </NuxtLink>

      <div v-if="!projects || projects.length === 0" class="col-span-1 sm:col-span-2 p-6 rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-center hover:bg-neutral-50 transition-colors min-h-[220px]">
        <div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
          <Icon name="lucide:plus" class="w-6 h-6" aria-hidden="true" />
        </div>
        <h4 class="font-body-1">Belum Ada Karya Unggulan</h4>
        <p class="font-paragraph-2 text-secondary mt-1 max-w-sm">
          {{ isOwner
            ? 'Kamu belum memiliki karya unggulan untuk ditampilkan di profil.'
            : 'User ini belum menambahkan karya unggulan.' }}
        </p>
      </div>
    </div>
  </section>
</template>
