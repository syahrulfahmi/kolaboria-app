<script setup lang="ts">
import type { Application, Project } from '~/types/project'
import ApplicantDetailModal from '~/components/project/ApplicantDetailModal.vue'

definePageMeta({ layout: 'home', middleware: 'auth' })

const route = useRoute()
const { getProjectBySlug, getProjectApplicants, reviewApplication } =
  useProjects()
const user = useSupabaseUser()

const projectSlug = route.params.slug as string

const { data: project } = await useAsyncData<Project | null>(
  `project-owner-${projectSlug}`,
  () => getProjectBySlug(projectSlug)
)

const projectId = computed(() => project.value?.id)

const {
  data: applications,
  refresh: refreshApplicants,
  pending
} = await useAsyncData<Application[]>(
  `project-applicants-${projectSlug}`,
  () =>
    projectId.value
      ? getProjectApplicants(projectId.value)
      : Promise.resolve([]),
  { watch: [projectId] }
)

if (project.value && user.value?.id !== project.value.creator_id) {
  throw createError({
    statusCode: 403,
    message: 'Akses ditolak. Anda bukan pemilik project ini.'
  })
}

useHead({
  title: project.value ? `Pelamar: ${project.value.title}` : 'Kelola Pelamar'
})

// UI State
const searchQuery = ref('')
const selectedFilter = ref<'all' | 'pending' | 'accepted' | 'rejected'>('all')
const isModalOpen = ref(false)
const selectedApplicant = ref<Application | null>(null)

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diterima', value: 'accepted' },
  { label: 'Ditolak', value: 'rejected' }
] as const

const stats = computed(() => {
  const apps = applications.value || []
  return {
    total: apps.length,
    pending: apps.filter((a) => a.status === 'pending').length,
    accepted: apps.filter((a) => a.status === 'accepted').length,
    rejected: apps.filter((a) => ['rejected', 'withdrawn'].includes(a.status))
      .length
  }
})

const filteredApplications = computed(() => {
  let result = applications.value || []

  if (selectedFilter.value !== 'all') {
    if (selectedFilter.value === 'rejected') {
      result = result.filter((app) =>
        ['rejected', 'withdrawn'].includes(app.status)
      )
    } else {
      result = result.filter((app) => app.status === selectedFilter.value)
    }
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (app) =>
        app.profiles?.full_name?.toLowerCase().includes(query) ||
        app.profiles?.username.toLowerCase().includes(query) ||
        app.profiles?.headline?.toLowerCase().includes(query)
    )
  }

  return result
})

const openModal = (applicant: Application) => {
  selectedApplicant.value = applicant
  isModalOpen.value = true
}

const handleReviewed = async (
  status: 'accepted' | 'rejected',
  note: string
) => {
  if (!selectedApplicant.value) return
  await reviewApplication(selectedApplicant.value.id, status, note)
  isModalOpen.value = false
  selectedApplicant.value = null
  await refreshApplicants()
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: {
    label: 'Menunggu',
    classes: 'bg-accent-50 text-accent-700 ring-accent-200'
  },
  accepted: {
    label: 'Diterima',
    classes: 'bg-success-50 text-success-700 ring-success-200'
  },
  rejected: {
    label: 'Ditolak',
    classes: 'bg-danger-50 text-danger-700 ring-danger-200'
  },
  withdrawn: {
    label: 'Dibatalkan',
    classes: 'bg-neutral-100 text-neutral-500 ring-neutral-200'
  }
}

const availabilityLabels: Record<string, string> = {
  flexible: 'Fleksibel',
  full_time: 'Full Time',
  part_time: 'Part Time',
  weekends_only: 'Hanya Akhir Pekan'
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- ─── HEADER ─── -->
    <OrganismCard class="py-4 relative overflow-hidden">
      <!-- Subtle Accent Background -->
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-50/50 to-transparent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Back Navigation -->
        <NuxtLink
          :to="`/projects/${projectSlug}`"
          class="flex w-fit items-center gap-2 text-xs font-bold text-neutral-400 hover:text-primary-600 transition-colors mb-6 tracking-widest uppercase"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Project
        </NuxtLink>

        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div class="flex items-center gap-5 min-w-0">
            <div class="min-w-0">
              <h1
                class="text-3xl font-black text-secondary-900 tracking-tight truncate mb-1"
              >
                Kelola Pelamar
              </h1>
              <p
                class="text-lg text-neutral-500 truncate flex items-center gap-2"
              >
                <span class="font-semibold text-secondary-700">{{
                  project?.title
                }}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                <span class="text-sm uppercase tracking-wider font-semibold">{{
                  project?.type?.replace('_', ' ') || 'Project'
                }}</span>
              </p>
            </div>
          </div>

          <!-- Lamaran Counter -->
          <div class="flex-shrink-0">
            <div
              class="inline-flex items-center gap-2.5 px-5 py-2.5 bg-primary-50 rounded-full border border-primary-100"
            >
              <span
                class="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"
              ></span>
              <span class="font-bold text-primary-700 text-sm tracking-wide"
                >{{ stats.total }} Lamaran Masuk</span
              >
            </div>
          </div>
        </div>
      </div>
    </OrganismCard>

    <!-- ─── MAIN CONTENT ─── -->
    <main class="max-w-7xl py-10">
      <!-- ─── STATISTICS ─── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <!-- Pending -->
        <div
          class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-accent-200 transition-colors"
        >
          <div
            class="absolute right-0 top-0 w-24 h-24 bg-accent-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
          ></div>
          <h3
            class="text-xs font-bold text-accent-600/70 uppercase tracking-wider mb-2 relative z-10"
          >
            Menunggu Tinjauan
          </h3>
          <div class="flex items-end gap-3 relative z-10">
            <span class="text-4xl font-black text-accent-700 leading-none">{{
              stats.pending
            }}</span>
            <span class="text-sm font-semibold text-accent-600 mb-1"
              >Kandidat</span
            >
          </div>
        </div>

        <!-- Accepted -->
        <div
          class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-success-200 transition-colors"
        >
          <div
            class="absolute right-0 top-0 w-24 h-24 bg-success-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
          ></div>
          <h3
            class="text-xs font-bold text-success-600/70 uppercase tracking-wider mb-2 relative z-10"
          >
            Diterima
          </h3>
          <div class="flex items-end gap-3 relative z-10">
            <span class="text-4xl font-black text-success-700 leading-none">{{
              stats.accepted
            }}</span>
            <span class="text-sm font-semibold text-success-600 mb-1"
              >Berhasil</span
            >
          </div>
        </div>

        <!-- Rejected -->
        <div
          class="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-neutral-300 transition-colors"
        >
          <div
            class="absolute right-0 top-0 w-24 h-24 bg-neutral-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
          ></div>
          <h3
            class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 relative z-10"
          >
            Tidak Dipilih
          </h3>
          <div class="flex items-end gap-3 relative z-10">
            <span class="text-4xl font-black text-neutral-500 leading-none">{{
              stats.rejected
            }}</span>
            <span class="text-sm font-semibold text-neutral-400 mb-1"
              >Kandidat</span
            >
          </div>
        </div>
      </div>

      <!-- ─── FILTER & SEARCH BAR ─── -->
      <div
        class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8"
      >
        <!-- Search -->
        <div class="relative w-full lg:max-w-md group">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama atau headline..."
            class="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-secondary-900 placeholder-neutral-400 shadow-sm"
          />
        </div>

        <!-- Filter Pills -->
        <div
          class="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar w-full lg:w-auto"
        >
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all whitespace-nowrap outline-none flex items-center justify-center min-w-[max-content]',
              selectedFilter === filter.value
                ? 'bg-secondary-900 text-white shadow-md'
                : 'bg-white border border-neutral-200 text-neutral-500 hover:text-secondary-900 hover:border-neutral-300'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <MoleculeLoading v-if="pending" text="Memuat pelamar..." class="py-16" />

      <!-- ─── APPLICATIONS GRID ─── -->
      <div
        v-else-if="filteredApplications.length > 0"
        class="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <OrganismCard
          v-for="app in filteredApplications"
          :key="app.id"
          class="hover:border-primary-200 transition-colors cursor-pointer"
          @click="openModal(app)"
        >
          <div class="flex items-start gap-4 mb-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-title font-semibold text-primary-700 shrink-0"
            >
              {{
                (app.profiles?.full_name || app.profiles?.username || '?')
                  .charAt(0)
                  .toUpperCase()
              }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex justify-between items-start gap-2">
                <h3 class="text-body font-bold text-secondary-900 truncate">
                  {{ app.profiles?.full_name || app.profiles?.username }}
                </h3>
                <span
                  v-if="statusConfig[app.status]"
                  :class="[
                    'shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset',
                    statusConfig[app.status].classes
                  ]"
                >
                  {{ statusConfig[app.status].label }}
                </span>
              </div>
              <p class="text-sm text-neutral-500 truncate mt-0.5">
                {{ app.profiles?.headline || 'Talent Kolaboria' }}
              </p>
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-3 mb-5 p-3 bg-neutral-50 rounded-xl border border-neutral-100"
          >
            <div>
              <p
                class="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1"
              >
                Ketersediaan
              </p>
              <p class="text-xs font-bold text-secondary-900 truncate">
                {{ availabilityLabels[app.availability] || app.availability }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1"
              >
                Profil Lengkap
              </p>
              <p class="text-xs font-bold text-success-600">
                {{ app.profiles?.completion_score || 0 }}%
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-auto">
            <span class="text-xs font-medium text-neutral-400">
              Dilamar pada
              {{
                new Date(app.applied_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              }}
            </span>
            <AtomicButton
              v-if="app.status === 'pending'"
              variant="outline"
              size="sm"
              class="!text-xs"
              @click.stop="openModal(app)"
            >
              Tinjau
            </AtomicButton>
            <AtomicButton
              v-else
              variant="ghost-primary"
              size="sm"
              class="!text-xs"
              @click.stop="openModal(app)"
            >
              Lihat Detail
            </AtomicButton>
          </div>
        </OrganismCard>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-secondary-900 mb-2">
          Belum ada data
        </h3>
        <p
          class="text-neutral-500 font-medium max-w-sm text-sm leading-relaxed"
        >
          {{
            selectedFilter === 'all'
              ? 'Belum ada yang melamar ke project ini. Tunggu beberapa saat lagi!'
              : `Tidak ada pelamar dengan status ${filters.find((f) => f.value === selectedFilter)?.label}.`
          }}
        </p>
      </div>
    </main>

    <!-- Application Detail Modal -->
    <ApplicantDetailModal
      v-model="isModalOpen"
      :application="selectedApplicant"
      @reviewed="handleReviewed"
    />
  </div>
</template>
