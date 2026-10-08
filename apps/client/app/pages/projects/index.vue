<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { ProjectItem } from '~/components/project/ProjectListItem.vue'
import { useProjects } from '~/composables/useProjects'
import { toProjectListItem } from '~/utils/project-presentation'
import { getApiErrorMessage } from '~/utils/error'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard'],
  homeNavbar: {
    mainHorizontalPadding: 'none',
    mainWidth: 'wide'
  }
})

useHead({
  title: 'Jelajahi Proyek — Kolaboria'
})

const projects = ref<ProjectItem[]>([])
const projectsLoading = ref(true)
const projectsError = ref('')
const { getPublicProjectSummaries } = useProjects()
const loadProjects = async () => {
  projectsLoading.value = true
  projectsError.value = ''
  try {
    projects.value = (await getPublicProjectSummaries()).map(toProjectListItem)
  } catch (error: unknown) {
    projectsError.value = getApiErrorMessage(error, 'Proyek belum dapat dimuat. Coba lagi.')
  } finally {
    projectsLoading.value = false
  }
}

// ============================================================
// REACTIVE FILTER STATES
// ============================================================
const searchInput = ref('')
const activeSearch = ref('')

const projectTypes = ['Product', 'Community', 'Open Source', 'Research', 'Education', 'Business', 'Lainnya']
const selectedTypes = ref<string[]>([])

const projectContexts = [
  'Proyek pribadi',
  'Komunitas',
  'Eksperimen',
  'Proyek client'
]
const selectedContexts = ref<string[]>([])

const acceptsContributorsOnly = ref(false)

const sortBy = ref<string>('newest')

const sortOptions = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Terlama', value: 'oldest' },
  { label: 'Paling Populer', value: 'popular' }
]

const currentPage = ref(1)
const itemsPerPage = 12

// Checkbox "Semua proyek" is active when no specific types are chosen
const isAllTypesSelected = computed(() => selectedTypes.value.length === 0)

const toggleAllTypes = (checked: boolean) => {
  if (checked) {
    selectedTypes.value = []
  }
}

const toggleType = (type: string) => {
  const idx = selectedTypes.value.indexOf(type)
  if (idx > -1) {
    selectedTypes.value.splice(idx, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

const toggleContext = (ctx: string) => {
  const idx = selectedContexts.value.indexOf(ctx)
  if (idx > -1) {
    selectedContexts.value.splice(idx, 1)
  } else {
    selectedContexts.value.push(ctx)
  }
}

const isAllContextsSelected = computed(() => selectedContexts.value.length === 0)

const toggleAllContexts = (checked: boolean) => {
  if (checked) {
    selectedContexts.value = []
  }
}

const handleSearchSubmit = () => {
  activeSearch.value = searchInput.value.trim()
  currentPage.value = 1
  mobileDisplayCount.value = itemsPerPage
}

const resetFilters = () => {
  searchInput.value = ''
  activeSearch.value = ''
  selectedTypes.value = []
  selectedContexts.value = []
  acceptsContributorsOnly.value = false
  sortBy.value = 'newest'
  currentPage.value = 1
  mobileDisplayCount.value = itemsPerPage
}

// Mobile Bottom Sheet states
const isMobileFilterOpen = ref(false)
const isMobileSortOpen = ref(false)
const isMobileTypeFilterOpen = ref(false)
const isMobileContextFilterOpen = ref(false)
const isMobileAvailabilityFilterOpen = ref(false)

const activeFilterCount = computed(() => {
  let count = selectedTypes.value.length + selectedContexts.value.length
  if (acceptsContributorsOnly.value) count += 1
  return count
})

const handleBookmark = (id: string, isBookmarked: boolean) => {
  const item = projects.value.find((p) => p.id === id)
  if (item) {
    item.isBookmarked = isBookmarked
  }
}

// Reset page and mobile count whenever any filter changes
watch(
  [selectedTypes, selectedContexts, acceptsContributorsOnly, sortBy],
  () => {
    currentPage.value = 1
    mobileDisplayCount.value = itemsPerPage
  },
  { deep: true }
)

// ============================================================
// FILTERING & PAGINATION COMPUTED
// ============================================================
const filteredProjects = computed(() => {
  const result = projects.value.filter((project) => {
    // 1. Search Query Filter
    if (activeSearch.value) {
      const q = activeSearch.value.toLowerCase()
      const matchTitle = project.title.toLowerCase().includes(q)
      const matchDesc = (project.description || '').toLowerCase().includes(q)
      const matchSkill = project.skills.some((s) => s.toLowerCase().includes(q))
      const matchCategory = (project.categoryLabel || '')
        .toLowerCase()
        .includes(q)
      if (!matchTitle && !matchDesc && !matchSkill && !matchCategory) {
        return false
      }
    }

    // 2. Project Type Filter
    if (selectedTypes.value.length > 0) {
      if (!project.type || !selectedTypes.value.includes(project.type)) {
        return false
      }
    }

    // 3. Project Context Filter
    if (selectedContexts.value.length > 0) {
      if (
        !project.context ||
        !selectedContexts.value.includes(project.context)
      ) {
        return false
      }
    }

    // 4. Availability Filter
    if (acceptsContributorsOnly.value && !project.acceptsContributors) {
      return false
    }

    return true
  })

  // Apply sorting
  return result.slice().sort((a, b) => {
    if (sortBy.value === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    } else if (sortBy.value === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    } else if (sortBy.value === 'popular') {
      return (b.filledCapacity || 0) - (a.filledCapacity || 0)
    }
    return 0
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage) || 1
})

// Responsive viewport detection (desktop >= 1024px)
const isDesktop = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(min-width: 1024px)')
    isDesktop.value = mq.matches
    mq.addEventListener('change', (e) => {
      isDesktop.value = e.matches
    })
  }
  void loadProjects()
})

// Mobile Endless Scrolling state
const mobileDisplayCount = ref(itemsPerPage)

const hasMoreMobile = computed(() => {
  return mobileDisplayCount.value < filteredProjects.value.length
})

const loadMoreMobile = async () => {
  mobileDisplayCount.value += itemsPerPage
}

const { sentinelRef, isLoading: isEndlessLoading } = useInfiniteScroll({
  onLoadMore: loadMoreMobile,
  hasMore: hasMoreMobile,
  disabled: isDesktop,
  distance: '200px'
})

const startItem = computed(() => {
  if (filteredProjects.value.length === 0) return 0
  return isDesktop.value ? (currentPage.value - 1) * itemsPerPage + 1 : 1
})

const endItem = computed(() => {
  if (filteredProjects.value.length === 0) return 0
  if (isDesktop.value) {
    return Math.min(
      currentPage.value * itemsPerPage,
      filteredProjects.value.length
    )
  }
  return Math.min(mobileDisplayCount.value, filteredProjects.value.length)
})

// Displayed projects: paginated for desktop, continuous list for mobile endless scroll
const paginatedProjects = computed(() => {
  if (isDesktop.value) {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProjects.value.slice(start, start + itemsPerPage)
  }
  return filteredProjects.value.slice(0, mobileDisplayCount.value)
})
</script>

<template>
  <div class="mx-auto w-full">
    <!-- ===================================================== -->
    <!-- HERO SECTION (Typography & Search matching reference) -->
    <!-- ===================================================== -->
    <header
      class="relative w-full overflow-hidden lg:rounded-lg border border-neutral-200 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 bg-white"
    >
      <div class="relative z-10 w-full">
        <!-- Tag / Category Header -->
        <p
          class="font-label-3 font-bold uppercase tracking-wider text-primary-600 mb-2.5"
        >
          PROJECT HUB
        </p>

        <!-- Main Headline -->
        <h1
          class="font-title-1 text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-neutral-900 leading-[1.2]"
        >
          Temukan ruang untuk berkarya dan<br class="hidden sm:inline" />
          bertumbuh bersama.
        </h1>

        <!-- Subtitle Description -->
        <p
          class="mt-3.5 font-body-1 text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed"
        >
          Jelajahi proyek nyata, temukan peran yang sesuai dengan kemampuanmu,
          dan bangun pengalaman melalui kontribusi yang bermakna.
        </p>

        <!-- Search Bar Row (Expands across full width) -->
        <div
          class="mt-8 flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div class="relative flex-1">
            <!-- Search Icon -->
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4.5 w-4.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            <!-- Input Field -->
            <input
              v-model="searchInput"
              type="text"
              placeholder="Cari proyek, skill, atau teknologi..."
              class="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-11 pr-10 font-body-2 text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @keydown.enter="handleSearchSubmit"
            />

            <!-- Clear Button -->
            <button
              v-if="searchInput"
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              aria-label="Bersihkan pencarian"
              @click="
                () => {
                  searchInput = ''
                  handleSearchSubmit()
                }
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Action Button -->
          <AtomicButton
            variant="primary"
            class="!rounded-xl !px-6 !py-3.5 !bg-primary-600 hover:!bg-primary-700 !text-white font-label-2 font-semibold shrink-0 cursor-pointer"
            @click="handleSearchSubmit"
          >
            Cari Proyek
          </AtomicButton>
        </div>
      </div>
    </header>

    <!-- ===================================================== -->
    <!-- CONTENT LAYOUT: SIDEBAR FILTER + PROJECT LIST -->
    <!-- ===================================================== -->
    <!-- ===================================================== -->
    <!-- CONTENT LAYOUT: SIDEBAR FILTER + PROJECT LIST -->
    <!-- ===================================================== -->
    <div class="flex flex-col lg:flex-row items-start gap-8 lg:gap-8">
      <!-- ── Desktop Sticky Sidebar Filter (≥ lg) ── -->
      <aside
        class="hidden lg:block w-64 shrink-0 lg:sticky lg:top-20 self-start bg-white rounded-lg border border-neutral-200 p-5 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto"
      >
        <!-- Filter Header & Reset -->
        <div
          class="flex items-center justify-between pb-3 border-b border-neutral-100"
        >
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 text-neutral-600"
              aria-hidden="true"
            >
              <line x1="21" x2="14" y1="4" y2="4" />
              <line x1="10" x2="3" y1="4" y2="4" />
              <line x1="21" x2="12" y1="12" y2="12" />
              <line x1="8" x2="3" y1="12" y2="12" />
              <line x1="21" x2="16" y1="20" y2="20" />
              <line x1="12" x2="3" y1="20" y2="20" />
              <line x1="14" x2="14" y1="2" y2="6" />
              <line x1="8" x2="8" y1="10" y2="14" />
              <line x1="16" x2="16" y1="18" y2="22" />
            </svg>
            <span class="font-label-1 font-bold text-neutral-900">Filter</span>
            <span
              v-if="activeFilterCount > 0"
              class="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-700"
            >
              {{ activeFilterCount }}
            </span>
          </div>

          <button
            v-if="activeFilterCount > 0"
            type="button"
            @click="resetFilters"
            class="text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors"
          >
            Reset
          </button>
        </div>

        <!-- 1. Jenis Proyek -->
        <div>
          <h3 class="font-label-2 font-bold text-neutral-900 mb-3">
            Jenis proyek
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomicCheckbox
              label="Semua proyek"
              :model-value="isAllTypesSelected"
              @update:model-value="toggleAllTypes"
            />
            <AtomicCheckbox
              v-for="item in projectTypes"
              :key="item"
              :label="item"
              :model-value="selectedTypes.includes(item)"
              @update:model-value="() => toggleType(item)"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-neutral-100"></div>

        <!-- 2. Konteks Proyek -->
        <div>
          <h3 class="font-label-2 font-bold text-neutral-900 mb-3">
            Konteks proyek
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomicCheckbox
              v-for="item in projectContexts"
              :key="item"
              :label="item"
              :model-value="selectedContexts.includes(item)"
              @update:model-value="() => toggleContext(item)"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-neutral-100"></div>

        <!-- 3. Ketersediaan -->
        <div>
          <h3 class="font-label-2 font-bold text-neutral-900 mb-3">
            Ketersediaan
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomicCheckbox
              label="Masih menerima kontributor"
              v-model="acceptsContributorsOnly"
            />
          </div>
        </div>
      </aside>

      <!-- ── Right Main Area ── -->
      <section class="flex-1 min-w-0 w-full px-4 lg:px-0 mb-4">
        <!-- Desktop Header Row (≥ lg) - Matches Desktop Design System Reference -->
        <div class="hidden lg:flex items-center justify-between gap-4 mb-5">
          <div>
            <p class="font-body-2 text-secondary mt-1">
              Menampilkan <strong>{{ filteredProjects.length }}</strong> proyek
              tersedia
            </p>
          </div>

          <div class="w-48 shrink-0">
            <MoleculeDropdown v-model="sortBy" :options="sortOptions" />
          </div>
        </div>

        <!-- Mobile Header & Quick Controls (< lg) -->
        <div class="block lg:hidden mb-6">
          <div class="mb-4">
            <h2
              class="font-title-2 text-xl font-bold tracking-tight text-neutral-900 leading-tight"
            >
              Proyek yang bisa kamu jelajahi
            </h2>
          </div>

          <!-- ===================================================== -->
          <!-- FILTER & SORTING AREA (Matches User's Reference)      -->
          <!-- ===================================================== -->
          <div class="relative">
            <!-- Text: Menampilkan data X - Y dari total Z pencarian -->
            <p class="font-body-2 text-sm text-neutral-600 mb-3">
              Menampilkan data {{ startItem }} - {{ endItem }} dari total
              {{ filteredProjects.length }} pencarian
            </p>

            <!-- Horizontal Filter & Sorting Controls Row -->
            <div
              class="flex items-center gap-2 overflow-x-auto pt-2 pb-2 select-none -mx-1 px-1 scrollbar-none"
            >
              <!-- 1. Circular Filter Button ([ ⏚ ]) -->
              <button
                type="button"
                @click="isMobileFilterOpen = true"
                class="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 shrink-0 cursor-pointer"
                aria-label="Buka semua filter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4.5 w-4.5 text-neutral-700"
                >
                  <polygon
                    points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
                  />
                </svg>
                <span
                  v-if="activeFilterCount > 0"
                  class="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white leading-none shadow-xs"
                >
                  {{ activeFilterCount }}
                </span>
              </button>

              <!-- 2. Circular Sort Button ([ ⇅ ]) -->
              <button
                type="button"
                @click="isMobileSortOpen = true"
                class="relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors shrink-0 cursor-pointer"
                :class="[
                  sortBy !== 'newest'
                    ? 'border-primary-500 bg-primary-50 text-primary-600 ring-1 ring-primary-200'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100'
                ]"
                aria-label="Urutkan pencarian"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4.5 w-4.5"
                >
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="m21 8-4-4-4 4" />
                  <path d="M17 4v16" />
                </svg>
              </button>

              <!-- 3. Pill Filter Chip: Jenis Proyek -->
              <button
                type="button"
                @click="isMobileTypeFilterOpen = true"
                class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                :class="[
                  selectedTypes.length > 0
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                ]"
              >
                <span>
                  {{
                    selectedTypes.length === 0
                      ? 'Jenis Proyek'
                      : selectedTypes.length === 1
                        ? selectedTypes[0]
                        : `${selectedTypes.length} Jenis`
                  }}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-3.5 w-3.5 text-neutral-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- 4. Pill Filter Chip: Konteks -->
              <button
                type="button"
                @click="isMobileContextFilterOpen = true"
                class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                :class="[
                  selectedContexts.length > 0
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                ]"
              >
                <span>
                  {{
                    selectedContexts.length === 0
                      ? 'Konteks'
                      : selectedContexts.length === 1
                        ? selectedContexts[0]
                        : `${selectedContexts.length} Konteks`
                  }}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-3.5 w-3.5 text-neutral-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- 5. Pill Filter Chip: Ketersediaan -->
              <button
                type="button"
                @click="isMobileAvailabilityFilterOpen = true"
                class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                :class="[
                  acceptsContributorsOnly
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                ]"
              >
                <span>
                  {{
                    acceptsContributorsOnly
                      ? 'Menerima Kontributor'
                      : 'Ketersediaan'
                  }}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-3.5 w-3.5 text-neutral-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Project Cards List -->
        <div v-if="paginatedProjects.length > 0" class="flex flex-col gap-4">
          <ProjectListItem
            v-for="project in paginatedProjects"
            :key="project.id"
            :project="project"
            @bookmark="handleBookmark"
          />
        </div>

        <!-- Mobile Endless Scroll: Loading State & Sentinel (< lg) -->
        <div
          v-if="!isDesktop && filteredProjects.length > 0"
          class="w-full flex flex-col items-center"
        >
          <!-- Loading State Animation -->
          <div
            v-if="isEndlessLoading"
            class="py-8 flex flex-col items-center justify-center gap-2.5 transition-all duration-300"
            role="status"
            aria-live="polite"
          >
            <div class="flex items-center gap-2" aria-hidden="true">
              <div
                class="h-2.5 w-2.5 animate-bounce rounded-full bg-primary-400 shadow-xs"
                style="animation-delay: -0.3s"
              ></div>
              <div
                class="h-2.5 w-2.5 animate-bounce rounded-full bg-primary-500 shadow-xs"
                style="animation-delay: -0.15s"
              ></div>
              <div
                class="h-2.5 w-2.5 animate-bounce rounded-full bg-primary-600 shadow-xs"
              ></div>
            </div>
            <span
              class="font-body-2 text-xs font-medium text-neutral-500 animate-pulse"
            >
              Memuat lebih banyak proyek...
            </span>
          </div>

          <!-- Invisible Sentinel Element observed by IntersectionObserver -->
          <div
            v-if="hasMoreMobile"
            ref="sentinelRef"
            class="h-8 w-full pointer-events-none"
            aria-hidden="true"
          />
        </div>

        <!-- Empty State (Only appears when data is empty) -->
        <div
          v-if="filteredProjects.length === 0 && !projectsLoading && !projectsError"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 px-6 text-center"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m13.5 8.5-5 5" />
              <path d="m8.5 8.5 5 5" />
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 class="font-title-3 font-bold text-neutral-900 mb-1">
            Tidak ada proyek yang sesuai
          </h3>
          <p class="font-body-2 text-neutral-500 max-w-sm mb-6">
            Coba sesuaikan kata kunci pencarian atau ubah pilihan filter di
            sebelah kiri.
          </p>
          <AtomicButton
            variant="outline"
            size="sm"
            class="!rounded-lg"
            @click="resetFilters"
          >
            Reset Semua Filter
          </AtomicButton>
        </div>

        <!-- Pagination (Desktop Only: Hidden on Mobile) -->
        <div class="hidden lg:block border-t border-neutral-100 mt-5">
          <MoleculePagination
            v-if="filteredProjects.length > 0"
            v-model="currentPage"
            :total-pages="totalPages"
            :align="`end`"
            :total-items="filteredProjects.length"
            :per-page="itemsPerPage"
          />
        </div>
      </section>

      <!-- ── Mobile Sorting Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileSortOpen"
        title="Urutkan Proyek"
        subtitle="Pilih urutan tampilan daftar proyek"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileSortOpen = false"
        @secondary="sortBy = 'newest'"
      >
        <div class="flex flex-col gap-4 py-2">
          <AtomicRadio
            v-for="opt in sortOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
            name="mobile-sort-option"
            v-model="sortBy"
          />
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile All Filters Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileFilterOpen"
        title="Filter Proyek"
        subtitle="Sesuaikan kriteria pencarian proyek"
        primary-label="Terapkan"
        secondary-label="Reset Semua"
        @primary="isMobileFilterOpen = false"
        @secondary="resetFilters"
      >
        <div class="space-y-6 py-2">
          <!-- 1. Jenis Proyek -->
          <div>
            <h3 class="font-label-1 font-bold text-neutral-900 mb-3">
              Jenis proyek
            </h3>
            <div class="flex flex-col gap-3">
              <AtomicCheckbox
                label="Semua proyek"
                :model-value="isAllTypesSelected"
                @update:model-value="toggleAllTypes"
              />
              <AtomicCheckbox
                v-for="item in projectTypes"
                :key="item"
                :label="item"
                :model-value="selectedTypes.includes(item)"
                @update:model-value="() => toggleType(item)"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-b border-neutral-100"></div>

          <!-- 2. Konteks Proyek -->
          <div>
            <h3 class="font-label-1 font-bold text-neutral-900 mb-3">
              Konteks proyek
            </h3>
            <div class="flex flex-col gap-3">
              <AtomicCheckbox
                label="Semua konteks"
                :model-value="isAllContextsSelected"
                @update:model-value="toggleAllContexts"
              />
              <AtomicCheckbox
                v-for="item in projectContexts"
                :key="item"
                :label="item"
                :model-value="selectedContexts.includes(item)"
                @update:model-value="() => toggleContext(item)"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-b border-neutral-100"></div>

          <!-- 3. Ketersediaan -->
          <div>
            <h3 class="font-label-1 font-bold text-neutral-900 mb-3">
              Ketersediaan
            </h3>
            <div class="flex flex-col gap-3">
              <AtomicCheckbox
                label="Masih menerima kontributor"
                v-model="acceptsContributorsOnly"
              />
            </div>
          </div>
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile Jenis Proyek Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileTypeFilterOpen"
        title="Jenis Proyek"
        subtitle="Pilih kategori jenis proyek"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileTypeFilterOpen = false"
        @secondary="toggleAllTypes(true)"
      >
        <div class="flex flex-col gap-3.5 py-2">
          <AtomicCheckbox
            label="Semua proyek"
            :model-value="isAllTypesSelected"
            @update:model-value="toggleAllTypes"
          />
          <AtomicCheckbox
            v-for="item in projectTypes"
            :key="item"
            :label="item"
            :model-value="selectedTypes.includes(item)"
            @update:model-value="() => toggleType(item)"
          />
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile Konteks Proyek Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileContextFilterOpen"
        title="Konteks Proyek"
        subtitle="Pilih latar belakang atau konteks proyek"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileContextFilterOpen = false"
        @secondary="toggleAllContexts(true)"
      >
        <div class="flex flex-col gap-3.5 py-2">
          <AtomicCheckbox
            label="Semua konteks"
            :model-value="isAllContextsSelected"
            @update:model-value="toggleAllContexts"
          />
          <AtomicCheckbox
            v-for="item in projectContexts"
            :key="item"
            :label="item"
            :model-value="selectedContexts.includes(item)"
            @update:model-value="() => toggleContext(item)"
          />
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile Ketersediaan Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileAvailabilityFilterOpen"
        title="Ketersediaan Proyek"
        subtitle="Pilih kriteria penerimaan kontributor"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileAvailabilityFilterOpen = false"
        @secondary="acceptsContributorsOnly = false"
      >
        <div class="flex flex-col gap-3.5 py-2">
          <AtomicCheckbox
            label="Masih menerima kontributor"
            v-model="acceptsContributorsOnly"
          />
        </div>
      </OrganismBottomSheet>
    </div>
  </div>
</template>
