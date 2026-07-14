<script setup lang="ts">
import type { MemberProfile, Task, TaskStatus } from '../../types/workspace'

const props = defineProps<{
  status: TaskStatus
  tasks: Task[]
  members: MemberProfile[]
  isOwner: boolean
}>()

defineEmits<{
  'task-click': [task: Task]
  'task-create': [status: TaskStatus]
}>()

const statusMeta: Record<
  TaskStatus,
  { label: string; class: string; badgeClass: string }
> = {
  todo: {
    label: 'Todo',
    class: 'text-neutral-700',
    badgeClass: 'bg-neutral-200/80 text-neutral-600'
  },
  in_progress: {
    label: 'In Progress',
    class: 'text-neutral-700',
    badgeClass: 'bg-blue-100 text-blue-700'
  },
  review: {
    label: 'Review',
    class: 'text-neutral-700',
    badgeClass: 'bg-accent-100 text-accent-800'
  },
  done: {
    label: 'Done',
    class: 'text-neutral-700',
    badgeClass: 'bg-success-100 text-success-800'
  }
}

const meta = computed(() => statusMeta[props.status])
</script>

<template>
  <section
    class="w-full md:flex-1 md:min-w-0 bg-neutral-100/60 rounded-xl flex flex-col p-3 border border-neutral-200/40"
  >
    <!-- Column Header -->
    <div class="flex items-center justify-between mb-3.5 px-1">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-sm text-neutral-700">{{ meta.label }}</h3>
        <span
          class="text-xs px-2 py-0.5 rounded-full text-body"
          :class="meta.badgeClass"
        >
          {{ tasks.length }}
        </span>
      </div>

      <!-- Add Task Button Header Shortcut -->
      <button
        v-if="isOwner"
        class="text-neutral-400 hover:text-neutral-600 focus:outline-none transition p-1 hover:bg-neutral-200/50 rounded-md"
        @click="$emit('task-create', status)"
        title="Tambah Tugas"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>

    <!-- Draggable Task Cards Slot -->
    <div
      class="flex-1 min-h-32 flex flex-col overflow-y-auto pr-0.5 space-y-3 scrollbar-thin"
    >
      <slot />

      <div
        v-if="tasks.length === 0"
        class="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 py-8 px-4 text-center text-caption text-neutral-400 text-body"
      >
        Belum ada tugas
      </div>
    </div>

    <!-- Dash button at bottom of column -->
    <button
      v-if="isOwner"
      type="button"
      class="mt-3.5 w-full border border-dashed border-neutral-300 rounded-lg py-2.5 text-xs text-body text-neutral-500 hover:bg-white hover:border-neutral-400 hover:text-neutral-700 transition-all shadow-xs"
      @click="$emit('task-create', status)"
    >
      + Tambah Tugas
    </button>
  </section>
</template>
