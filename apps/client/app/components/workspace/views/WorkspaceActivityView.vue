<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Activity } from '@lucide/vue'
import type { createWorkspaceActivityController } from '~/composables/useWorkspaceActivity'
import { splitWorkspaceActivityDescription } from '~/utils/workspace-activity-presentation'

const props = defineProps<{ controller: ReturnType<typeof createWorkspaceActivityController> }>()
const c = props.controller
const loadMoreSentinel = ref<HTMLElement | null>(null)
const timeZone = ref<string | null>(null)
const busy = computed(() => c.loading.value || c.refreshing.value || c.loadingMore.value)
const activities = computed(() => c.items.value.map(activity => ({
  ...activity,
  descriptionParts: splitWorkspaceActivityDescription(activity)
})))
let mediaQuery: MediaQueryList | null = null
let observer: IntersectionObserver | null = null

const dateFormatter = computed(() => timeZone.value ? new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: timeZone.value
}) : null)
const formatTime = (value: string) => {
  if (!dateFormatter.value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Waktu tidak tersedia' : dateFormatter.value.format(date)
}
const syncMobile = (event?: MediaQueryListEvent) => c.setMobile(event?.matches ?? mediaQuery?.matches ?? false)
const refreshOnReturn = () => { if (document.visibilityState === 'visible') c.refreshIfStale() }

watch(loadMoreSentinel, (element, previous) => {
  if (previous) observer?.unobserve(previous)
  if (element) observer?.observe(element)
})

onMounted(() => {
  timeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  mediaQuery = window.matchMedia('(max-width: 1023px)')
  syncMobile()
  mediaQuery.addEventListener('change', syncMobile)
  document.addEventListener('visibilitychange', refreshOnReturn)
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !busy.value && !c.moreError.value && !c.mobileWindowFull.value) void c.loadMore()
    }, { rootMargin: '200px 0px' })
    if (loadMoreSentinel.value) observer.observe(loadMoreSentinel.value)
  }
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', syncMobile)
  document.removeEventListener('visibilitychange', refreshOnReturn)
  observer?.disconnect()
})
</script>

<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5" :aria-busy="busy">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="font-title-3 text-secondary-900">Aktivitas proyek</h2>
        <p class="mt-1 font-body-3 text-neutral-500">Perubahan pekerjaan, diskusi, dan keputusan proyek.</p>
      </div>
      <div class="flex items-center gap-2">
        <AtomicTag v-if="c.hasLoaded.value">{{ c.meta.value.total }} aktivitas</AtomicTag>
        <AtomicButton v-if="!c.error.value" variant="text-button" size="sm" :disabled="busy" @click="c.refresh">
          Perbarui
        </AtomicButton>
      </div>
    </div>

    <MoleculeLoading v-if="c.loading.value" label="Memuat aktivitas proyek…" />
    <div v-else-if="c.error.value" class="space-y-3 rounded-lg bg-danger-50 p-4" role="alert">
      <p class="font-body-2 text-danger-800">{{ c.error.value }}</p>
      <AtomicButton variant="outline" size="sm" @click="c.refresh">Coba lagi</AtomicButton>
    </div>
    <template v-else>
      <MoleculeLoading v-if="c.refreshing.value" compact label="Memperbarui aktivitas…" />
      <p v-if="c.refreshError.value" class="mb-3 rounded-lg bg-warning-50 p-3 font-body-3 text-warning-900" role="alert">
        Data terakhir belum berhasil diperbarui. {{ c.refreshError.value }}
      </p>
      <div v-if="c.items.value.length" class="divide-y divide-neutral-100">
        <article v-for="activity in activities" :key="activity.id" class="flex gap-3 py-4 first:pt-2">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700">
            <Activity class="h-4 w-4" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="break-words font-body-2 text-secondary-800">
              <strong class="font-label-3">{{ activity.actor.display_name }}</strong>
              {{ activity.descriptionParts.before }}<strong v-if="activity.descriptionParts.subject" class="font-semibold text-secondary-900">{{ activity.descriptionParts.subject }}</strong>{{ activity.descriptionParts.after }}
            </p>
            <time :datetime="activity.occurred_at" :title="timeZone ?? undefined" class="mt-1 block font-body-3 text-neutral-500">
              {{ formatTime(activity.occurred_at) }}
            </time>
          </div>
        </article>
      </div>
      <p v-else-if="c.hasLoaded.value" class="py-10 text-center font-body-2 text-neutral-500">
        Belum ada aktivitas yang tercatat untuk proyek ini.
      </p>

      <div v-if="c.hasLoaded.value && c.meta.value.total" class="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="font-body-3 text-neutral-500" aria-live="polite">
          Menampilkan <strong class="font-label-3 text-neutral-700">{{ c.rangeStart.value }}–{{ c.rangeEnd.value }}</strong>
          dari <strong class="font-label-3 text-neutral-700">{{ c.meta.value.total }}</strong> aktivitas
        </p>
        <MoleculePagination
          v-if="!c.isMobile.value && c.meta.value.total_pages > 1"
          :model-value="c.meta.value.page" :total-pages="c.meta.value.total_pages"
          :per-page="c.meta.value.limit" :disabled="busy" align="end" @update:model-value="c.setPage"
        />
      </div>
      <div v-if="c.isMobile.value && c.hasMore.value" ref="loadMoreSentinel" class="mt-4 flex flex-col items-center gap-2">
        <MoleculeLoading v-if="c.loadingMore.value" compact label="Memuat aktivitas lainnya…" />
        <template v-else>
          <p v-if="c.moreError.value" class="font-body-3 text-danger-800" role="alert">{{ c.moreError.value }}</p>
          <AtomicButton variant="text-button" :disabled="busy" @click="c.loadMore">
            {{ c.moreError.value ? 'Coba muat lagi' : c.mobileWindowFull.value ? 'Lihat aktivitas lebih lama' : 'Muat aktivitas lainnya' }}
          </AtomicButton>
        </template>
      </div>
    </template>
  </section>
</template>
