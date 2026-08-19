<script setup lang="ts">
import type { MemberProfile, Task, TaskStatus } from '../../types/workspace'

const props = defineProps<{
  tasks: Record<TaskStatus, Task[]>
  members: MemberProfile[]
  isOwner: boolean
  selectedTaskId: string | null
  readOnly?: boolean
}>()

defineEmits<{
  'task-create': [status: TaskStatus]
  'task-click': [task: Task]
}>()

const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

const localTasks = ref<Record<TaskStatus, Task[]>>({
  todo: [],
  in_progress: [],
  review: [],
  done: []
})

watch(
  () => props.tasks,
  (nextTasks) => {
    localTasks.value = {
      todo: [...nextTasks.todo],
      in_progress: [...nextTasks.in_progress],
      review: [...nextTasks.review],
      done: [...nextTasks.done]
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <section class="min-h-0 flex-1 overflow-hidden bg-neutral-50" aria-labelledby="workspace-board-heading">
    <div class="flex h-full min-h-0 flex-col">
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
        <div>
          <h2 id="workspace-board-heading" class="font-label-1 uppercase tracking-wide text-secondary-900">Board kerja</h2>
          <p class="mt-0.5 font-body-3 text-neutral-500">Seret fokusmu dari todo sampai selesai.</p>
        </div>
        <span v-if="readOnly" class="font-label-2 text-neutral-500">Mode baca saja</span>
      </div>

      <div class="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6">
        <div class="flex h-full min-w-max gap-3 sm:gap-4 lg:min-w-0">
          <WorkspaceTaskColumn
            v-for="status in statuses"
            :key="status"
            :status="status"
            :tasks="localTasks[status]"
            :members="members"
            :is-owner="isOwner"
            :read-only="readOnly"
            @task-create="$emit('task-create', $event)"
          >
            <div class="space-y-2.5">
              <WorkspaceTaskCard
                v-for="task in localTasks[status]"
                :key="task.id"
                :task="task"
                :is-selected="task.id === selectedTaskId"
                @click="$emit('task-click', task)"
              />
            </div>
          </WorkspaceTaskColumn>
        </div>
      </div>
    </div>
  </section>
</template>
