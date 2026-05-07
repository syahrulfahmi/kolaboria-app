<script setup lang="ts">
import type { ActivityAction, ActivityLog } from '../../types/workspace'

const props = defineProps<{
  logs: ActivityLog[]
  loading?: boolean
}>()

const visibleCount = ref(20)

const visibleLogs = computed(() => props.logs.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < props.logs.length)

const activityLabel = (action: ActivityAction) => {
  const labels: Record<ActivityAction, string> = {
    'task.created': 'membuat task',
    'task.moved': 'memindahkan task',
    'task.updated': 'memperbarui task',
    'task.deleted': 'menghapus task',
    'task.assigned': 'mengatur assignee',
    'comment.added': 'menambahkan komentar'
  }
  return labels[action]
}

const relativeTime = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes} mnt lalu`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`

  return `${Math.floor(hours / 24)} hari lalu`
}

const actorName = (log: ActivityLog) =>
  log.profiles?.full_name || log.profiles?.username || 'Member'

const metadataTitle = (log: ActivityLog) => {
  const title = log.metadata?.title
  return typeof title === 'string' ? title : 'task'
}
</script>

<template>
  <OrganismCard variant="outlined" padding="md">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-caption font-semibold uppercase text-neutral-500">
            Activity
          </p>
          <h2 class="mt-1 text-title text-secondary-900">Riwayat terbaru</h2>
        </div>
        <span class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 text-caption text-neutral-600">
          {{ logs.length }}
        </span>
      </div>
    </template>

    <MoleculeLoading v-if="loading" label="Memuat aktivitas..." class="py-8" />

    <OrganismEmptyState
      v-else-if="logs.length === 0"
      title="Belum ada aktivitas"
      description="Aktivitas workspace akan muncul setelah task dibuat, dipindahkan, atau dikomentari."
      icon="document"
    />

    <div v-else class="flex flex-col divide-y divide-neutral-100">
      <div
        v-for="log in visibleLogs"
        :key="log.id"
        class="flex gap-3 py-4"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-caption font-semibold text-primary-700 ring-1 ring-primary-100"
        >
          {{ actorName(log).slice(0, 1).toUpperCase() }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-body text-neutral-700">
            <span class="font-semibold text-secondary-900">
              {{ actorName(log) }}
            </span>
            {{ activityLabel(log.action) }}
            <span class="font-semibold text-secondary-900">
              {{ metadataTitle(log) }}
            </span>
          </p>
          <p class="mt-1 text-caption text-neutral-500">
            {{ relativeTime(log.created_at) }}
          </p>
        </div>
      </div>

      <AtomicButton
        v-if="canLoadMore"
        variant="outline"
        class="mt-4"
        @click="visibleCount += 20"
      >
        Lihat semua
      </AtomicButton>
    </div>
  </OrganismCard>
</template>
