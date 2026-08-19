<script setup lang="ts">
import type { ContributionSnapshot, FinalizationStatus, MemberProfile } from '~/types/workspace'
const props = defineProps<{ snapshots: ContributionSnapshot[]; members?: MemberProfile[]; status?: FinalizationStatus | null }>()
const emit = defineEmits<{ refresh: [] }>()
const profileLabel = (profileId: string) => {
  const member = props.members?.find((item) => item.id === profileId)
  return member?.full_name || member?.username || profileId
}
</script>

<template>
  <section class="space-y-3" aria-labelledby="contribution-title">
    <div class="flex items-center justify-between gap-3">
      <div><p class="font-label-1 uppercase tracking-wide text-neutral-500">Ringkasan kontribusi</p><h3 id="contribution-title" class="mt-1 font-title-3 text-secondary-900">Snapshot</h3></div>
      <div class="flex items-center gap-2">
        <AtomicTag v-if="status && status.status !== 'succeeded'" variant="warning">{{ status.status === 'failed' ? 'Perlu retry' : 'Memproses' }}</AtomicTag>
        <button v-if="status && status.status !== 'succeeded'" type="button" class="font-label-2 text-primary-700 hover:text-primary-800" @click="emit('refresh')">Refresh</button>
      </div>
    </div>
    <p v-if="status?.status === 'failed'" class="rounded-lg bg-danger-50 px-3 py-2 font-body-3 text-danger-700">Snapshot belum selesai dibuat. Muat ulang beberapa saat lagi.</p>
    <div v-if="!snapshots.length" class="rounded-xl border border-dashed border-neutral-300 px-4 py-5 text-center font-body-3 text-neutral-500">Ringkasan kontribusi akan muncul setelah finalisasi selesai.</div>
    <ul v-else class="grid gap-3 sm:grid-cols-2">
      <li v-for="item in snapshots" :key="item.id" class="rounded-xl border border-neutral-200 bg-white p-3">
        <p class="font-label-2 text-secondary-900">{{ profileLabel(item.profile_id) }}</p>
        <div class="mt-2 grid grid-cols-2 gap-2 font-body-3 text-neutral-600"><span>{{ item.completed_task_count }}/{{ item.assigned_task_count }} task</span><span>{{ item.comment_count }} komentar</span><span>{{ item.activity_count }} aktivitas</span><span>{{ item.deliverable_count }} deliverable</span></div>
      </li>
    </ul>
  </section>
</template>
