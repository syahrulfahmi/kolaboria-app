<script setup lang="ts">
import type { MyProjectSummaryResponse } from '~/types/project-editor'
import { getProjectCategoryLabel } from '~/constants/projectCategory'

const props = defineProps<{
  project: MyProjectSummaryResponse
  currentUserId: string
}>()

const canEdit = computed(() => props.project.my_scope === 'initiated' || props.project.owner_id === props.currentUserId)
const statusLabel = computed(() => ({
  draft: 'Draft',
  open: 'Terbuka',
  awaiting_owner: 'Menunggu Project Lead',
  in_progress: 'Sedang berjalan',
  completed: 'Selesai',
  archived: 'Diarsipkan'
}[props.project.status]))
const attribution = computed(() => props.project.owner_id
  ? 'Proyek milikmu'
  : props.project.initiator_organization_id
    ? 'Proyek yang diinisiasi organisasi'
    : 'Owner belum ditetapkan')
</script>

<template>
  <article class="flex h-full flex-col justify-between gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
    <div>
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <AtomicTag variant="default">{{ statusLabel }}</AtomicTag>
        <span class="text-xs font-medium text-secondary">{{ getProjectCategoryLabel(project.project_category) }}</span>
      </div>
      <NuxtLink :to="`/projects/${project.slug}`" class="font-title-3 font-bold text-secondary-900 hover:text-primary-700">
        {{ project.title }}
      </NuxtLink>
      <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-secondary">{{ project.summary }}</p>
      <p class="mt-3 text-xs font-medium text-neutral-500">{{ attribution }}</p>
      <div v-if="project.skills.length || project.tools.length" class="mt-4 flex flex-wrap gap-2">
        <AtomicTagCategory v-for="item in [...project.skills, ...project.tools].slice(0, 5)" :key="item.id" variant="default">
          {{ item.name }}
        </AtomicTagCategory>
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-xs text-neutral-600">
      <span>{{ project.filled_capacity }} dari {{ project.total_capacity }} slot terisi</span>
      <span>± {{ project.hours_per_week }} jam/minggu</span>
    </div>
    <div class="flex gap-2">
      <NuxtLink :to="`/projects/${project.slug}`" class="flex-1">
        <AtomicButton variant="outline" class="w-full">Lihat detail</AtomicButton>
      </NuxtLink>
      <NuxtLink v-if="canEdit" :to="`/projects/${project.slug}/edit`" class="flex-1">
        <AtomicButton variant="primary" class="w-full">Edit</AtomicButton>
      </NuxtLink>
    </div>
  </article>
</template>
