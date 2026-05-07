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

const statusMeta: Record<TaskStatus, { label: string; class: string }> = {
  todo: {
    label: 'Todo',
    class: 'border-neutral-300 bg-neutral-50 text-neutral-700'
  },
  in_progress: {
    label: 'In Progress',
    class: 'border-primary-200 bg-primary-50 text-primary-700'
  },
  review: {
    label: 'Review',
    class: 'border-accent-200 bg-accent-50 text-accent-700'
  },
  done: {
    label: 'Done',
    class: 'border-success-200 bg-success-50 text-success-700'
  }
}

const meta = computed(() => statusMeta[props.status])
</script>

<template>
  <section class="flex min-h-96 flex-col rounded-lg border border-neutral-200 bg-white">
    <header
      class="flex items-center justify-between gap-3 border-b px-4 py-3"
      :class="meta.class"
    >
      <div>
        <h3 class="text-body font-semibold">{{ meta.label }}</h3>
        <p class="text-caption">{{ tasks.length }} task</p>
      </div>

      <AtomicButton
        v-if="isOwner"
        variant="ghost-primary"
        size="sm"
        @click="$emit('task-create', status)"
      >
        + Task
      </AtomicButton>
    </header>

    <div class="flex flex-1 flex-col p-3">
      <slot />

      <div
        v-if="tasks.length === 0"
        class="mt-3 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-caption text-neutral-500"
      >
        Belum ada task di sini
      </div>
    </div>
  </section>
</template>
