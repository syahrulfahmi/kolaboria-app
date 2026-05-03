<script setup lang="ts">
import type { ProjectType } from '../../types/project'

const emit = defineEmits<{
  search: [value: string]
  filterType: [value: ProjectType | '']
  filterStatus: [value: string]
}>()

const search = ref('')
const selectedType = ref<ProjectType | ''>('')
const selectedStatus = ref('')

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
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Selesai' }
]
</script>

<template>
  <div class="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-3">
    <!-- Search -->
    <div class="relative flex-1">
      <svg
        class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Cari project..."
        class="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-body text-secondary-900 placeholder-neutral-400 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
      />
    </div>

    <!-- Type Filter -->
    <select
      v-model="selectedType"
      class="h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-caption text-neutral-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 sm:w-44"
    >
      <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <!-- Status Filter -->
    <div class="flex items-center gap-2">
      <button
        v-for="opt in statusOptions"
        :key="opt.value"
        type="button"
        :class="[
          'rounded-full px-3 py-1.5 text-caption font-medium transition-all',
          selectedStatus === opt.value
            ? 'bg-primary-500 text-white shadow-sm'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        ]"
        @click="selectedStatus = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
