<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import type { ProjectType } from '../../types/project'

const emit = defineEmits<{
  search: [value: string]
  filterType: [value: ProjectType | '']
  filterStatus: [value: string]
}>()

const search = ref('')
const selectedType = ref<ProjectType | ''>('')
const selectedStatus = ref('')
const isFilterOpen = ref(false)

const filterPanelRef = ref<HTMLElement | null>(null)

watch(search, (val) => emit('search', val))
watch(selectedType, (val) => emit('filterType', val))
watch(selectedStatus, (val) => emit('filterStatus', val))

const typeOptions = [
  { value: '', label: 'Semua Tipe' },
  { value: 'web_app', label: 'Web App' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'ui_ux', label: 'UI/UX Design' },
  { value: 'backend', label: 'Backend' },
  { value: 'data_analytics', label: 'Data & Analytics' },
  { value: 'devops', label: 'DevOps' },
  { value: 'other', label: 'Lainnya' }
]

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' }
]

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedType.value) count++
  if (selectedStatus.value) count++
  return count
})

const activeFilters = computed(() => {
  const filters = []
  if (selectedStatus.value) {
    const statusObj = statusOptions.find(
      (o) => o.value === selectedStatus.value
    )
    if (statusObj)
      filters.push({
        type: 'status',
        label: statusObj.label,
        value: statusObj.value
      })
  }
  if (selectedType.value) {
    const typeObj = typeOptions.find((o) => o.value === selectedType.value)
    if (typeObj)
      filters.push({ type: 'type', label: typeObj.label, value: typeObj.value })
  }
  return filters
})

const removeFilter = (type: 'status' | 'type') => {
  if (type === 'status') selectedStatus.value = ''
  if (type === 'type') selectedType.value = ''
}

const clearAllFilters = () => {
  selectedStatus.value = ''
  selectedType.value = ''
}

const toggleFilterPanel = () => {
  isFilterOpen.value = !isFilterOpen.value
}

const closeFilterPanel = (e: MouseEvent) => {
  if (
    filterPanelRef.value &&
    !filterPanelRef.value.contains(e.target as Node)
  ) {
    isFilterOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeFilterPanel)
})

onUnmounted(() => {
  document.removeEventListener('click', closeFilterPanel)
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Main Search Bar & Filter Button -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search Input -->
      <div class="flex-1">
        <MoleculeSearchField
          v-model="search"
          placeholder="Cari project berdasarkan nama, deskripsi, atau skill..."
          class="!h-12 !rounded-xl"
        />
      </div>

      <!-- Filter Button & Dropdown -->
      <div class="relative" ref="filterPanelRef">
        <button
          type="button"
          class="h-12 flex items-center justify-center gap-2 rounded-xl border px-5 text-body font-medium transition-all w-full sm:w-auto"
          :class="
            isFilterOpen || activeFilterCount > 0
              ? 'border-primary-400 bg-primary-50 text-primary-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
          "
          @click.stop="toggleFilterPanel"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filter
          <span
            v-if="activeFilterCount > 0"
            class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white"
          >
            {{ activeFilterCount }}
          </span>
        </button>

        <!-- Dropdown Panel -->
        <div
          v-if="isFilterOpen"
          class="absolute right-0 top-[calc(100%+8px)] z-50 w-full sm:w-[500px] rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5 origin-top-right transform transition-all"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            <!-- Divider line (only visible on sm and above) -->
            <div
              class="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-100 -translate-x-1/2"
            ></div>

            <!-- Status Filter -->
            <div>
              <h3
                class="mb-3 text-caption font-semibold uppercase tracking-wider text-neutral-500"
              >
                Status Project
              </h3>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  class="flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 transition-all hover:bg-neutral-50"
                  :class="
                    selectedStatus === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 bg-white text-neutral-700'
                  "
                >
                  <input
                    type="radio"
                    :value="opt.value"
                    v-model="selectedStatus"
                    class="sr-only"
                  />
                  <span class="text-caption font-medium">{{ opt.label }}</span>
                </label>
              </div>
            </div>

            <!-- Type Filter -->
            <div>
              <h3
                class="mb-3 text-caption font-semibold uppercase tracking-wider text-neutral-500"
              >
                Tipe Project
              </h3>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="opt in typeOptions"
                  :key="opt.value"
                  class="flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 transition-all hover:bg-neutral-50"
                  :class="
                    selectedType === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 bg-white text-neutral-700'
                  "
                >
                  <input
                    type="radio"
                    :value="opt.value"
                    v-model="selectedType"
                    class="sr-only"
                  />
                  <span class="text-caption font-medium">{{ opt.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Filter Chips -->
    <div
      v-if="activeFilters.length > 0"
      class="flex flex-wrap items-center gap-2"
    >
      <span class="text-caption text-neutral-500">Filter Aktif:</span>
      <AtomicTag
        v-for="filter in activeFilters"
        :key="filter.type"
        :label="filter.label"
        variant="primary"
        closable
        @close="removeFilter(filter.type as any)"
      />
      <AtomicButton
        variant="outline-danger"
        class="!rounded-4xl !py-0"
        @click="clearAllFilters"
      >
        Reset Semua
      </AtomicButton>
    </div>
  </div>
</template>
