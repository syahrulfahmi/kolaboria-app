<script setup lang="ts">
import type { Task, TaskStatus } from '../../types/workspace'

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  click: []
}>()

const today = new Date().toISOString().slice(0, 10)

const isOverdue = computed(
  () => Boolean(props.task.due_date) && props.task.due_date! < today && props.task.status !== 'done'
)

const assigneeName = computed(
  () =>
    props.task.assignee?.full_name ||
    props.task.assignee?.username ||
    'Belum ada assignee'
)

const statusLabel: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done'
}

const statusVariant = computed(() => {
  if (props.task.status === 'done') return 'success'
  if (props.task.status === 'review') return 'warning'
  if (props.task.status === 'in_progress') return 'primary'
  return 'default'
})
</script>

<template>
  <button
    type="button"
    class="w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300"
    :class="
      isOverdue
        ? 'border-danger-200 bg-danger-50'
        : 'border-neutral-200 hover:border-primary-200'
    "
    @click="$emit('click')"
  >
    <div class="flex items-start gap-3">
      <span
        class="mt-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-caption font-semibold text-neutral-500"
        aria-hidden="true"
      >
        ::
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-body font-semibold text-secondary-900">
            {{ task.title }}
          </h3>
          <AtomicTag :variant="statusVariant">
            {{ statusLabel[task.status] }}
          </AtomicTag>
        </div>

        <p
          v-if="task.description"
          class="mt-2 line-clamp-2 text-caption text-neutral-600"
        >
          {{ task.description }}
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-caption text-neutral-600">
            {{ assigneeName }}
          </span>
          <span
            v-if="task.due_date"
            class="rounded-lg border px-2 py-1 text-caption"
            :class="
              isOverdue
                ? 'border-danger-200 bg-danger-50 text-danger-500'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600'
            "
          >
            {{ task.due_date }}
          </span>
        </div>
      </div>
    </div>
  </button>
</template>
