<script setup lang="ts">
import type {
  MemberProfile,
  ActivityLog,
  ActivityAction
} from '~/types/workspace'

const props = defineProps<{
  members: MemberProfile[]
  activities: ActivityLog[]
  projectCreatorId: string
  loading?: boolean
}>()

const visibleCount = ref(5) // Show top 5 activities in sidebar
const visibleLogs = computed(() =>
  props.activities.slice(0, visibleCount.value)
)

const activityLabel = (action: ActivityAction) => {
  const labels: Record<ActivityAction, string> = {
    'task.created': 'membuat tugas',
    'task.moved': 'memindahkan tugas',
    'task.updated': 'memperbarui tugas',
    'task.deleted': 'menghapus tugas',
    'task.assigned': 'mengatur assignee',
    'comment.added': 'berkomentar di'
  }
  return labels[action] || 'melakukan aksi pada'
}

const relativeTime = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes}m lalu`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}j lalu`

  return `${Math.floor(hours / 24)}h lalu`
}

const actorName = (log: ActivityLog) =>
  log.profiles?.full_name || log.profiles?.username || 'Member'

const metadataTitle = (log: ActivityLog) => {
  const title = log.metadata?.title
  return typeof title === 'string' ? title : 'tugas'
}

const activityIcon = (action: ActivityAction) => {
  switch (action) {
    case 'task.created':
      return '✔'
    case 'task.moved':
      return '🔄'
    case 'comment.added':
      return '💬'
    case 'task.deleted':
      return '❌'
    default:
      return '📝'
  }
}

const activityIconColor = (action: ActivityAction) => {
  switch (action) {
    case 'task.created':
      return 'text-success-600 bg-success-50 border-success-100'
    case 'task.moved':
      return 'text-primary-600 bg-primary-50 border-primary-100'
    case 'comment.added':
      return 'text-accent-700 bg-accent-50 border-accent-100'
    case 'task.deleted':
      return 'text-danger-600 bg-danger-50 border-danger-100'
    default:
      return 'text-neutral-600 bg-neutral-50 border-neutral-200'
  }
}
</script>

<template>
  <aside
    class="w-64 bg-white border-r border-neutral-200 flex flex-col hidden lg:flex shrink-0"
  >
    <div class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
      <!-- Section: Tim / Members -->
      <div>
        <div class="flex items-center justify-between px-2 mb-3">
          <span class="font-body-1">Anggota Tim</span>
          <span
            class="bg-neutral-100 text-neutral-600 font-label-2 px-2 py-1 rounded-full"
          >
            {{ members.length }}
          </span>
        </div>
        <div class="space-y-3 px-2">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-2 min-w-0">
              <div
                class="w-6 h-6 rounded-full bg-secondary-50 ring-1 ring-secondary-100 text-secondary-700 flex items-center justify-center font-bold text-[10px] shrink-0"
              >
                {{
                  (member.full_name || member.username)
                    .slice(0, 1)
                    .toUpperCase()
                }}
              </div>
              <span
                class="font-body-2 truncate"
                :title="member.full_name || member.username"
              >
                {{ member.full_name || member.username }}
              </span>
            </div>

            <AtomicTag
              v-if="member.id === projectCreatorId"
              variant="success"
              class="shrink-0 text-[8px] px-1 py-0.5"
            >
              Owner
            </AtomicTag>
            <AtomicTag
              v-else
              variant="default"
              class="shrink-0 text-[8px] px-1.5 py-0.5 font-medium"
            >
              Contr.
            </AtomicTag>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-neutral-100 my-4" />

      <!-- Section: Recent Activity -->
      <div>
        <span class="px-2 font-body-1 block mb-3"> Aktivitas Terbaru </span>
        <MoleculeLoading
          v-if="loading"
          label="Memuat aktivitas..."
          class="py-4"
        />
        <div
          v-else-if="activities.length === 0"
          class="font-paragraph-2 text-secondary px-2 text-center py-4"
        >
          Belum ada aktivitas.
        </div>
        <ul v-else class="space-y-3.5 px-2">
          <li
            v-for="log in visibleLogs"
            :key="log.id"
            class="flex gap-3 text-xs text-neutral-600 items-start leading-relaxed"
          >
            <div
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs"
              :class="activityIconColor(log.action)"
            >
              <!-- task.created / check icon -->
              <svg
                v-if="log.action === 'task.created'"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <!-- task.moved / arrow-path icon -->
              <svg
                v-else-if="log.action === 'task.moved'"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <!-- comment.added / comment icon -->
              <svg
                v-else-if="log.action === 'comment.added'"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <!-- task.deleted / trash icon -->
              <svg
                v-else-if="log.action === 'task.deleted'"
                class="h-3.5 w-3.5"
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
              <!-- default / document or pencil icon -->
              <svg
                v-else
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <span class="font-body-2">{{ actorName(log) }}</span>
              {{ activityLabel(log.action) }}
              <span class="font-label-2 text-primary-700">
                {{ metadataTitle(log) }}
              </span>
              <span class="font-body-3 block mt-0.5">
                {{ relativeTime(log.created_at) }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>
