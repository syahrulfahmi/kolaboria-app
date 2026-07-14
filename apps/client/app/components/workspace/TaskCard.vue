<script setup lang="ts">
import type { Task, TaskStatus } from '../../types/workspace'

const props = defineProps<{
  task: Task
  isSelected?: boolean
}>()

defineEmits<{
  click: []
}>()

const today = new Date().toISOString().slice(0, 10)

const isOverdue = computed(
  () =>
    Boolean(props.task.due_date) &&
    props.task.due_date! < today &&
    props.task.status !== 'done'
)

const assigneeName = computed(
  () =>
    props.task.assignee?.full_name ||
    props.task.assignee?.username ||
    'Belum ada assignee'
)

const assigneeInitial = computed(() => {
  if (!props.task.assignee) return '?'
  return (props.task.assignee.full_name || props.task.assignee.username)
    .slice(0, 1)
    .toUpperCase()
})

const statusTag = computed(() => {
  const statusMeta: Record<
    TaskStatus,
    { label: string; variant: 'default' | 'primary' | 'success' | 'warning' }
  > = {
    todo: { label: 'Todo', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    review: { label: 'Review', variant: 'warning' },
    done: { label: 'Done', variant: 'success' }
  }
  return (
    statusMeta[props.task.status] || {
      label: props.task.status,
      variant: 'default'
    }
  )
})
</script>

<template>
  <button
    type="button"
    class="w-full text-left rounded-lg bg-white p-3.5 border transition-all duration-150 focus:outline-none flex flex-col group relative"
    :class="[
      isSelected
        ? 'border-primary-600 ring-1 ring-primary-600 shadow-sm'
        : isOverdue
          ? 'border-danger-200 bg-danger-50/50 hover:bg-danger-50'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5'
    ]"
    @click="$emit('click')"
  >
    <!-- Top row: Status tag & active indicator -->
    <div class="flex items-center justify-between w-full mb-2">
      <AtomicTag :variant="statusTag.variant" class="text-[9px] px-2 py-0.5">
        {{ statusTag.label }}
      </AtomicTag>
    </div>

    <!-- Title -->
    <h4
      class="font-bold text-sm leading-snug transition-colors"
      :class="[
        task.status === 'done'
          ? 'line-through text-neutral-400 decoration-neutral-300'
          : 'text-neutral-800 group-hover:text-primary-600'
      ]"
    >
      {{ task.title }}
    </h4>

    <!-- Description -->
    <p
      v-if="task.description"
      class="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed"
      :class="{ 'line-through text-neutral-400': task.status === 'done' }"
    >
      {{ task.description }}
    </p>

    <!-- Bottom info: Due date & Assignee bubble -->
    <div
      class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-2.5 w-full text-xs text-neutral-400"
    >
      <div
        v-if="task.status === 'done'"
        class="flex items-center gap-1 text-emerald-600 text-body no-underline"
      >
        ✓ Selesai
      </div>
      <div
        v-else-if="task.due_date"
        class="flex items-center gap-1 font-medium"
        :class="isOverdue ? 'text-danger-500' : 'text-neutral-500'"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{{ task.due_date }}</span>
      </div>
      <div v-else />

      <!-- Assignee Bubble -->
      <div
        v-if="task.assignee"
        class="w-5 h-5 rounded-full bg-secondary-50 text-secondary-700 flex items-center justify-center font-bold text-[9px] ring-1 ring-secondary-100"
        :title="assigneeName"
      >
        {{ assigneeInitial }}
      </div>
      <div
        v-else
        class="w-5 h-5 rounded-full bg-neutral-50 text-neutral-400 flex items-center justify-center font-bold text-[9px] ring-1 ring-neutral-100"
        title="Belum ada assignee"
      >
        ?
      </div>
    </div>
  </button>
</template>
