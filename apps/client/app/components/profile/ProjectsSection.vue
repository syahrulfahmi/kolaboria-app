<script setup lang="ts">
import type { FeaturedProject } from '../../types/profile-page'

defineProps<{
  projects: FeaturedProject[]
  isOwner: boolean
}>()
</script>

<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs md:p-8">
    <header class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h3 class="flex items-center gap-2 font-label-1 text-secondary-900">
          <Icon name="lucide:layout-grid" class="h-5 w-5 text-primary-600" aria-hidden="true" />
          Karya Unggulan
        </h3>
        <p class="mt-1 font-body-3 text-secondary">Pilihan karya dan kontribusi yang ditampilkan di profil.</p>
      </div>
      <span class="shrink-0 rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800">
        Data contoh
      </span>
    </header>

    <div v-if="projects.length" class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <article
        v-for="(project, index) in projects"
        :key="project.id"
        class="group flex min-h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow duration-200 hover:shadow-md"
      >
        <div
          class="relative flex min-h-40 items-end overflow-hidden p-5 sm:min-h-44"
          :class="index % 2 === 0 ? 'bg-primary-50' : 'bg-secondary-50'"
        >
          <div class="absolute -right-7 -top-10 h-36 w-36 rounded-full border-[20px] border-white/55" aria-hidden="true" />
          <div class="absolute right-12 top-8 h-16 w-16 rounded-2xl border border-white/80 bg-white/35 rotate-12" aria-hidden="true" />
          <div class="relative flex w-full items-end justify-between gap-4">
            <span class="inline-flex max-w-[75%] items-center gap-2 rounded-lg border border-white/80 bg-white/90 px-3 py-2 text-sm font-semibold text-secondary-900 shadow-xs">
              <Icon name="lucide:layers-2" class="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
              <span class="truncate">{{ project.category }}</span>
            </span>
            <span v-if="project.year" class="shrink-0 rounded-md bg-secondary-900/85 px-2 py-1 text-xs font-medium text-white">
              {{ project.year }}
            </span>
          </div>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <h4 class="font-title-3 text-secondary-900 transition-colors group-hover:text-primary-700">
            {{ project.title }}
          </h4>
          <p class="mt-2 line-clamp-3 flex-1 font-body-3 leading-relaxed text-secondary">
            {{ project.description || 'Tidak ada deskripsi.' }}
          </p>

          <div class="mt-5 border-t border-neutral-100 pt-4">
            <p v-if="project.role" class="mb-3 flex items-center gap-2 text-sm font-medium text-secondary-800">
              <Icon name="lucide:user-round" class="h-4 w-4 text-neutral-500" aria-hidden="true" />
              {{ project.role }}
            </p>
            <div v-if="project.skills?.length" class="flex flex-wrap gap-1.5">
              <AtomicTagCategory
                v-for="skill in project.skills"
                :key="skill"
                variant="default"
              >
                {{ skill }}
              </AtomicTagCategory>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50">
      <OrganismEmptyState
        title="Belum ada karya unggulan"
        :description="isOwner
          ? 'Karya yang kamu pilih untuk ditampilkan akan muncul di sini.'
          : 'Pengguna ini belum memilih karya unggulan untuk ditampilkan.'"
        icon="folder"
      />
    </div>
  </section>
</template>
