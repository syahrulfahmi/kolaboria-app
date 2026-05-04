<script setup lang="ts">
import type { ProjectStatus } from '../../types/project'

const props = defineProps<{
  status: ProjectStatus
  size?: 'sm' | 'md'
}>()

const config: Record<ProjectStatus, { label: string; classes: string }> = {
  draft: {
    label: 'Draft',
    classes: 'bg-neutral-100 text-neutral-600 ring-neutral-200'
  },
  open: {
    label: 'Open',
    classes: 'bg-success-50 text-success-700 ring-success-200'
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-primary-50 text-primary-700 ring-primary-200'
  },
  completed: {
    label: 'Selesai',
    classes: 'bg-secondary-50 text-secondary-700 ring-secondary-200'
  },
  archived: {
    label: 'Diarsipkan',
    classes: 'bg-neutral-50 text-neutral-500 ring-neutral-200'
  }
}

const badge = computed(() => config[props.status] ?? config.draft)
const sizeClass = computed(() =>
  props.size === 'sm'
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-2.5 py-1 text-caption'
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-semibold ring-1 ring-inset',
      badge.classes,
      sizeClass
    ]"
  >
    <span
      v-if="status === 'open'"
      class="mr-1.5 h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse"
    />
    {{ badge.label }}
  </span>
</template>
