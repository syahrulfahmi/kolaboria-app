<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type {
  CreateWorkspaceTaskPayload,
  MemberProfile,
  ReorderTaskUpdate,
  Task,
  TaskComment,
  TaskStatus,
  UpdateTaskPayload
} from '../../types/workspace'

const props = defineProps<{
  tasks: Record<TaskStatus, Task[]>
  members: MemberProfile[]
  comments: TaskComment[]
  commentsLoading?: boolean
  isOwner: boolean
  saving?: boolean
}>()

const emit = defineEmits<{
  'task-create': [payload: CreateWorkspaceTaskPayload]
  'tasks-reorder': [updates: ReorderTaskUpdate[]]
  'task-update': [taskId: string, payload: UpdateTaskPayload]
  'task-delete': [taskId: string]
  'comment-submit': [taskId: string, body: string]
  'comments-refresh': [taskId: string]
}>()

const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']
const selectedTaskId = ref<string | null>(null)
const isDetailOpen = ref(false)
const isCreateOpen = ref(false)

const createForm = reactive<CreateWorkspaceTaskPayload>({
  title: '',
  description: '',
  assignee_id: null,
  due_date: null,
  status: 'todo'
})

const localTasks = ref<Record<TaskStatus, Task[]>>({
  todo: [],
  in_progress: [],
  review: [],
  done: []
})

const columnMeta: Record<TaskStatus, { label: string }> = {
  todo: { label: 'Todo' },
  in_progress: { label: 'In Progress' },
  review: { label: 'Review' },
  done: { label: 'Done' }
}

const assigneeOptions = computed(() => [
  { label: 'Tidak ada assignee', value: '' },
  ...props.members.map((member) => ({
    label: member.full_name || member.username,
    value: member.id
  }))
])

const selectedTask = computed(() => {
  const allTasks = statuses.flatMap((status) => localTasks.value[status])
  return allTasks.find((task) => task.id === selectedTaskId.value) ?? null
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

const openTask = (task: Task) => {
  selectedTaskId.value = task.id
  isDetailOpen.value = true
  emit('comments-refresh', task.id)
}

const openCreate = (status: TaskStatus) => {
  createForm.title = ''
  createForm.description = ''
  createForm.assignee_id = null
  createForm.due_date = null
  createForm.status = status
  isCreateOpen.value = true
}

const handleDragEnd = () => {
  const updates = statuses.flatMap((status) =>
    localTasks.value[status].map((task, index) => ({
      id: task.id,
      status,
      position: index + 1
    }))
  )

  emit('tasks-reorder', updates)
}

const submitCreate = () => {
  const title = createForm.title.trim()
  if (!title) return

  emit('task-create', {
    title,
    description: createForm.description?.trim() || null,
    assignee_id: createForm.assignee_id || null,
    due_date: createForm.due_date || null,
    status: createForm.status
  })
  isCreateOpen.value = false
}

const forwardTaskUpdate = (taskId: string, payload: UpdateTaskPayload) => {
  emit('task-update', taskId, payload)
}

const forwardCommentSubmit = (taskId: string, body: string) => {
  emit('comment-submit', taskId, body)
}
</script>

<template>
  <section class="rounded-lg border border-neutral-200 bg-white p-4">
    <div
      class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="text-caption font-semibold uppercase text-neutral-500">
          Kanban Board
        </p>
        <h2 class="mt-1 text-heading text-secondary-900">Workspace tasks</h2>
      </div>
      <p class="text-caption text-neutral-500">
        Drag task antar kolom untuk memperbarui status.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <WorkspaceTaskColumn
        v-for="status in statuses"
        :key="status"
        :status="status"
        :tasks="localTasks[status]"
        :members="members"
        :is-owner="isOwner"
        @task-create="openCreate"
      >
        <VueDraggable
          v-model="localTasks[status]"
          group="workspace-tasks"
          item-key="id"
          ghost-class="opacity-60"
          chosen-class="ring-2 ring-primary-300"
          drag-class="shadow-md"
          class="flex min-h-32 flex-col gap-3"
          @end="handleDragEnd"
        >
          <WorkspaceTaskCard
            v-for="task in localTasks[status]"
            :key="task.id"
            :task="task"
            @click="openTask(task)"
          />
        </VueDraggable>
      </WorkspaceTaskColumn>
    </div>

    <WorkspaceTaskDetailModal
      v-model="isDetailOpen"
      :task="selectedTask"
      :members="members"
      :comments="comments"
      :comments-loading="commentsLoading"
      :saving="saving"
      :is-owner="isOwner"
      @update="forwardTaskUpdate"
      @delete="$emit('task-delete', $event)"
      @comment-submit="forwardCommentSubmit"
      @comments-refresh="$emit('comments-refresh', $event)"
    />

    <OrganismModal
      v-model="isCreateOpen"
      title="Buat Task Baru"
      size="xl"
      primary-label="Buat Task"
      secondary-label="Batal"
      :primary-loading="saving"
      :primary-disabled="saving || createForm.title.trim().length === 0"
      @primary="submitCreate"
      @secondary="isCreateOpen = false"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <MoleculeInputField
          v-model="createForm.title"
          label="Title"
          required
          :disabled="saving"
        />

        <MoleculeDropdown
          v-model="createForm.status"
          label="Status"
          :options="
            statuses.map((status) => ({
              label: columnMeta[status].label,
              value: status
            }))
          "
          :disabled="saving"
        />

        <MoleculeDropdown
          v-model="createForm.assignee_id"
          label="Assignee"
          :options="assigneeOptions"
          :disabled="saving"
          searchable
        />

        <MoleculeInputField
          v-model="createForm.due_date"
          label="Due Date"
          type="date"
          :disabled="saving"
        />

        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-caption font-semibold uppercase text-neutral-500">
            Description
          </label>
          <textarea
            v-model="createForm.description"
            rows="4"
            class="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100"
            :disabled="saving"
          />
        </div>
      </div>
    </OrganismModal>
  </section>
</template>
