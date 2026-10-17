<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
import type { WorkspaceTaskDTO, WorkspaceTaskStatus } from '~/types/workspace-task'

const props = defineProps<{
  status: WorkspaceTaskStatus
  title: string
  tasks: WorkspaceTaskDTO[]
  total: number
  canLoadMore: boolean
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  open: [taskId: string]
  move: [taskId: string, status: WorkspaceTaskStatus]
  loadMore: []
  retry: []
}>()

const list = ref<HTMLElement | null>(null)
const renderVersion = ref(0)
const dateLabel = (value: string | null) => {
  if (!value) return 'Tanpa tenggat'
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}
const priorityLabel = (value: string) => ({ low: 'Rendah', medium: 'Sedang', high: 'Tinggi' }[value] ?? value)
const canDropOnStatus = (taskElement: HTMLElement, status?: string) =>
  Boolean(status && (taskElement.dataset.taskAllowedTransitions ?? '').split(',').includes(status))

useDraggable(list, {
  group: {
    name: 'workspace-live-task-status',
    pull: true,
    put: (target, _source, dragged) => canDropOnStatus(dragged, target.el.dataset.taskStatus)
  },
  draggable: '[data-task-draggable="true"]',
  sort: false,
  animation: 160,
  delay: 120,
  delayOnTouchOnly: true,
  touchStartThreshold: 4,
  onEnd: (event) => {
    const taskId = event.item.dataset.taskId
    const status = event.to.dataset.taskStatus as WorkspaceTaskStatus | undefined
    if (event.from !== event.to && taskId && canDropOnStatus(event.item, status)) {
      emit('move', taskId, status as WorkspaceTaskStatus)
    }
    void nextTick(() => { renderVersion.value++ })
  }
})
</script>

<template>
  <section class="isolate flex min-h-[390px] min-w-0 flex-col rounded-xl border border-neutral-300 bg-white p-3" :aria-label="`Kolom ${title}`">
    <div class="sticky top-0 z-10 -mx-2.5 -mt-2.5 flex items-center justify-between gap-2 rounded-t-xl border-b border-primary-200 bg-primary-50 px-3 pb-2.5 pt-3">
      <h2 class="font-label-2 text-secondary-900">{{ title }}</h2>
      <span class="font-label-3 text-neutral-500">{{ total }}</span>
    </div>
    <div ref="list" class="mt-3 flex flex-1 flex-col gap-3" :data-task-status="status" role="list" :aria-label="`${title}, ${total} task`">
      <article v-for="task in tasks" :key="`${renderVersion}-${task.id}`" :data-task-id="task.id" :data-task-allowed-transitions="task.permissions.allowed_transitions.join(',')" :data-task-draggable="task.permissions.allowed_transitions.length ? 'true' : 'false'" role="listitem" class="workspace-task-card w-full min-w-0 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:border-primary-300 hover:shadow-md" :class="task.permissions.allowed_transitions.length ? 'cursor-grab active:cursor-grabbing' : ''">
        <button type="button" class="block w-full text-left focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" :class="task.permissions.allowed_transitions.length ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'" @click="emit('open', task.id)">
            <h3 class="break-words font-label-2 leading-snug text-secondary-900">{{ task.title }}</h3>
            <p v-if="task.description_preview" class="mt-1.5 line-clamp-2 font-body-3 text-neutral-500">{{ task.description_preview }}</p>
            <AtomicTag class="mt-2" :variant="task.priority === 'high' ? 'danger' : task.priority === 'low' ? 'default' : 'warning'">Prioritas {{ priorityLabel(task.priority).toLowerCase() }}</AtomicTag>
            <div class="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 font-body-3 text-neutral-600">
              <span class="inline-flex min-w-0 items-center gap-1.5">
                <AtomicAvatar v-if="task.assignee" :name="task.assignee.name" :src="task.assignee.avatar ?? undefined" :size="'xs'" />
                <span class="truncate">{{ task.assignee?.name ?? 'Belum ditentukan' }}<span v-if="task.needs_reassignment"> · perlu penugasan ulang</span></span>
              </span>
              <span class="text-neutral-500">{{ dateLabel(task.due_date) }}</span>
            </div>
            <p v-if="task.status === 'closed' && task.close_reason" class="mt-2 line-clamp-2 rounded-md bg-neutral-50 px-2 py-1.5 font-body-3 text-neutral-500">Alasan: {{ task.close_reason }}</p>
            <span class="mt-2 block font-body-3 text-neutral-500">{{ task.comment_count }} komentar · Lihat detail</span>
        </button>
      </article>
      <p v-if="!tasks.length && !loading && !error" class="rounded-lg border border-dashed border-neutral-300 px-3 py-7 text-center font-body-3 text-neutral-500">Belum ada task</p>
      <p v-if="error" class="rounded-lg bg-danger-50 p-3 font-body-3 text-danger-800" role="alert">{{ error }} <button type="button" class="ml-1 underline" @click="emit('retry')">Coba lagi</button></p>
      <MoleculeLoading v-if="canLoadMore && loading" compact label="Memuat task…" class="self-center" />
      <AtomicButton v-else-if="canLoadMore" variant="outline" size="sm" @click="emit('loadMore')">Muat task lainnya</AtomicButton>
    </div>
  </section>
</template>

