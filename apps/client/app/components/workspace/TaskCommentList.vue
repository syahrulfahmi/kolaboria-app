<script setup lang="ts">
import type { TaskComment } from '../../types/workspace'

defineProps<{
  comments: TaskComment[]
  loading?: boolean
  currentUserId: string
}>()

const emit = defineEmits<{
  'comment-update': [commentId: string, body: string]
  'comment-delete': [commentId: string]
}>()

const authorName = (comment: TaskComment) =>
  comment.profiles?.full_name || comment.profiles?.username || 'Member'

const relativeTime = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes} mnt lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

const editingCommentId = ref<string | null>(null)
const editBody = ref('')

const startEdit = (comment: TaskComment) => {
  editingCommentId.value = comment.id
  editBody.value = comment.body
}

const cancelEdit = () => {
  editingCommentId.value = null
  editBody.value = ''
}

const saveEdit = (commentId: string) => {
  if (!editBody.value.trim()) return
  emit('comment-update', commentId, editBody.value.trim())
  editingCommentId.value = null
}

const { show: showPopup } = usePopup()

const confirmDelete = (commentId: string) => {
  showPopup({
    title: 'Hapus Komentar?',
    description:
      'Apakah Anda yakin ingin menghapus komentar ini secara permanen?',
    type: 'danger',
    positiveLabel: 'Ya, Hapus',
    negativeLabel: 'Batal',
    onPositive: () => {
      emit('comment-delete', commentId)
    }
  })
}
</script>

<template>
  <MoleculeLoading v-if="loading" label="Memuat komentar..." class="py-6" />

  <OrganismEmptyState
    v-else-if="comments.length === 0"
    title="Belum ada komentar"
    description="Diskusi task akan muncul di sini."
    icon="document"
  />

  <div v-else class="flex flex-col divide-y divide-neutral-100 gap-3">
    <div v-for="comment in comments" :key="comment.id" class="flex gap-3 pb-3">
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-caption text-body text-secondary-700"
      >
        {{ authorName(comment).slice(0, 1).toUpperCase() }}
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <p class="font-body-2">
              {{ authorName(comment) }}
            </p>
            <p class="font-body-3 text-secondary">
              {{ relativeTime(comment.created_at) }}
            </p>
          </div>
          <!-- Edit / Delete actions if author -->
          <div
            v-if="
              comment.author_id === currentUserId &&
              editingCommentId !== comment.id
            "
            class="flex items-center gap-2 text-[10px] text-neutral-400"
          >
            <button
              @click="startEdit(comment)"
              class="hover:text-primary-600 transition"
            >
              Edit
            </button>
            <span>•</span>
            <button
              @click="confirmDelete(comment.id)"
              class="hover:text-danger-500 transition"
            >
              Hapus
            </button>
          </div>
        </div>

        <div v-if="editingCommentId === comment.id" class="mt-2 space-y-2">
          <textarea
            v-model="editBody"
            rows="2"
            class="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none"
            @keyup.esc="cancelEdit"
          />
          <div class="flex justify-end gap-1.5 text-[10px]">
            <button
              @click="cancelEdit"
              class="text-neutral-500 hover:text-neutral-700 font-medium px-2 py-1 rounded hover:bg-neutral-100 transition"
            >
              Batal
            </button>
            <button
              @click="saveEdit(comment.id)"
              class="bg-primary-600 text-white font-medium px-2.5 py-1 rounded hover:bg-primary-700 transition"
              :disabled="!editBody.trim()"
            >
              Simpan
            </button>
          </div>
        </div>
        <p
          v-else
          class="mt-1 whitespace-pre-wrap font-paragraph-3 text-secondary"
        >
          {{ comment.body }}
        </p>
      </div>
    </div>
  </div>
</template>
