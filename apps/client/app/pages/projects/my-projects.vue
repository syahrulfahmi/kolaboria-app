<script setup lang="ts">
import type { Project } from '~/types/project'
import ProjectOwnerCard from '~/components/project/ProjectOwnerCard.vue'

definePageMeta({ layout: 'home', middleware: 'auth' })

const { getMyProjects, getProjectApplicants } = useProjects()

const { data: projects, pending } = await useAsyncData<Project[]>(
  'my-projects',
  () => getMyProjects()
)

// Store applicant counts per project ID
const applicantCounts = ref<Record<string, number>>({})

// Fetch pending applicant counts
onMounted(async () => {
  if (projects.value && projects.value.length > 0) {
    const counts: Record<string, number> = {}
    await Promise.all(
      projects.value.map(async (project) => {
        try {
          const applicants = await getProjectApplicants(project.id)
          counts[project.id] = applicants.filter(
            (a) => a.status === 'pending'
          ).length
        } catch (e) {
          counts[project.id] = 0
        }
      })
    )
    applicantCounts.value = counts
  }
})

const stats = computed(() => {
  const p = projects.value || []
  return {
    total: p.length,
    draft: p.filter((x) => x.status === 'draft').length,
    active: p.filter((x) => ['open', 'in_progress'].includes(x.status)).length,
    completed: p.filter((x) => x.status === 'completed').length,
    archived: p.filter((x) => x.status === 'archived').length
  }
})

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Aktif', value: 'active' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Arsip', value: 'archived' }
]

const selectedFilter = ref('all')

const filteredProjects = computed(() => {
  let result = projects.value || []

  if (selectedFilter.value !== 'all') {
    if (selectedFilter.value === 'active') {
      result = result.filter((p) => ['open', 'in_progress'].includes(p.status))
    } else {
      result = result.filter((p) => p.status === selectedFilter.value)
    }
  }

  return result
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pb-20 overflow-x-hidden">
    <!-- ─── HEADER ─── -->
    <OrganismCard>
      <div class="max-w-7xl mx-auto relative z-10">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div class="flex flex-col gap-1">
            <h1
              class="text-display font-black text-secondary-900 tracking-tight"
            >
              Project Saya
            </h1>
            <p class="text-lg text-neutral-500">
              Kelola project dan pantau kandidat yang melamar
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div
              class="inline-flex items-center gap-2.5 px-5 py-2.5 bg-primary-50 rounded-full border border-primary-100"
            >
              <span
                class="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"
              ></span>
              <span class="font-bold text-primary-700 text-sm tracking-wide"
                >{{ stats.total }} Project</span
              >
            </div>

            <NuxtLink to="/projects/create">
              <AtomicButton variant="primary" class="w-full sm:w-auto">
                <span class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Buat Project Baru
                </span>
              </AtomicButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </OrganismCard>

    <!-- ─── MAIN CONTENT ─── -->
    <main class="max-w-7xl mx-auto py-8">
      <!-- ─── LOADING STATE ─── -->
      <MoleculeLoading v-if="pending" label="Memuat project..." class="py-16" />

      <template v-else>
        <!-- ─── STATISTICS GRID ─── -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <!-- Draft -->
          <div
            class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-neutral-300 transition-colors"
          >
            <h3
              class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 relative z-10"
            >
              Draft
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-neutral-700 leading-none">{{
                stats.draft
              }}</span>
            </div>
          </div>

          <!-- Aktif -->
          <div
            class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-success-200 transition-colors"
          >
            <div
              class="absolute right-0 top-0 w-24 h-24 bg-success-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
            ></div>
            <h3
              class="text-xs font-bold text-success-600/70 uppercase tracking-wider mb-2 relative z-10"
            >
              Aktif
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-success-700 leading-none">{{
                stats.active
              }}</span>
            </div>
          </div>

          <!-- Selesai -->
          <div
            class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-primary-200 transition-colors"
          >
            <div
              class="absolute right-0 top-0 w-24 h-24 bg-primary-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
            ></div>
            <h3
              class="text-xs font-bold text-primary-600/70 uppercase tracking-wider mb-2 relative z-10"
            >
              Selesai
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-primary-700 leading-none">{{
                stats.completed
              }}</span>
            </div>
          </div>

          <!-- Arsip -->
          <div
            class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-neutral-300 transition-colors"
          >
            <h3
              class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 relative z-10"
            >
              Diarsipkan
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-neutral-500 leading-none">{{
                stats.archived
              }}</span>
            </div>
          </div>
        </div>

        <!-- ─── FILTER ─── -->
        <div
          class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar"
        >
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
              selectedFilter === filter.value
                ? 'bg-secondary-900 text-white border-secondary-900 shadow-md'
                : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- ─── PROJECTS GRID ─── -->
        <div
          v-if="filteredProjects.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ProjectOwnerCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
            :pending-applicants-count="applicantCounts[project.id]"
          />
        </div>

        <!-- ─── EMPTY STATE ─── -->
        <div
          v-else
          class="bg-white rounded-3xl border border-neutral-200 shadow-sm py-20 px-8 text-center flex flex-col items-center"
        >
          <div
            class="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-5 shrink-0"
          >
            <svg
              class="w-10 h-10 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-secondary-900 mb-2">
            Belum ada project
          </h3>
          <p
            class="text-neutral-500 font-medium max-w-sm text-sm leading-relaxed mb-6"
          >
            {{
              selectedFilter === 'all'
                ? 'Anda belum membuat project apa pun. Yuk mulai kolaborasi pertama Anda!'
                : `Tidak ada project dengan status ${filters.find((f) => f.value === selectedFilter)?.label}.`
            }}
          </p>
          <NuxtLink to="/projects/create" v-if="selectedFilter === 'all'">
            <AtomicButton variant="primary"> Mulai Buat Project </AtomicButton>
          </NuxtLink>

          <AtomicButton
            v-else
            variant="outline"
            @click="selectedFilter = 'all'"
          >
            Lihat Semua Project
          </AtomicButton>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
