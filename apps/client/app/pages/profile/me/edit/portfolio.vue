<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile } from '~/types/profile'

const props = defineProps<{
  profile: Profile
  completedProjects: any[]
  pinnedProjectIds: string[]
}>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()

const { pinProject, unpinProject } = usePortfolio()
const { add: addToast } = useToast()

const isActionLoading = ref(false)

const isPinLimitReached = computed(() => props.pinnedProjectIds.length >= 10)

const isPinned = (projectId: string) => {
  return props.pinnedProjectIds.includes(projectId)
}

const handleTogglePin = async (project: any) => {
  const projectId = project.id
  const currentlyPinned = isPinned(projectId)

  if (!currentlyPinned && isPinLimitReached.value) {
    addToast({
      variant: 'warning',
      title: 'Batas Pin Tercapai',
      message: 'Kamu hanya bisa menge-pin maksimal 10 karya unggulan.'
    })
    return
  }

  isActionLoading.value = true
  try {
    if (currentlyPinned) {
      await unpinProject(projectId)
      addToast({
        variant: 'success',
        title: 'Pin dicabut',
        message: `Karya "${project.title}" dilepas dari unggulan.`
      })
    } else {
      await pinProject(projectId, props.pinnedProjectIds.length)
      addToast({
        variant: 'success',
        title: 'Karya di-pin',
        message: `Karya "${project.title}" dipajang di unggulan.`
      })
    }
    emit('refresh')
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Aksi gagal',
      message: err.message || 'Gagal mengubah status karya unggulan.'
    })
  } finally {
    isActionLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/profile/me')
}

const handleDone = () => {
  router.push('/profile/me')
}

const isDirty = computed(() => false)
const isSaving = computed(() => isActionLoading.value)

defineExpose({
  isDirty,
  isSaving,
  handleSave: handleDone,
  handleCancel
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- PORTFOLIO SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div
        class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <p class="font-title-2 text-primary-700">Portofolio</p>
          <h2 class="mt-1 font-title-3">Karya Unggulan</h2>
        </div>
        <AtomicTag> {{ pinnedProjectIds.length }} / 10 Pinned </AtomicTag>
      </div>

      <p class="font-paragraph-2 mb-6 leading-relaxed">
        Pilih proyek/karya yang ingin kamu tonjolkan di halaman depan profil
        kamu. Karya ini akan tampil sebagai portofolio unggulan di bagian
        sidebar.
      </p>

      <div v-if="completedProjects.length > 0" class="grid gap-3">
        <div
          v-for="proj in completedProjects"
          :key="proj.id"
          class="flex items-center justify-between gap-4 rounded-xl border p-4 transition-all"
          :class="[
            isPinned(proj.id)
              ? 'border-primary-300 bg-primary-50/40 shadow-sm'
              : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50'
          ]"
        >
          <div class="min-w-0 flex-1">
            <h3 class="font-body-1 truncate">{{ proj.title }}</h3>
            <p
              v-if="proj.summary"
              class="font-paragraph-2 text-neutral-500 line-clamp-1 mt-0.5"
            >
              {{ proj.summary }}
            </p>
          </div>

          <div class="shrink-0 flex items-center">
            <AtomicSwitch
              :model-value="isPinned(proj.id)"
              :disabled="isActionLoading"
              @update:model-value="handleTogglePin(proj)"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8"
      >
        <svg
          class="w-12 h-12 text-neutral-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p class="text-body font-bold text-neutral-700">
          Belum ada project selesai
        </p>
        <p class="text-caption text-neutral-500 max-w-sm mt-1">
          Karya unggulan diambil dari proyek kolaborasi di Kolaboria yang telah
          selesai dikerjakan.
        </p>
      </div>
    </section>
  </div>
</template>
