<script setup lang="ts">
import type { Project } from '../../types/project'

const props = defineProps<{
  project: Project
}>()

const openSlots = computed(() => {
  const memberCount = props.project.project_members?.filter(m => m.role === 'contributor').length ?? 0
  return Math.max(0, props.project.max_slots - memberCount)
})

const skills = computed(() =>
  props.project.project_skills?.map(ps => ps.skill_tags.name).slice(0, 3) ?? []
)

const extraSkillCount = computed(() => {
  const total = props.project.project_skills?.length ?? 0
  return total > 3 ? total - 3 : 0
})

const isNew = computed(() => {
  if (!props.project.published_at) return false
  const diff = Date.now() - new Date(props.project.published_at).getTime()
  return diff < 3 * 24 * 60 * 60 * 1000 // < 3 hari
})

const formattedDeadline = computed(() => {
  if (!props.project.deadline) return null
  return new Date(props.project.deadline).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
})

const creatorName = computed(() =>
  props.project.profiles?.full_name ||
  props.project.profiles?.username ||
  'Anonim'
)

const typeLabel: Record<string, string> = {
  web_app: 'Web App',
  mobile_app: 'Mobile App',
  ui_ux: 'UI/UX',
  backend: 'Backend',
  data_analytics: 'Data & Analytics',
  devops: 'DevOps',
  other: 'Lainnya'
}
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-md hover:shadow-primary-900/5 sm:p-6"
  >
    <!-- Header -->
    <div>
      <div class="mb-4 flex items-center justify-between gap-3">
        <ProjectStatusBadge :status="project.status" size="sm" />
        <span v-if="isNew" class="text-caption font-semibold text-success-600">✦ Baru</span>
        <span v-else class="text-caption font-semibold uppercase text-neutral-400">
          {{ typeLabel[project.type] ?? 'Lainnya' }}
        </span>
      </div>

      <h3 class="text-title text-secondary-900 transition-colors group-hover:text-primary-700 line-clamp-2">
        {{ project.title }}
      </h3>

      <p class="mt-1 text-body text-neutral-600 line-clamp-2">
        {{ project.summary }}
      </p>

      <p class="mt-2 text-caption text-neutral-500">
        Oleh <span class="font-medium text-secondary-900">{{ creatorName }}</span>
      </p>

      <!-- Skills -->
      <div v-if="skills.length > 0" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="skill in skills"
          :key="skill"
          class="rounded-md bg-neutral-50 px-2 py-1 text-caption text-neutral-600 ring-1 ring-inset ring-neutral-200"
        >
          {{ skill }}
        </span>
        <span
          v-if="extraSkillCount > 0"
          class="rounded-md bg-neutral-50 px-2 py-1 text-caption text-neutral-500 ring-1 ring-inset ring-neutral-200"
        >
          +{{ extraSkillCount }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 text-caption text-neutral-600">
          <svg class="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ openSlots }} slot</span>
        </div>
        <span v-if="formattedDeadline" class="flex items-center gap-1.5 text-caption text-neutral-500">
          <svg class="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDeadline }}
        </span>
      </div>
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>
