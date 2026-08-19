<script setup lang="ts">
import type { WorkspaceOverview as WorkspaceOverviewData } from '../../types/workspace'

const props = defineProps<{
  overview: WorkspaceOverviewData | null
  compact?: boolean
}>()

defineEmits<{
  'scroll-to-board': []
}>()

const stats = computed(() => [
  {
    label: 'Total task',
    value: props.overview?.totalTasks ?? 0,
    class: 'text-secondary-900 bg-secondary-50 border-secondary-100'
  },
  {
    label: 'Selesai',
    value: props.overview?.completedTasks ?? 0,
    class: 'text-success-700 bg-success-50 border-success-200'
  },
  {
    label: 'In progress',
    value: props.overview?.inProgressTasks ?? 0,
    class: 'text-primary-700 bg-primary-50 border-primary-200'
  },
  {
    label: 'Overdue',
    value: props.overview?.overdueTasks ?? 0,
    class: 'text-danger-700 bg-danger-50 border-danger-200'
  },
  {
    label: 'Anggota',
    value: props.overview?.memberCount ?? 0,
    class: 'text-accent-800 bg-accent-50 border-accent-200'
  }
])
</script>

<template>
  <div v-if="compact" class="space-y-4">
    <div>
      <p class="font-label-1 uppercase tracking-wide text-neutral-500">Ringkasan progress</p>
      <p class="mt-1 font-body-2 text-neutral-600">Status kerja project saat ini.</p>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="stat in stats" :key="stat.label" class="rounded-lg border p-3" :class="stat.class">
        <p class="font-label-2 uppercase tracking-wide opacity-80">{{ stat.label }}</p>
        <p class="mt-1 font-title-3">{{ stat.value }}</p>
      </div>
    </div>
  </div>

  <OrganismCard v-else variant="outlined" padding="md">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-caption text-body uppercase text-neutral-500">Workspace Overview</p>
          <h2 class="mt-1 text-title text-secondary-900">Progress kerja dalam satu papan</h2>
        </div>
        <AtomicButton variant="primary" @click="$emit('scroll-to-board')">Open Board</AtomicButton>
      </div>
    </template>

    <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="stat in stats" :key="stat.label" class="rounded-lg border p-4" :class="stat.class">
        <p class="text-caption text-body uppercase">{{ stat.label }}</p>
        <p class="mt-2 text-heading">{{ stat.value }}</p>
      </div>
    </div>
  </OrganismCard>
</template>
