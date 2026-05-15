<script setup lang="ts">
import type {
  MemberProfile,
  Task,
  TaskComment,
  TaskStatus,
  UpdateTaskPayload
} from '../../types/workspace'

const props = defineProps<{
  modelValue: boolean
  task: Task | null
  members: MemberProfile[]
  comments: TaskComment[]
  commentsLoading?: boolean
  saving?: boolean
  isOwner: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  update: [taskId: string, payload: UpdateTaskPayload]
  delete: [taskId: string]
  'comment-submit': [taskId: string, body: string]
  'comments-refresh': [taskId: string]
}>()

const isEditing = ref(false)
const form = reactive<UpdateTaskPayload>({
  title: '',
  description: '',
  assignee_id: null,
  due_date: null,
  status: 'todo'
})

const statusOptions = [
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' }
]

const assigneeOptions = computed(() => [
  { label: 'Tidak ada assignee', value: '' },
  ...props.members.map((member) => ({
    label: member.full_name || member.username,
    value: member.id
  }))
])

const canEditAllFields = computed(() => props.isOwner && isEditing.value)
const canSubmit = computed(() => Boolean(props.task?.id) && !props.saving)

watch(
  () => props.task,
  (task) => {
    if (!task) return
    form.title = task.title
    form.description = task.description ?? ''
    form.assignee_id = task.assignee_id
    form.due_date = task.due_date
    form.status = task.status
    isEditing.value = false
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.task?.id) {
      emit('comments-refresh', props.task.id)
    }
  }
)

const close = () => {
  emit('update:modelValue', false)
}

const updateOpen = (value: boolean) => {
  emit('update:modelValue', value)
}

const submitUpdate = () => {
  if (!props.task || !canSubmit.value) return

  const payload: UpdateTaskPayload = props.isOwner
    ? {
        title: String(form.title || '').trim(),
        description: form.description ? String(form.description) : null,
        assignee_id: form.assignee_id || null,
        due_date: form.due_date || null,
        status: form.status as TaskStatus
      }
    : {
        status: form.status as TaskStatus
      }

  emit('update', props.task.id, payload)
  isEditing.value = false
}

const submitComment = (body: string) => {
  if (!props.task) return
  emit('comment-submit', props.task.id, body)
}

const deleteTask = () => {
  if (!props.task) return
  const confirmed = window.confirm('Hapus task ini?')
  if (!confirmed) return
  emit('delete', props.task.id)
  close()
}
</script>

<template>
  <OrganismModal
    :model-value="modelValue"
    :title="task?.title || 'Task detail'"
    size="xl"
    @update:model-value="updateOpen"
    @close="close"
  >
    <div v-if="task" class="flex flex-col gap-6">
      <div class="flex flex-col gap-4">
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-caption font-semibold uppercase text-neutral-500">
              Detail Task
            </p>
            <p class="mt-1 text-body text-neutral-600">
              Owner dapat mengubah semua field. Collaborator dapat mengubah
              status dan berdiskusi.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <AtomicButton
              v-if="isOwner"
              variant="outline"
              size="sm"
              @click="isEditing = !isEditing"
            >
              {{ isEditing ? 'Batal Edit' : 'Edit' }}
            </AtomicButton>
            <AtomicButton
              v-if="isOwner"
              variant="outline-danger"
              size="sm"
              :disabled="saving"
              @click="deleteTask"
            >
              Delete
            </AtomicButton>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <MoleculeInputField
            v-model="form.title"
            label="Title"
            :disabled="!canEditAllFields || saving"
            required
          />

          <MoleculeDropdown
            v-model="form.status"
            label="Status"
            :options="statusOptions"
            :disabled="saving"
          />

          <MoleculeDropdown
            v-model="form.assignee_id"
            label="Assignee"
            :options="assigneeOptions"
            :disabled="!canEditAllFields || saving"
            searchable
          />

          <MoleculeInputField
            v-model="form.due_date"
            label="Due Date"
            type="date"
            :disabled="!canEditAllFields || saving"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-caption font-semibold uppercase text-neutral-500">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="5"
            class="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
            :disabled="!canEditAllFields || saving"
          />
        </div>

        <div class="flex justify-end">
          <AtomicButton
            variant="primary"
            :loading="saving"
            :disabled="!canSubmit"
            @click="submitUpdate"
          >
            Simpan Perubahan
          </AtomicButton>
        </div>
      </div>

      <AtomicDivider />

      <section class="flex flex-col gap-4">
        <div>
          <p class="text-caption font-semibold uppercase text-neutral-500">
            Komentar
          </p>
          <h3 class="mt-1 text-title text-secondary-900">Diskusi task</h3>
        </div>

        <WorkspaceTaskCommentList
          :comments="comments"
          :loading="commentsLoading"
        />

        <WorkspaceTaskCommentForm :loading="saving" @submit="submitComment" />
      </section>
    </div>
  </OrganismModal>
</template>
