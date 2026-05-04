<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Project, ProjectType } from '../../types/project'

definePageMeta({
  layout: 'home'
})

useHead({ title: 'Jelajahi Project — Kolaboria' })

const { getProjects } = useProjects()

const search = ref('')
const filterType = ref<ProjectType | ''>('')
const filterStatus = ref('')
const isLoading = ref(false)
const isLoadingMore = ref(false)
const projects = ref<Project[]>([])
const fetchError = ref('')
const hasMore = ref(true)

const limit = 12

const fetchProjects = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    isLoading.value = true
  }

  fetchError.value = ''

  try {
    const currentLimit = isLoadMore ? projects.value.length + limit : limit

    const newProjects = await getProjects({
      search: search.value || undefined,
      type: filterType.value || undefined,
      status: (filterStatus.value as any) || undefined,
      limit: currentLimit
    })

    projects.value = newProjects
    hasMore.value = newProjects.length === currentLimit
  } catch (e: any) {
    fetchError.value = e?.message || 'Gagal memuat project.'
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

// Debounced search
let debounceTimer: ReturnType<typeof setTimeout>
const handleSearch = (val: string) => {
  search.value = val
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchProjects(false), 350)
}

const handleFilterType = (val: ProjectType | '') => {
  filterType.value = val
  fetchProjects(false)
}

const handleFilterStatus = (val: string) => {
  filterStatus.value = val
  fetchProjects(false)
}

const loadMore = () => {
  fetchProjects(true)
}

const { data: initialProjects } = await useAsyncData('projects-listing', () =>
  getProjects({ limit })
)
projects.value = initialProjects.value ?? []
hasMore.value = projects.value.length === limit

onMounted(() => {
  fetchProjects(false)
})

const openProjectsCount = computed(
  () => projects.value.filter((p) => p.status === 'open').length
)
const inProgressProjectsCount = computed(
  () => projects.value.filter((p) => p.status === 'in_progress').length
)

const activeFiltersText = computed(() => {
  const parts = []
  if (filterStatus.value) {
    parts.push(filterStatus.value === 'open' ? 'Open' : 'In Progress')
  }
  if (filterType.value) {
    parts.push(
      filterType.value
        .replace('_', ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    )
  }
  return parts.length > 0 ? parts.join(', ') : 'Semua Project'
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <!-- Hero Banner -->
    <div
      class="mb-10 flex flex-col items-start justify-between gap-8 rounded-3xl bg-secondary-900 px-8 py-10 text-white sm:flex-row sm:items-center sm:px-12 sm:py-16 shadow-2xl shadow-secondary-900/20 relative overflow-hidden"
    >
      <!-- Decorative background elements -->
      <div
        class="absolute -right-20 -top-40 h-96 w-96 rounded-full bg-primary-600/30 blur-[100px] pointer-events-none"
      ></div>
      <div
        class="absolute -left-20 -bottom-40 h-80 w-80 rounded-full bg-accent-600/20 blur-[80px] pointer-events-none"
      ></div>
      <div
        class="absolute right-1/4 top-1/2 -translate-y-1/2 text-[180px] font-black text-white/5 tracking-tighter pointer-events-none select-none"
      >
        DISCOVER
      </div>

      <div class="relative z-10 max-w-2xl">
        <p
          class="text-caption font-bold uppercase tracking-widest text-primary-400 mb-4 flex items-center gap-2"
        >
          Project Hub
        </p>
        <h1
          class="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-tight"
        >
          Jelajahi Peluang <br class="hidden sm:block" /><span
            class="text-primary-400"
            >Kolaborasi</span
          >
        </h1>
        <p class="mt-6 text-body text-neutral-300 max-w-lg leading-relaxed">
          Temukan project open-source maupun komersial dan mulai bangun
          portfolio nyata bersama talenta terbaik Indonesia.
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="sticky top-20 z-40 mb-6">
      <ProjectFilterBar
        @search="handleSearch"
        @filter-type="handleFilterType"
        @filter-status="handleFilterStatus"
      />
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col h-[320px] animate-pulse"
      >
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-xl bg-neutral-200 shrink-0"></div>
          <div class="flex-1">
            <div class="h-4 bg-neutral-200 rounded-md w-2/3 mb-2"></div>
            <div class="h-3 bg-neutral-200 rounded-md w-1/3"></div>
          </div>
        </div>
        <div class="space-y-3 mb-6 flex-1">
          <div class="h-4 bg-neutral-200 rounded-md w-full"></div>
          <div class="h-4 bg-neutral-200 rounded-md w-5/6"></div>
          <div class="h-4 bg-neutral-200 rounded-md w-4/6"></div>
        </div>
        <div class="flex gap-2 mb-6">
          <div class="h-6 bg-neutral-200 rounded-md w-16"></div>
          <div class="h-6 bg-neutral-200 rounded-md w-20"></div>
        </div>
        <div
          class="border-t border-neutral-100 pt-4 flex justify-between items-center mt-auto"
        >
          <div class="flex gap-1">
            <div class="w-8 h-8 rounded-full bg-neutral-200"></div>
            <div
              class="w-8 h-8 rounded-full bg-neutral-200 -ml-2 border-2 border-white"
            ></div>
          </div>
          <div class="h-8 bg-neutral-200 rounded-lg w-24"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <MoleculeTicker
      v-else-if="fetchError"
      variant="danger"
      :message="fetchError"
      :closable="false"
      class="mb-6"
    />

    <!-- Empty State -->
    <div
      v-else-if="projects.length === 0"
      class="py-20 flex flex-col items-center justify-center text-center"
    >
      <div
        class="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-400"
      >
        <svg
          class="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      </div>
      <h3 class="text-heading font-bold text-secondary-900 mb-2">
        Tidak ada project yang cocok
      </h3>
      <p class="text-body text-neutral-500 max-w-md mb-8">
        Coba ubah kata kunci atau hapus beberapa filter untuk menemukan project
        yang kamu cari.
      </p>
      <div class="flex gap-4">
        <AtomicButton
          variant="outline"
          @click="
            () => {
              search = ''
              filterStatus = ''
              filterType = ''
              handleSearch('')
            }
          "
        >
          Reset Pencarian
        </AtomicButton>
        <AtomicButton variant="primary" to="/projects/create">
          Buat Project Baru
        </AtomicButton>
      </div>
    </div>

    <!-- Project Grid -->
    <div v-else>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="mt-12 flex justify-center">
        <AtomicButton
          variant="outline"
          :disabled="isLoadingMore"
          @click="loadMore"
          class="min-w-[200px] border-neutral-300 hover:bg-neutral-50"
        >
          <span v-if="isLoadingMore" class="flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Memuat...
          </span>
          <span v-else class="font-semibold">Muat Lebih Banyak</span>
        </AtomicButton>
      </div>
    </div>
  </div>
</template>
