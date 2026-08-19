<script setup lang="ts">
import type { Task, TaskStatus } from '../../types/workspace'

const props = defineProps<{
  task: Task
  isSelected?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const today = new Date().toISOString().slice(0, 10)

const isOverdue = computed(() =>
  Boolean(props.task.due_date) && props.task.due_date! < today && props.task.status !== 'done'
)

const assigneeName = computed(() =>
  props.task.assignee?.full_name || props.task.assignee?.username || 'Belum ada assignee'
)

const assigneeInitial = computed(() =>
  props.task.assignee
    ? (props.task.assignee.full_name || props.task.assignee.username).slice(0, 1).toUpperCase()
    : '?'
)

const statusTag = computed(() => {
  const statusMeta: Record<TaskStatus, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' }> = {
    todo: { label: 'Todo', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    review: { label: 'Review', variant: 'warning' },
    done: { label: 'Done', variant: 'success' }
  }
  return statusMeta[props.task.status] || { label: props.task.status, variant: 'default' }
})

const activate = () => emit('click')
</script>

<template>
  <button
    type="button"
    class="group relative flex w-full flex-col rounded-lg border bg-white p-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    :class="[
      isSelected
        ? 'border-primary-500 ring-2 ring-primary-100'
        : isOverdue
          ? 'border-danger-200 bg-danger-50/30 hover:border-danger-300'
          : 'border-neutral-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm'
    ]"
    :aria-pressed="isSelected"
    :aria-label="`Buka task ${task.title}`"
    @click="activate"
  >
    <div class="mb-2 flex items-center justify-between gap-2">
      <AtomicTag :variant="statusTag.variant">{{ statusTag.label }}</AtomicTag>
      <span v-if="isOverdue" class="font-label-2 text-danger-700">Overdue</span>
    </div>

    <h3 class="font-label-1 leading-snug" :class="task.status === 'done' ? 'text-neutral-400 line-through' : 'text-secondary-900 group-hover:text-primary-700'">
      {{ task.title }}
    </h3>

    <p v-if="task.description" class="mt-1.5 line-clamp-2 font-body-3 leading-relaxed text-neutral-500" :class="{ 'text-neutral-400 line-through': task.status === 'done' }">
      {{ task.description }}
    </p>

    <div class="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-2.5">
      <span v-if="task.due_date" class="inline-flex min-w-0 items-center gap-1 font-body-3" :class="isOverdue ? 'text-danger-700' : 'text-neutral-500'">
        <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="truncate">{{ task.due_date }}</span>
      </span>
      <span v-else class="font-body-3 text-neutral-400">Tanpa deadline</span>

      <span class="flex shrink-0 items-center gap-1.5" :title="assigneeName">
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-50 font-label-2 text-secondary-700 ring-1 ring-secondary-100">
          {{ assigneeInitial }}
        </span>
        <span class="hidden max-w-24 truncate font-body-3 text-neutral-500 sm:inline">{{ assigneeName }}</span>
      </span>
    </div>
  </button>
</template>
