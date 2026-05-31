<script setup lang="ts">
import type { TaskComment } from '../../types/workspace'

defineProps<{
  comments: TaskComment[]
  loading?: boolean
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
</script>

<template>
  <MoleculeLoading v-if="loading" label="Memuat komentar..." class="py-6" />

  <OrganismEmptyState
    v-else-if="comments.length === 0"
    title="Belum ada komentar"
    description="Diskusi task akan muncul di sini."
    icon="document"
  />

  <div v-else class="flex flex-col divide-y divide-neutral-100">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="flex gap-3 py-4"
    >
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-caption font-semibold text-secondary-700"
      >
        {{ authorName(comment).slice(0, 1).toUpperCase() }}
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <p class="text-caption font-semibold text-secondary-900">
            {{ authorName(comment) }}
          </p>
          <p class="text-caption text-neutral-500">
            {{ relativeTime(comment.created_at) }}
          </p>
        </div>
        <p class="mt-1 whitespace-pre-wrap text-body text-neutral-700">
          {{ comment.body }}
        </p>
      </div>
    </div>
  </div>
</template>
