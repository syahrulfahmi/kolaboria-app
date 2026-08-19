<script setup lang="ts">
import type {
  MemberProfile,
  Task,
  TaskComment,
  TaskStatus,
  UpdateTaskPayload
} from '~/types/workspace'
import { onUnmounted, ref, computed, watch, reactive } from 'vue'

const props = defineProps<{
  isOpen: boolean
  task: Task | null
  members: MemberProfile[]
  comments: TaskComment[]
  commentsLoading?: boolean
  saving?: boolean
  isOwner: boolean
  readOnly?: boolean
  currentUserId: string
}>()

const emit = defineEmits<{
  close: []
  update: [taskId: string, payload: UpdateTaskPayload]
  delete: [taskId: string]
  'comment-submit': [taskId: string, body: string]
  'comment-update': [commentId: string, body: string]
  'comment-delete': [commentId: string]
  'comments-refresh': [taskId: string]
}>()

const commentBody = ref('')

const draft = reactive({
  title: '',
  description: '',
  assignee_id: null as string | null,
  due_date: null as string | null,
  status: 'todo' as TaskStatus
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

watch(
  () => props.task,
  (task) => {
    if (!task) return
    draft.title = task.title
    draft.description = task.description ?? ''
    draft.assignee_id = task.assignee_id
    draft.due_date = task.due_date
    draft.status = task.status
  },
  { immediate: true }
)

const hasChanges = computed(() => {
  if (!props.task) return false
  return (
    draft.title !== props.task.title ||
    draft.description !== (props.task.description ?? '') ||
    draft.assignee_id !== props.task.assignee_id ||
    draft.due_date !== props.task.due_date ||
    draft.status !== props.task.status
  )
})

const cancelChanges = () => {
  if (!props.task) return
  draft.title = props.task.title
  draft.description = props.task.description ?? ''
  draft.assignee_id = props.task.assignee_id
  draft.due_date = props.task.due_date
  draft.status = props.task.status
}

const submitChanges = () => {
  if (!props.task) return
  if (!draft.title.trim()) return

  const payload: UpdateTaskPayload = canEditFields.value
    ? {
        title: draft.title.trim(),
        description: draft.description.trim() || null,
        assignee_id: draft.assignee_id || null,
        due_date: draft.due_date || null,
        status: draft.status
      }
    : {
        status: draft.status
      }

  emit('update', props.task.id, payload)
}

const handleCommentSubmit = () => {
  if (!props.task || !commentBody.value.trim()) return
  emit('comment-submit', props.task.id, commentBody.value)
  commentBody.value = ''
}

const { show: showPopup } = usePopup()

const deleteTask = () => {
  if (!props.task) return

  showPopup({
    title: 'Hapus Task?',
    description: `Apakah Anda yakin ingin menghapus task "<b>${props.task.title}</b>" secara permanen? Tindakan ini tidak dapat dikembalikan.`,
    type: 'danger',
    positiveLabel: 'Ya, Hapus',
    negativeLabel: 'Batal',
    onPositive: () => {
      emit('delete', props.task!.id)
      emit('close')
    }
  })
}

const assigneeInitial = computed(() => {
  if (!props.task?.assignee) return '?'
  return (props.task.assignee.full_name || props.task.assignee.username)
    .slice(0, 1)
    .toUpperCase()
})

const draftDueDateAsDate = computed({
  get: () => (draft.due_date ? new Date(draft.due_date) : null),
  set: (val: Date | null | { start: Date | null; end: Date | null }) => {
    if (val instanceof Date) {
      const d = new Date(val)
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
      draft.due_date = d.toISOString().split('T')[0] ?? null
    } else {
      draft.due_date = null
    }
  }
})

const isDrawerOpen = computed(() => props.isOpen && props.task !== null)
const canEditFields = computed(() => props.isOwner && !props.readOnly)
const canEditStatus = computed(() => !props.readOnly)
</script>

<template>
  <OrganismDrawer
    :model-value="isDrawerOpen"
    :show-close="false"
    @update:model-value="
      (val) => {
        if (!val) $emit('close')
      }
    "
    @close="$emit('close')"
  >
    <!-- Custom Header slot -->
    <template #header>
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <AtomicTag
          v-if="task"
          :variant="
            task.status === 'done'
              ? 'success'
              : task.status === 'review'
                ? 'warning'
                : task.status === 'in_progress'
                  ? 'primary'
                  : 'default'
          "
        >
          {{
            statusOptions.find((o) => o.value === task?.status)?.label ||
            task.status
          }}
        </AtomicTag>
        <span
          v-if="task"
          class="text-caption text-neutral-400 font-mono truncate"
          >• ID #{{ task.id.slice(0, 6).toUpperCase() }}</span
        >
      </div>

      <!-- Action buttons in header -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          v-if="canEditFields"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-danger-600 transition hover:bg-danger-50 hover:text-danger-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-400"
          title="Hapus task"
          aria-label="Hapus task"
          @click="deleteTask"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        <div class="w-px h-4 bg-neutral-200 mx-1" />
        <button
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          aria-label="Tutup detail task"
          @click="$emit('close')"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </template>

    <!-- Body -->
    <div v-if="task" class="p-5 space-y-6">
      <!-- Title & Description Form/Display -->
      <div class="space-y-4">
        <!-- Title Field -->
        <div class="space-y-1">
          <MoleculeInputField
            v-if="canEditFields"
            v-model="draft.title"
            label="Judul Tugas"
            placeholder="Judul tugas..."
          />
          <template v-else>
            <label class="font-body-1">Judul Tugas</label>
            <h3 class="font-paragraph-2 text-secondary py-2">
              {{ task.title }}
            </h3>
          </template>
        </div>

        <!-- Description Field -->
        <div class="space-y-1">
          <MoleculeTextarea
            v-if="canEditFields"
            v-model="draft.description"
            label="Deskripsi"
            rows="4"
            placeholder="Tambah deskripsi tugas..."
          />
          <template v-else>
            <label class="font-body-1">Deskripsi</label>
            <p
              class="font-paragraph-2 text-secondary leading-relaxed whitespace-pre-line"
            >
              {{ task.description || 'Tidak ada deskripsi.' }}
            </p>
          </template>
        </div>
      </div>

      <!-- Metadata Section -->
      <div
        class="space-y-3.5 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100/80 shadow-3xs text-xs"
      >
        <!-- Assignee Row -->
        <div class="flex items-center gap-4 min-h-[44px]">
          <span class="w-24 shrink-0 font-body-2">Assignee</span>
          <div class="flex-1 min-w-0">
            <div v-if="canEditFields" class="w-full">
              <MoleculeDropdown
                v-model="draft.assignee_id"
                :options="assigneeOptions"
              />
            </div>
            <div
              class="flex items-center gap-2 py-2 px-3 bg-white border border-neutral-200/60 rounded-xl"
              v-else
            >
              <div
                class="w-5 h-5 rounded-full bg-secondary-50 ring-1 ring-secondary-100 text-secondary-700 flex items-center justify-center font-label-3 shrink-0"
              >
                {{ assigneeInitial }}
              </div>
              <span class="font-label-2 truncate">
                {{
                  task.assignee?.full_name ||
                  task.assignee?.username ||
                  'Belum ada assignee'
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tenggat Waktu Row -->
        <div class="flex items-center gap-4 min-h-[44px]">
          <span class="w-24 shrink-0 font-body-2">Tenggat</span>
          <div class="flex-1 min-w-0">
            <div v-if="canEditFields" class="w-full">
              <MoleculeDatePicker
                v-model="draftDueDateAsDate"
                placeholder="Pilih tenggat waktu"
              />
            </div>
            <div
              class="flex items-center gap-2 py-2 px-3 bg-white border border-neutral-200/60 rounded-xl text-neutral-700 font-medium"
              v-else
            >
              <svg
                class="h-3.5 w-3.5 text-neutral-400 shrink-0"
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
              <span class="font-label-2 truncate">{{
                task.due_date || 'Tidak ada'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Status Row -->
        <div class="flex items-center gap-4 min-h-[44px]">
          <span class="w-24 shrink-0 font-body-2">Status</span>
          <div class="flex-1 min-w-0">
            <MoleculeDropdown
              v-if="canEditStatus"
              v-model="draft.status"
              :options="statusOptions"
              :disabled="saving"
              class="w-full"
            />
            <div v-else class="rounded-lg border border-neutral-200 bg-white px-3 py-2 font-label-2 text-neutral-700">
              {{ statusOptions.find((option) => option.value === draft.status)?.label || draft.status }}
            </div>
          </div>
        </div>

        <!-- Dibuat Oleh Row -->
        <div class="flex items-center gap-4 min-h-[44px]">
          <span class="w-24 shrink-0 font-body-2">Kreator</span>
          <div class="flex-1 min-w-0">
            <div
              class="flex items-center gap-2 py-2 px-3 bg-white border border-neutral-200/60 rounded-xl"
            >
              <div
                class="w-5 h-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-[9px] shrink-0"
              >
                {{
                  (task.creator?.full_name || task.creator?.username || 'S')
                    .slice(0, 1)
                    .toUpperCase()
                }}
              </div>
              <span class="font-label-2 truncate">
                {{
                  task.creator?.full_name || task.creator?.username || 'Sistem'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Diskusi / Comments Section -->
      <div class="border-t border-neutral-100 pt-5 space-y-4">
        <div class="font-body-1 mb-3">Diskusi Tugas</div>

        <WorkspaceTaskCommentList
          :comments="comments"
          :loading="commentsLoading"
          :current-user-id="currentUserId"
          @comment-update="
            (commentId, body) => $emit('comment-update', commentId, body)
          "
          @comment-delete="(commentId) => $emit('comment-delete', commentId)"
        />

        <!-- Kirim Komentar Form (di dalam body scrollable) -->
        <form
          v-if="task"
          @submit.prevent="handleCommentSubmit"
          class="flex items-center gap-2 w-full border-t border-neutral-100 pt-4"
        >
          <MoleculeInputField
            v-model="commentBody"
            placeholder="Tulis komentar..."
            class="flex-1"
            :disabled="saving"
          />
          <AtomicButton
            type="submit"
            variant="primary"
            size="sm"
            class="shrink-0 rounded-xl"
            :disabled="!commentBody.trim() || saving"
            :loading="saving"
          >
            Kirim
          </AtomicButton>
        </form>
      </div>
    </div>

    <!-- Footer slot: save/cancel/close changes button -->
    <template #footer>
      <div class="flex items-center justify-end gap-2.5 w-full">
        <template v-if="hasChanges">
          <AtomicButton
            variant="outline"
            size="sm"
            @click="cancelChanges"
            :disabled="saving"
          >
            Batal
          </AtomicButton>
          <AtomicButton
            variant="primary"
            size="sm"
            @click="submitChanges"
            :disabled="saving || !draft.title.trim()"
            :loading="saving"
          >
            Simpan
          </AtomicButton>
        </template>
        <template v-else>
          <AtomicButton variant="outline" size="sm" @click="$emit('close')">
            Tutup
          </AtomicButton>
        </template>
      </div>
    </template>
  </OrganismDrawer>
</template>
