<script setup lang="ts">
import type { ActivityAction, ActivityLog } from '../../types/workspace'

const props = defineProps<{
  logs: ActivityLog[]
  loading?: boolean
  compact?: boolean
}>()

const visibleCount = ref(props.compact ? 8 : 20)

const visibleLogs = computed(() => props.logs.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < props.logs.length)

const activityLabel = (action: ActivityAction) => {
  const labels: Record<ActivityAction, string> = {
    'task.created': 'membuat task',
    'task.moved': 'memindahkan task',
    'task.updated': 'memperbarui task',
    'task.deleted': 'menghapus task',
    'task.assigned': 'mengatur assignee',
    'task.unassigned': 'melepas assignee',
    'task.status_changed': 'mengubah status task',
    'task.completed': 'menyelesaikan task',
    'task.reopened': 'membuka kembali task',
    'comment.added': 'menambahkan komentar',
    'comment.created': 'menambahkan komentar',
    'comment.updated': 'memperbarui komentar',
    'comment.deleted': 'menghapus komentar',
    'member.joined': 'bergabung sebagai anggota',
    'member.left': 'keluar dari project',
    'member.removed': 'mengeluarkan anggota',
    'member.active': 'mengaktifkan anggota',
    'member.role_changed': 'mengubah role anggota',
    'deliverable.added': 'menambahkan deliverable',
    'deliverable.updated': 'memperbarui deliverable',
    'deliverable.removed': 'menghapus deliverable',
    'project.published': 'mempublikasikan project',
    'project.started': 'memulai project',
    'project.completed': 'menyelesaikan project',
    'project.cancelled': 'membatalkan project',
    'project.abandoned': 'menandai project ditinggalkan'
  }
  return labels[action] || 'melakukan aksi pada'
}

const relativeTime = (createdAt: string) => {
  const diff = Math.max(0, Date.now() - new Date(createdAt).getTime())
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
  <div v-if="compact" class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="font-label-1 uppercase tracking-wide text-neutral-500">Aktivitas terbaru</p>
        <p class="mt-1 font-body-2 text-neutral-600">Perubahan terakhir di workspace.</p>
      </div>
      <span class="rounded-full bg-neutral-100 px-2 py-0.5 font-label-2 text-neutral-600">{{ logs.length }}</span>
    </div>

    <MoleculeLoading v-if="loading" label="Memuat aktivitas..." class="py-6" />
    <OrganismEmptyState
      v-else-if="logs.length === 0"
      title="Belum ada aktivitas"
      description="Aktivitas akan muncul setelah ada perubahan di workspace."
      icon="document"
    />
    <ol v-else class="space-y-3" aria-label="Aktivitas terbaru">
      <li v-for="log in visibleLogs" :key="log.id" class="flex gap-3">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 font-label-2 text-primary-700 ring-1 ring-primary-100">
          {{ actorName(log).slice(0, 1).toUpperCase() }}
        </span>
        <p class="min-w-0 font-body-3 leading-relaxed text-neutral-600">
          <span class="font-label-2 text-secondary-900">{{ actorName(log) }}</span>
          {{ activityLabel(log.action) }}
          <span class="font-label-2 text-primary-700">{{ metadataTitle(log) }}</span>
          <span class="mt-0.5 block text-neutral-400">{{ relativeTime(log.created_at) }}</span>
        </p>
      </li>
    </ol>
    <button v-if="canLoadMore" type="button" class="font-label-2 text-primary-700 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" @click="visibleCount += 8">
      Lihat aktivitas lainnya
    </button>
  </div>

  <OrganismCard v-else variant="outlined" padding="md">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-caption text-body uppercase text-neutral-500">Activity</p>
          <h2 class="mt-1 text-title text-secondary-900">Riwayat terbaru</h2>
        </div>
        <span class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 text-caption text-neutral-600">{{ logs.length }}</span>
      </div>
    </template>

    <MoleculeLoading v-if="loading" label="Memuat aktivitas..." class="py-8" />
    <OrganismEmptyState v-else-if="logs.length === 0" title="Belum ada aktivitas" description="Aktivitas workspace akan muncul setelah task dibuat, dipindahkan, atau dikomentari." icon="document" />
    <div v-else class="flex flex-col divide-y divide-neutral-100">
      <div v-for="log in visibleLogs" :key="log.id" class="flex gap-3 py-4">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-caption text-primary-700 ring-1 ring-primary-100">{{ actorName(log).slice(0, 1).toUpperCase() }}</div>
        <div class="min-w-0 flex-1">
          <p class="text-body text-neutral-700"><span class="text-body text-secondary-900">{{ actorName(log) }}</span> {{ activityLabel(log.action) }} <span class="text-body text-secondary-900">{{ metadataTitle(log) }}</span></p>
          <p class="mt-1 text-caption text-neutral-500">{{ relativeTime(log.created_at) }}</p>
        </div>
      </div>
      <AtomicButton v-if="canLoadMore" variant="outline" class="mt-4" @click="visibleCount += 20">Lihat semua</AtomicButton>
    </div>
  </OrganismCard>
</template>
