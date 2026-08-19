<script setup lang="ts">
import type { MemberProfile, Task, TaskStatus } from '../../types/workspace'

const props = defineProps<{
  status: TaskStatus
  tasks: Task[]
  members: MemberProfile[]
  isOwner: boolean
  readOnly?: boolean
}>()

defineEmits<{
  'task-click': [task: Task]
  'task-create': [status: TaskStatus]
}>()

const statusMeta: Record<TaskStatus, { label: string; marker: string; badge: string }> = {
  todo: {
    label: 'Todo',
    marker: 'bg-neutral-400',
    badge: 'bg-neutral-100 text-neutral-700'
  },
  in_progress: {
    label: 'In Progress',
    marker: 'bg-primary-500',
    badge: 'bg-primary-50 text-primary-800'
  },
  review: {
    label: 'Review',
    marker: 'bg-accent-500',
    badge: 'bg-accent-50 text-accent-800'
  },
  done: {
    label: 'Done',
    marker: 'bg-success-500',
    badge: 'bg-success-50 text-success-800'
  }
}

const meta = computed(() => statusMeta[props.status])
</script>

<template>
  <section class="flex min-h-[28rem] w-[min(82vw,20rem)] shrink-0 flex-col rounded-xl border border-neutral-200 bg-neutral-50/80 p-3 sm:w-[20rem] lg:min-w-0 lg:flex-1" :aria-labelledby="`column-${status}`">
    <div class="mb-3 flex items-center justify-between gap-3 px-1">
      <div class="flex min-w-0 items-center gap-2">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="meta.marker" aria-hidden="true" />
        <h2 :id="`column-${status}`" class="truncate font-label-1 text-secondary-900">{{ meta.label }}</h2>
        <span class="rounded-full px-2 py-0.5 font-label-2" :class="meta.badge">{{ tasks.length }}</span>
      </div>
      <button
        v-if="isOwner && !readOnly"
        type="button"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-white hover:text-secondary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        :aria-label="`Tambah task di status ${meta.label}`"
        @click="$emit('task-create', status)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <div class="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 scrollbar-thin">
      <slot />
      <div v-if="tasks.length === 0" class="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white/60 px-4 text-center font-body-3 text-neutral-500">
        Belum ada task di status ini.
      </div>
    </div>

    <button
      v-if="isOwner && !readOnly"
      type="button"
      class="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white/60 px-3 py-2 font-label-2 text-neutral-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      @click="$emit('task-create', status)"
    >
      + Tambah task
    </button>
  </section>
</template>
