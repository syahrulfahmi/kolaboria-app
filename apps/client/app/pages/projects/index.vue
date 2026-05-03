<script setup lang="ts">
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
    // Basic pagination simulation: just limit + offset or just increase limit.
    // For now we just load total limit if it's load more.
    const currentLimit = isLoadMore ? projects.value.length + limit : limit

    const newProjects = await getProjects({
      search: search.value || undefined,
      type: filterType.value || undefined,
      status: (filterStatus.value as any) || undefined,
      limit: currentLimit
    })

    projects.value = newProjects

    // Check if we have more records (simple approach: if returned length equals our requested limit)
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

// For hero stats
const totalProjects = computed(() => projects.value.length)
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <!-- Hero Banner -->
    <div
      class="mb-10 flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary-900 px-8 py-10 text-white sm:flex-row sm:items-center sm:px-12 sm:py-14 shadow-xl shadow-primary-900/20 relative overflow-hidden"
    >
      <!-- Decorative background element -->
      <div
        class="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-primary-800/50 blur-3xl"
      ></div>

      <div class="relative z-10 max-w-2xl">
        <p
          class="text-caption font-semibold uppercase tracking-wider text-primary-300"
        >
          Project Hub
        </p>
        <h1
          class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Jelajahi Peluang <br class="hidden sm:block" />Kolaborasi
        </h1>
        <p class="mt-4 text-body text-primary-100">
          Temukan project open-source maupun komersial dan mulai bangun
          portfolio nyata bersama talenta terbaik Indonesia.
        </p>
        <div class="mt-8 flex items-center gap-4">
          <AtomicButton
            variant="primary"
            to="/projects/create"
            class="bg-white text-primary-900 hover:bg-neutral-50 shadow-sm ring-white"
          >
            Buat Project Baru
          </AtomicButton>
        </div>
      </div>

      <!-- Stats -->
      <div
        class="relative z-10 flex w-full flex-col gap-4 sm:w-auto sm:min-w-[200px]"
      >
        <div
          class="rounded-2xl border border-primary-700/50 bg-primary-800/30 p-5 backdrop-blur-md"
        >
          <p class="text-3xl font-bold text-white">
            {{ totalProjects }}{{ hasMore ? '+' : '' }}
          </p>
          <p class="text-caption font-medium text-primary-200">
            Project Terbuka
          </p>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div
      class="sticky top-20 z-20 mb-8 rounded-2xl bg-white/80 p-2 backdrop-blur-xl shadow-sm border border-neutral-200/60"
    >
      <ProjectFilterBar
        @search="handleSearch"
        @filter-type="handleFilterType"
        @filter-status="handleFilterStatus"
      />
    </div>

    <!-- Loading State -->
    <MoleculeLoading v-if="isLoading" text="Memuat project..." class="py-16" />

    <!-- Error State -->
    <MoleculeTicker
      v-else-if="fetchError"
      variant="danger"
      :message="fetchError"
      :closable="false"
      class="mb-6"
    />

    <!-- Empty State -->
    <OrganismEmptyState
      v-else-if="projects.length === 0"
      title="Tidak ada project yang cocok"
      description="Coba ubah kata kunci atau filter untuk menemukan project. Atau jadilah yang pertama membuat project dengan kriteria ini!"
      class="border border-dashed border-neutral-300 py-16"
    >
      <template #action>
        <AtomicButton variant="primary" to="/projects/create">
          Mulai Project Baru
        </AtomicButton>
      </template>
    </OrganismEmptyState>

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
          class="min-w-[200px]"
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
          <span v-else>Muat Lebih Banyak</span>
        </AtomicButton>
      </div>
    </div>
  </div>
</template>
