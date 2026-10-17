<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { WorkspaceProjectInfoViewModel } from '~/types/workspace-info'

const props = defineProps<{
  info: WorkspaceProjectInfoViewModel
  reviewing: boolean
  error: string | null
}>()
const emit = defineEmits<{ review: []; refresh: [] }>()
const openTaskBoard = () => navigateTo(`/projects/${encodeURIComponent(props.info.project.slug)}/workspace/tasks`)
const completion = computed(() => props.info.closure?.completion ?? null)
const summary = computed(() => completion.value?.task_summary ?? props.info.closure?.task_summary ?? null)
const eligibleTaskCount = computed(() => summary.value
  ? summary.value.done_tasks + summary.value.closed_tasks - summary.value.invalid_closed_tasks : 0)
const progress = computed(() => summary.value && summary.value.total_tasks > 0
  ? Math.round(eligibleTaskCount.value / summary.value.total_tasks * 100) : 0)
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const completedAt = computed(() => {
  if (!completion.value || !mounted.value) return ''
  const date = new Date(completion.value.completed_at)
  return Number.isNaN(date.getTime()) ? 'Waktu tidak tersedia'
    : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
})
</script>

<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 lg:col-start-2 lg:row-start-1">
    <div class="flex items-center justify-between gap-2">
      <h2 class="font-title-3 text-secondary-900">Penutupan proyek</h2>
      <AtomicTag v-if="info.project.status === 'completed'" variant="success">Selesai</AtomicTag>
    </div>
    <p class="mt-1.5 font-body-2 text-neutral-600">
      Owner meninjau hasil setelah seluruh task selesai atau ditutup dengan alasan perubahan scope.
    </p>
    <template v-if="info.closure && summary">
      <div class="mt-4 space-y-2 rounded-lg bg-neutral-50 p-3">
        <div class="flex items-center justify-between gap-2 font-body-3 text-neutral-700">
          <span>Task memenuhi syarat</span>
          <span class="font-label-3 text-secondary-800">{{ eligibleTaskCount }} / {{ summary.total_tasks }}</span>
        </div>
        <p class="font-body-3 text-neutral-700">{{ summary.done_tasks }} task selesai.</p>
        <div v-if="summary.total_tasks" role="progressbar" aria-label="Task memenuhi syarat penutupan" :aria-valuenow="progress" :aria-valuemin="0" :aria-valuemax="100" class="h-2 overflow-hidden rounded-full bg-neutral-200">
          <div class="h-full rounded-full bg-success-500" :style="{ width: `${progress}%` }" />
        </div>
        <p v-if="summary.outstanding_tasks" class="font-body-3 text-neutral-600">{{ summary.outstanding_tasks }} task masih perlu diselesaikan atau ditinjau.</p>
        <p v-else-if="summary.total_tasks && info.closure.eligible" class="font-body-3 text-success-700">Seluruh task memenuhi syarat penutupan.</p>
        <p v-else-if="!summary.total_tasks" class="font-body-3 text-neutral-600">Belum ada task terstruktur. Dasar review dan keterbatasan bukti perlu dijelaskan saat penutupan.</p>
        <p v-if="summary.closed_tasks" class="font-body-3 text-neutral-500">{{ summary.closed_tasks }} task ditutup karena perubahan scope dan tidak dihitung sebagai hasil selesai.</p>
        <p v-if="summary.deleted_tasks" class="font-body-3 text-neutral-500">{{ summary.deleted_tasks }} task dihapus dan dikecualikan dari peninjauan.</p>
        <p v-if="summary.invalid_closed_tasks" class="font-body-3 text-danger-700">{{ summary.invalid_closed_tasks }} task ditutup tanpa alasan scope yang valid. Perbaiki melalui task board sebelum menutup proyek.</p>
      </div>
      <div v-if="completion" class="mt-4 space-y-3 border-t border-neutral-100 pt-4">
        <p class="font-body-3 text-neutral-500">Ditutup oleh owner<template v-if="completedAt"> · {{ completedAt }}</template></p>
        <div>
          <h3 class="font-label-2 text-secondary-900">Ringkasan hasil</h3>
          <p class="mt-1 whitespace-pre-line break-words font-body-2 text-neutral-600">{{ completion.result_summary }}</p>
        </div>
        <div v-if="completion.review_basis">
          <h3 class="font-label-2 text-secondary-900">Dasar review dan batasan</h3>
          <p class="mt-1 whitespace-pre-line break-words font-body-2 text-neutral-600">{{ completion.review_basis }}</p>
        </div>
      </div>
      <p v-else-if="info.project.status === 'completed'" class="mt-4 font-body-3 text-neutral-500">Proyek telah selesai. Rincian keputusan penutupan sebelumnya belum tercatat.</p>
      <div v-else-if="info.project.status === 'in_progress'" class="mt-4 border-t border-neutral-100 pt-4">
        <div class="grid gap-3">
          <AtomicButton
            v-if="info.canCompleteProject"
            variant="primary"
            size="sm"
            block
            :loading="reviewing"
            :disabled="reviewing || !info.closure.eligible"
            @click="emit('review')"
          >
            Tinjau penutupan
          </AtomicButton>
          <p v-else class="font-body-3 text-neutral-500">Penutupan proyek dilakukan oleh owner.</p>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <AtomicButton
              v-if="!info.closure.eligible"
              variant="text-button"
              size="sm"
              class="min-h-9"
              :disabled="reviewing"
              @click="openTaskBoard"
            >
              Tinjau task proyek
            </AtomicButton>
            <AtomicButton
              variant="text-button"
              size="sm"
              class="min-h-9"
              :disabled="reviewing"
              @click="emit('refresh')"
            >
              Perbarui ringkasan
            </AtomicButton>
          </div>
        </div>
      </div>
      <p v-else class="mt-4 font-body-3 text-neutral-500">{{ info.project.status === 'archived' ? 'Proyek diarsipkan. Penutupan sebagai proyek selesai tidak tersedia.' : 'Penutupan tersedia setelah proyek dimulai.' }}</p>
    </template>
    <div v-else class="mt-4 space-y-3 rounded-lg bg-neutral-50 p-3">
      <p class="font-body-3 text-neutral-600">
        Data penutupan proyek belum tersedia. Informasi proyek dan kesiapan peran tetap dapat dilihat.
      </p>
      <AtomicButton variant="text-button" size="sm" :disabled="reviewing" @click="emit('refresh')">
        Muat ulang informasi
      </AtomicButton>
    </div>
    <p v-if="error" role="alert" class="mt-3 font-body-3 text-danger-700">{{ error }}</p>
  </section>
</template>
