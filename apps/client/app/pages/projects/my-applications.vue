<template>
  <div class="px-4 py-10 sm:px-6">
    <!-- Hero Section (Premium Layout - matching Home) -->
    <div
      class="relative rounded-3xl overflow-hidden mb-10 bg-primary-500 shadow-xl border border-primary-400/30"
    >
      <!-- Aurora Background Effects -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="k-aurora-1 opacity-60 mix-blend-overlay"></div>
        <div class="k-aurora-2 opacity-50 mix-blend-overlay"></div>
      </div>

      <!-- Detail Subtle Graphic Grid -->
      <div
        class="absolute inset-0 pointer-events-none mix-blend-overlay"
        style="
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
        "
        aria-hidden="true"
      ></div>

      <div
        class="relative z-10 p-8 md:p-12 text-white flex flex-col items-start pl-8 md:pl-14 border-l-[3px] border-white/20 ml-4 md:ml-8 my-8"
      >
        <p
          class="font-label-sm text-white/80 mb-3 tracking-[0.2em] uppercase text-xs font-semibold flex items-center gap-2"
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
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Dashboard Aplikasi
        </p>
        <h1
          class="text-3xl md:text-[2.75rem] font-black mb-5 leading-[1.15] tracking-tight drop-shadow-sm"
        >
          Lamaran Saya
        </h1>
        <p
          class="font-paragraph-lg text-white/80 max-w-2xl text-[1.1rem] leading-[1.7] mb-0"
        >
          Pantau dan kelola seluruh perjalanan aplikasi proyekmu dengan mudah di
          satu tempat.
        </p>
      </div>
    </div>

    <!-- ─── MAIN CONTENT ─── -->
    <main>
      <!-- Loading State -->
      <MoleculeLoading v-if="pending" text="Memuat lamaran..." class="py-16" />

      <!-- Error State -->
      <MoleculeTicker
        v-else-if="error"
        variant="danger"
        :message="error.message"
        :closable="false"
      />

      <template v-else-if="applications">
        <!-- ─── STATISTICS ─── -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <!-- Total -->
          <div
            class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-gray-200 transition-colors"
          >
            <div
              class="absolute right-0 top-0 w-24 h-24 bg-gray-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
            ></div>
            <h3
              class="font-label-sm text-gray-400 uppercase tracking-wider mb-2 relative z-10 text-xs font-bold"
            >
              Total Terkirim
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-gray-900 leading-none">{{
                userStats.total
              }}</span>
              <span class="text-sm font-semibold text-gray-500 mb-1"
                >Lamaran</span
              >
            </div>
          </div>

          <!-- Pending -->
          <div
            class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-amber-100 transition-colors"
          >
            <div
              class="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
            ></div>
            <h3
              class="font-label-sm text-amber-500/70 uppercase tracking-wider mb-2 relative z-10 text-xs font-bold"
            >
              Menunggu Review
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-amber-600 leading-none">{{
                userStats.pending
              }}</span>
              <span class="text-sm font-semibold text-amber-500 mb-1"
                >Proses</span
              >
            </div>
          </div>

          <!-- Accepted -->
          <div
            class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-100 transition-colors"
          >
            <div
              class="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110"
            ></div>
            <h3
              class="font-label-sm text-emerald-500/70 uppercase tracking-wider mb-2 relative z-10 text-xs font-bold"
            >
              Diterima
            </h3>
            <div class="flex items-end gap-3 relative z-10">
              <span class="text-4xl font-black text-emerald-600 leading-none">{{
                userStats.accepted
              }}</span>
              <span class="text-sm font-semibold text-emerald-500 mb-1"
                >Sukses</span
              >
            </div>
          </div>
        </div>

        <!-- ─── FILTERS ─── -->
        <div
          class="flex items-center gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar"
        >
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all whitespace-nowrap outline-none flex items-center justify-center min-w-[max-content]',
              selectedFilter === filter.value
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- ─── APPLICATIONS TIMELINE LIST ─── -->
        <div v-if="filteredApplications.length > 0" class="space-y-6">
          <div
            v-for="app in filteredApplications"
            :key="app.id"
            class="relative group/timeline"
          >
            <div class="flex gap-4 md:gap-6">
              <!-- Application Card -->
              <div
                class="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 hover:border-primary-200 hover:shadow-md transition-all duration-300"
              >
                <div
                  class="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-5 border-b border-gray-50 pb-5"
                >
                  <div class="flex items-start gap-4 flex-1 min-w-0">
                    <!-- Partner Initial / Icon -->
                    <div
                      class="w-12 h-12 rounded-[10px] flex items-center justify-center text-xl font-bold shrink-0 text-white shadow-sm"
                      :class="getProjectColorClass(app.status)"
                    >
                      {{ getProjectIcon(app.projects?.title) }}
                    </div>

                    <div class="min-w-0">
                      <h3
                        class="text-lg font-bold text-gray-900 mb-1 truncate group-hover/timeline:text-primary-600 transition-colors"
                      >
                        {{ app.projects?.title ?? 'Project Tidak Tersedia' }}
                      </h3>
                      <p
                        class="text-[0.65rem] font-bold tracking-widest uppercase text-gray-400 mt-1.5"
                      >
                        Diajukan {{ relativeDate(app.applied_at) }}
                      </p>
                    </div>
                  </div>

                  <div class="shrink-0 flex items-center">
                    <span
                      v-if="statusConfig[app.status]"
                      :class="[
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset uppercase tracking-wide',
                        statusConfig[app.status].classes
                      ]"
                    >
                      {{ statusConfig[app.status].label }}
                    </span>
                  </div>
                </div>

                <!-- Application Details Summary -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <!-- Motivation -->
                  <div>
                    <p
                      class="font-label-sm text-gray-400 uppercase tracking-widest mb-2 text-[10px] font-bold"
                    >
                      Motivasi
                    </p>
                    <p class="text-sm text-gray-600 italic line-clamp-2">
                      "{{
                        app.motivation.length > 120
                          ? app.motivation.substring(0, 120) + '...'
                          : app.motivation
                      }}"
                    </p>
                  </div>
                  <!-- Availability -->
                  <div>
                    <p
                      class="font-label-sm text-gray-400 uppercase tracking-widest mb-2 text-[10px] font-bold"
                    >
                      Ketersediaan
                    </p>
                    <p class="text-sm font-semibold text-gray-700">
                      {{
                        availabilityLabel[app.availability] || app.availability
                      }}
                    </p>
                  </div>
                </div>

                <!-- Message Section (if Accepted) -->
                <div
                  v-if="app.status === 'accepted'"
                  class="mb-6 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3"
                >
                  <svg
                    class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 class="text-sm font-bold text-emerald-800 mb-0.5">
                      Lamaran Diterima!
                    </h4>
                    <p
                      class="text-xs font-medium text-emerald-600/90 leading-relaxed"
                    >
                      Keren, kamu berhasil masuk ke alur kolaborasi proyek ini!
                    </p>
                  </div>
                </div>

                <!-- Message Section (Reviewer Note) -->
                <div
                  v-if="app.reviewer_note && app.status !== 'accepted'"
                  class="mb-6 bg-gray-50 border border-gray-100 rounded-xl p-4"
                >
                  <h4
                    class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5"
                  >
                    Catatan Reviewer
                  </h4>
                  <p class="text-sm font-medium text-gray-700 leading-relaxed">
                    {{ app.reviewer_note }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                  <NuxtLink :to="`/projects/${app.projects?.slug}`">
                    <AtomicButton
                      v-if="app.projects?.slug"
                      variant="primary"
                      fill="outline"
                      size="sm"
                      class="font-bold"
                    >
                      Detail Proyek
                    </AtomicButton>
                  </NuxtLink>

                  <AtomicButton
                    v-if="app.status === 'pending'"
                    variant="outline"
                    size="sm"
                    :disabled="isWithdrawing"
                    @click="handleWithdraw(app.id)"
                  >
                    Batalkan Lamaran
                  </AtomicButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── EMPTY STATE ─── -->
        <div
          v-else
          class="py-20 flex flex-col items-center justify-center text-center px-4 bg-white border border-gray-100 rounded-3xl shadow-sm"
        >
          <div
            class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 shrink-0"
          >
            <svg
              class="w-10 h-10 text-gray-400"
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
          <h3 class="text-xl font-bold text-gray-900 mb-2">Belum ada data</h3>
          <p
            class="text-gray-500 font-medium max-w-sm mb-8 text-sm leading-relaxed"
          >
            {{
              selectedFilter === 'all'
                ? 'Tampaknya kamu belum mengirimkan aplikasi lamaran ke proyek manapun. Mari jelajahi peluang baru!'
                : `Kamu belum memiliki aplikasi dengan status filter ini.`
            }}
          </p>
          <AtomicButton
            variant="primary"
            size="md"
            class="font-bold shadow-lg shadow-primary-500/20"
            @click="navigateTo('/projects')"
          >
            <template #icon-left>
              <svg
                class="w-4 h-4 mr-2 text-white"
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
            </template>
            Eksplor Proyek
          </AtomicButton>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Application } from '~/types/project'

definePageMeta({ layout: 'home', middleware: 'auth' })
useHead({ title: 'Lamaran Saya — Kolaboria' })

const { getMyApplications, withdrawApplication } = useProjects()

const {
  data: applications,
  pending,
  error,
  refresh
} = await useAsyncData<Application[]>('my-applications', () =>
  getMyApplications()
)

// Filters
const selectedFilter = ref<
  'all' | 'pending' | 'accepted' | 'rejected' | 'withdrawn'
>('all')

const filters: Array<{
  label: string
  value: 'all' | 'pending' | 'accepted' | 'rejected' | 'withdrawn'
}> = [
  { label: 'Semua Lamaran', value: 'all' },
  { label: 'Menunggu Ditinjau', value: 'pending' },
  { label: 'Diterima', value: 'accepted' },
  { label: 'Ditolak', value: 'rejected' },
  { label: 'Dibatalkan', value: 'withdrawn' }
]

// Status styling
const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: {
    label: 'Menunggu',
    classes: 'bg-amber-50 text-amber-700 ring-amber-200'
  },
  accepted: {
    label: 'Diterima',
    classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  },
  rejected: {
    label: 'Ditolak',
    classes: 'bg-red-50 text-red-700 ring-red-200'
  },
  withdrawn: {
    label: 'Dibatalkan',
    classes: 'bg-gray-100 text-gray-600 ring-gray-200'
  }
}

const availabilityLabel: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  weekends_only: 'Akhir Pekan',
  flexible: 'Fleksibel'
}

// Stats
const userStats = computed(() => {
  if (!applications.value) return { total: 0, pending: 0, accepted: 0 }
  return {
    total: applications.value.length,
    pending: applications.value.filter((app) => app.status === 'pending')
      .length,
    accepted: applications.value.filter((app) => app.status === 'accepted')
      .length
  }
})

// Filtered data
const filteredApplications = computed(() => {
  if (!applications.value) return []
  if (selectedFilter.value === 'all') return applications.value
  return applications.value.filter((app) => app.status === selectedFilter.value)
})

// Helpers
const getProjectIcon = (title?: string) => {
  return title ? title.charAt(0).toUpperCase() : '?'
}

const getProjectColorClass = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'bg-emerald-500'
    case 'pending':
      return 'bg-amber-500'
    case 'rejected':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

const relativeDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hari ini'
  if (diffDays === 1) return 'kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Actions
const isWithdrawing = ref(false)

const handleWithdraw = async (applicationId: string) => {
  if (!confirm('Yakin ingin membatalkan lamaran ini?')) return

  isWithdrawing.value = true
  try {
    await withdrawApplication(applicationId)
    await refresh()
  } catch (err: any) {
    alert(err?.message || 'Gagal membatalkan lamaran.')
  } finally {
    isWithdrawing.value = false
  }
}
</script>

<style scoped>
/* Aurora effects */
.k-aurora-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 70%
  );
  animation: aurora-drift 14s ease-in-out infinite alternate;
  border-radius: 50%;
  filter: blur(60px);
  will-change: transform;
}
.k-aurora-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 176, 32, 0.12) 0%,
    transparent 70%
  );
  animation: aurora-drift 18s ease-in-out infinite alternate-reverse;
  border-radius: 50%;
  filter: blur(70px);
  will-change: transform;
}
@keyframes aurora-drift {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(40px, -30px) scale(1.08);
  }
  100% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
