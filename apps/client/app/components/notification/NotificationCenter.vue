<script setup lang="ts">
import { NotificationService } from '~/services/notification.service'
import type { AppNotification } from '~/types/notification'

const router = useRouter()
const notifications = ref<AppNotification[]>([])
const open = ref(false)
const loading = ref(false)
const unreadCount = computed(() => notifications.value.filter((item) => !item.read_at).length)

const load = async () => {
  loading.value = true
  try { notifications.value = await NotificationService.list() } finally { loading.value = false }
}
const toggle = async () => {
  open.value = !open.value
  if (open.value && !notifications.value.length) await load()
}
const openNotification = async (item: AppNotification) => {
  if (!item.read_at) {
    await NotificationService.markRead(item.id)
    item.read_at = new Date().toISOString()
  }
  open.value = false
  if (item.type === 'experience.finalized' && item.payload.experience_slug && item.payload.username) {
    router.push(`/profile/me/experiences/${item.payload.experience_slug}`)
    return
  }
  const slug = item.payload.slug || item.project_id
  if (slug) router.push(`/projects/${slug}/workspace`)
}
onMounted(load)
</script>

<template>
  <div class="relative">
    <button type="button" class="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-secondary-700" aria-label="Notifikasi" @click="toggle">
      <span v-if="unreadCount" class="absolute right-1.5 top-1.5 min-w-4 rounded-full bg-danger-500 px-1 text-center text-[10px] leading-4 text-white ring-2 ring-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    </button>
    <div v-if="open" class="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
      <div class="flex items-center justify-between"><p class="font-label-1 text-secondary-900">Notifikasi</p><button type="button" class="font-label-2 text-primary-700" @click="load">Muat ulang</button></div>
      <p v-if="loading" class="py-5 text-center font-body-3 text-neutral-500">Memuat...</p>
      <p v-else-if="!notifications.length" class="py-5 text-center font-body-3 text-neutral-500">Belum ada notifikasi.</p>
      <ul v-else class="mt-2 max-h-80 space-y-1 overflow-y-auto"><li v-for="item in notifications" :key="item.id"><button type="button" class="w-full rounded-lg p-3 text-left transition-colors hover:bg-neutral-50" :class="item.read_at ? 'text-neutral-500' : 'bg-primary-50 text-secondary-900'" @click="openNotification(item)"><p class="font-label-2">{{ item.type === 'experience.finalized' ? 'Rekam kontribusi siap ditinjau' : 'Project selesai' }}</p><p class="mt-1 font-body-3">{{ item.payload.message || 'Project telah diselesaikan.' }}</p></button></li></ul>
    </div>
  </div>
</template>
