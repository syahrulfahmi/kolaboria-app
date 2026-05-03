<script setup lang="ts">
import type { Project } from '../../types/project'

const props = defineProps<{
  project: Project
  pendingApplicantsCount?: number
}>()

const openSlots = computed(() => {
  const memberCount =
    props.project.project_members?.filter((m) => m.role === 'contributor')
      .length ?? 0
  return Math.max(0, props.project.max_slots - memberCount)
})

const memberCount = computed(() => {
  return (
    props.project.project_members?.filter((m) => m.role === 'contributor')
      .length ?? 0
  )
})

const isFull = computed(() => memberCount.value >= props.project.max_slots)

const skills = computed(
  () =>
    props.project.project_skills?.map((ps) => ps.skill_tags.name).slice(0, 3) ??
    []
)

const extraSkillCount = computed(() => {
  const total = props.project.project_skills?.length ?? 0
  return total > 3 ? total - 3 : 0
})

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
  <div
    class="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-md hover:shadow-primary-900/5 sm:p-6"
  >
    <!-- Header -->
    <div>
      <div class="mb-4 flex items-center justify-between gap-3">
        <ProjectStatusBadge :status="project.status" size="sm" />
        <span class="text-caption font-semibold uppercase text-neutral-400">
          {{ typeLabel[project.type] ?? 'Lainnya' }}
        </span>
      </div>

      <NuxtLink
        :to="`/projects/${project.slug}`"
        class="text-title text-secondary-900 transition-colors hover:text-primary-700 line-clamp-2"
      >
        {{ project.title }}
      </NuxtLink>

      <p class="mt-2 text-body text-neutral-600 line-clamp-2">
        {{ project.summary }}
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

    <!-- Progress & Footer -->
    <div class="mt-6 border-t border-neutral-100 pt-5">
      <div class="mb-5 grid grid-cols-2 gap-4">
        <!-- Applicants Count -->
        <div class="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p
            class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400"
          >
            Pelamar Baru
          </p>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span
              class="text-xl font-bold"
              :class="
                pendingApplicantsCount && pendingApplicantsCount > 0
                  ? 'text-primary-600'
                  : 'text-secondary-900'
              "
            >
              {{ pendingApplicantsCount || 0 }}
            </span>
            <span class="text-caption font-medium text-neutral-500">Orang</span>
          </div>
        </div>

        <!-- Slot Progress -->
        <div class="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p
            class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400"
          >
            Slot Terisi
          </p>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span
              class="text-xl font-bold"
              :class="isFull ? 'text-success-600' : 'text-secondary-900'"
            >
              {{ memberCount }}
            </span>
            <span class="text-caption font-medium text-neutral-500"
              >/ {{ project.max_slots }}</span
            >
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center justify-between gap-3">
        <NuxtLink
          :to="`/projects/${project.slug}/applicants`"
          class="flex-1 justify-center w-full"
        >
          <AtomicButton variant="primary" class="w-full">
            Kelola Pelamar
          </AtomicButton>
        </NuxtLink>

        <NuxtLink
          :to="`/projects/${project.slug}`"
          class="flex-1 justify-center"
        >
          <AtomicButton variant="outline" class="w-full">
            Lihat Detail
          </AtomicButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
