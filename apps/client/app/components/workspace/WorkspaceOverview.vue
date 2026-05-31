<script setup lang="ts">
import type { WorkspaceOverview } from '../../types/workspace'

const props = defineProps<{
  overview: WorkspaceOverview | null
}>()

defineEmits<{
  'scroll-to-board': []
}>()

const stats = computed(() => [
  {
    label: 'Total Tasks',
    value: props.overview?.totalTasks ?? 0,
    class: 'text-secondary-900 bg-secondary-50 border-secondary-100'
  },
  {
    label: 'Done',
    value: props.overview?.completedTasks ?? 0,
    class: 'text-success-700 bg-success-50 border-success-200'
  },
  {
    label: 'In Progress',
    value: props.overview?.inProgressTasks ?? 0,
    class: 'text-primary-700 bg-primary-50 border-primary-200'
  },
  {
    label: 'Overdue',
    value: props.overview?.overdueTasks ?? 0,
    class: 'text-danger-500 bg-danger-50 border-danger-200'
  },
  {
    label: 'Members',
    value: props.overview?.memberCount ?? 0,
    class: 'text-accent-700 bg-accent-50 border-accent-200'
  }
])
</script>

<template>
  <OrganismCard variant="outlined" padding="md">
    <div
      class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <p class="text-caption font-semibold uppercase text-neutral-500">
          Workspace Overview
        </p>
        <h2 class="mt-2 text-heading text-secondary-900">
          Progress kerja dalam satu papan
        </h2>
      </div>

      <AtomicButton variant="primary" @click="$emit('scroll-to-board')">
        Open Board
      </AtomicButton>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-lg border p-4"
        :class="stat.class"
      >
        <p class="text-caption font-semibold uppercase">{{ stat.label }}</p>
        <p class="mt-2 text-heading">{{ stat.value }}</p>
      </div>
    </div>
  </OrganismCard>
</template>
