<script setup lang="ts">
import type {
  MemberProfile,
  Task,
  TaskStatus
} from '../../types/workspace'

const props = defineProps<{
  tasks: Record<TaskStatus, Task[]>
  members: MemberProfile[]
  isOwner: boolean
  selectedTaskId: string | null
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
  <div class="h-full flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-6 gap-5 md:items-stretch select-none">
    <WorkspaceTaskColumn
      v-for="status in statuses"
      :key="status"
      :status="status"
      :tasks="localTasks[status]"
      :members="members"
      :is-owner="isOwner"
      @task-create="$emit('task-create', status)"
    >
      <div class="flex min-h-[300px] flex-col gap-3">
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
</template>
