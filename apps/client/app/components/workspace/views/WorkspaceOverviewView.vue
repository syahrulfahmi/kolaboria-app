<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, ScanEye, UsersRound } from '@lucide/vue'
import type { WorkspaceOverviewViewModel } from '~/types/workspace-overview'
import type { WorkspaceOverviewController } from '~/composables/useWorkspaceOverview'
import { formatWorkspaceOverviewDate, formatWorkspaceOverviewTime } from '~/utils/workspace-overview'
import { splitWorkspaceActivityDescription } from '~/utils/workspace-activity-presentation'
import { projectWorkspacePath } from '~/utils/workspace-paths'
import { workspaceTaskBoardPath } from '~/utils/workspace-task-navigation'

const props = defineProps<{ controller: WorkspaceOverviewController }>()
const emit = defineEmits<{ navigate: [path: string] }>()
const statusLabels: Record<string, string> = { todo: 'Akan dikerjakan', in_progress: 'Dikerjakan', review: 'Perlu review', done: 'Selesai', closed: 'Ditutup' }
const statusTones: Record<string, 'default' | 'primary' | 'warning' | 'success' | 'danger'> = { todo: 'default', in_progress: 'primary', review: 'warning', done: 'success', closed: 'default' }
const isPreparing = (project: WorkspaceOverviewViewModel['project']) => project.status === 'open' || project.status === 'awaiting_owner'
const activityDescription = (activity: WorkspaceOverviewViewModel['recent_activities'][number]) => splitWorkspaceActivityDescription(activity)
const slug = computed(() => props.controller.data.value?.project.slug ?? '')
const tasksPath = (filter?: 'mine' | 'review') => workspaceTaskBoardPath(slug.value, { filter })
const taskPath = (taskId: string) => workspaceTaskBoardPath(slug.value, { taskId })
const viewPath = (view: 'discussion' | 'activity' | 'info') => projectWorkspacePath(slug.value, view)
</script>

<template>
  <section v-if="controller.loading.value && !controller.data.value" class="rounded-xl border border-neutral-200 bg-white">
    <MoleculeLoading label="Memuat ringkasan workspace…" />
  </section>

  <section v-else-if="controller.error.value && !controller.data.value" class="rounded-xl border border-neutral-200 bg-white p-8 text-center" role="alert">
    <AlertCircle class="mx-auto h-7 w-7 text-danger-600" aria-hidden="true" />
    <h2 class="mt-3 font-title-3 text-secondary-900">Ringkasan proyek belum dapat dimuat</h2>
    <p class="mt-2 font-body-2 text-neutral-600">{{ controller.error.value }}</p>
    <AtomicButton class="mt-4" variant="primary" size="sm" :disabled="controller.loading.value" @click="controller.refresh()">
      {{ controller.loading.value ? 'Memuat…' : 'Coba lagi' }}
    </AtomicButton>
  </section>

  <section v-else-if="controller.data.value" class="space-y-4 sm:space-y-5">
    <p v-if="controller.error.value" class="rounded-lg bg-warning-50 p-3 font-body-3 text-warning-900" role="status">Data belum berhasil diperbarui. {{ controller.error.value }}</p>

    <button
      v-if="controller.data.value.task_summary.review_tasks > 0"
      type="button"
      class="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-200 bg-primary-50/70 px-4 py-3 text-left transition-colors hover:bg-primary-50 sm:px-5"
      @click="emit('navigate', tasksPath('review'))"
    >
      <span class="flex items-start gap-3">
        <span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-primary-700"><ScanEye class="h-4 w-4" aria-hidden="true" /></span>
        <span><strong class="block font-label-2 text-primary-900">{{ controller.data.value.task_summary.review_tasks }} task menunggu review</strong><span class="font-body-3 text-secondary-700">Buka daftar review untuk melihat pekerjaan yang perlu ditindaklanjuti.</span></span>
      </span>
      <span class="rounded-lg border border-primary-200 bg-white px-3 py-2 font-label-3 text-primary-800">Buka tugas</span>
    </button>

    <div v-if="isPreparing(controller.data.value.project)" class="flex flex-col gap-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div class="flex gap-3"><UsersRound class="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" /><div><p class="font-label-2 text-accent-900">Workspace menunggu proyek dimulai</p><p class="mt-1 font-body-3 text-accent-900/80">Periksa informasi proyek dan kesiapan tim.</p></div></div>
      <AtomicButton variant="outline" size="sm" @click="emit('navigate', viewPath('info'))">Informasi proyek</AtomicButton>
    </div>

    <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <p class="font-body-3 text-neutral-500">Progres tugas</p><p class="mt-2 font-title-1 text-secondary-900">{{ controller.data.value.progress.percent === null ? '—' : `${controller.data.value.progress.percent}%` }}</p>
        <div class="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100"><div class="h-full rounded-full bg-primary-600 transition-[width]" :style="{ width: `${controller.data.value.progress.percent ?? 0}%` }" /></div>
        <p class="mt-2 font-body-3 text-neutral-500">{{ controller.data.value.progress.completed }} dari {{ controller.data.value.progress.denominator }} task yang belum ditutup</p>
      </section>
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5"><p class="font-body-3 text-neutral-500">Tugas berjalan</p><p class="mt-2 font-title-1 text-secondary-900">{{ controller.data.value.task_summary.in_progress_tasks }}</p><p class="mt-2 font-body-3 text-neutral-500">Sedang dikerjakan</p></section>
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5"><p class="font-body-3 text-neutral-500">Perlu review</p><p class="mt-2 font-title-1 text-secondary-900">{{ controller.data.value.task_summary.review_tasks }}</p><p class="mt-2 font-body-3 text-neutral-500">Menunggu tindak lanjut</p></section>
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5"><p class="font-body-3 text-neutral-500">Anggota tim</p><p class="mt-2 font-title-1 text-secondary-900">{{ controller.data.value.team_summary.active_member_count }}</p><p class="mt-2 font-body-3 text-neutral-500">Anggota aktif</p></section>
    </div>

    <div class="grid gap-4">
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div class="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3"><h2 class="font-title-3 text-secondary-900">Prioritas saya</h2><AtomicButton type="button" variant="text-button" size="sm" @click="emit('navigate', tasksPath('mine'))">Semua tugas</AtomicButton></div>
        <div v-if="controller.data.value.my_tasks.length" class="divide-y divide-neutral-100">
          <button v-for="task in controller.data.value.my_tasks.slice(0, 5)" :key="task.id" type="button" class="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-neutral-50" @click="emit('navigate', taskPath(task.id))">
            <span class="min-w-0"><span class="block truncate font-label-2 text-primary-800">{{ task.title }}</span><span class="mt-1 block font-body-3 text-neutral-500">Tenggat {{ formatWorkspaceOverviewDate(task.due_date) }}</span></span>
            <AtomicTag :variant="statusTones[task.status] ?? 'default'">{{ statusLabels[task.status] ?? task.status }}</AtomicTag>
          </button>
        </div>
        <p v-else class="py-8 text-center font-body-2 text-neutral-500">Tidak ada task aktif yang ditugaskan kepadamu.</p>
      </section>
    </div>

    <div class="grid gap-4 xl:grid-cols-[1.25fr_0.85fr]">
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div class="flex items-center justify-between border-b border-neutral-200 pb-3"><h2 class="font-title-3 text-secondary-900">Diskusi terbaru</h2><AtomicButton type="button" variant="text-button" size="sm" @click="emit('navigate', viewPath('discussion'))">Lihat diskusi</AtomicButton></div>
        <template v-if="controller.data.value.recent_discussions === null"><p class="py-6 text-center font-body-2 text-neutral-500">Diskusi tidak tersedia untuk akses proyek ini.</p></template>
        <template v-else-if="controller.data.value.recent_discussions.length"><NuxtLink v-for="discussion in controller.data.value.recent_discussions.slice(0, 2)" :key="discussion.id" :to="`/projects/${encodeURIComponent(controller.data.value.project.slug)}/workspace/discussions/${encodeURIComponent(discussion.id)}`" class="block w-full border-b border-neutral-100 py-3 last:border-0 hover:bg-neutral-50"><strong class="block font-label-2 text-secondary-900">{{ discussion.title }}</strong><span class="mt-1 block font-body-3 text-neutral-500">{{ discussion.author.name }} · {{ formatWorkspaceOverviewTime(discussion.last_activity_at) }}</span></NuxtLink></template>
        <p v-else class="py-6 text-center font-body-2 text-neutral-500">Belum ada diskusi proyek.</p>
      </section>
      <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div class="flex items-center justify-between border-b border-neutral-200 pb-3"><h2 class="font-title-3 text-secondary-900">Aktivitas terkini</h2><AtomicButton type="button" variant="text-button" size="sm" @click="emit('navigate', viewPath('activity'))">Lihat semua</AtomicButton></div>
        <div v-for="activity in controller.data.value.recent_activities.slice(0, 3)" :key="activity.id" class="border-b border-neutral-100 py-3 last:border-0"><p class="font-body-2 text-secondary-800"><strong class="font-label-3">{{ activity.actor.display_name }}</strong> {{ activityDescription(activity).before }}<strong v-if="activityDescription(activity).subject" class="font-label-3">{{ activityDescription(activity).subject }}</strong>{{ activityDescription(activity).after }}</p><span class="font-body-3 text-neutral-500">{{ formatWorkspaceOverviewTime(activity.occurred_at) }}</span></div>
        <p v-if="!controller.data.value.recent_activities.length" class="py-6 text-center font-body-2 text-neutral-500">Aktivitas proyek akan muncul di sini.</p>
      </section>
    </div>
  </section>
</template>
