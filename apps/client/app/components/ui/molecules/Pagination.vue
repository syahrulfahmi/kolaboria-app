<template>
  <div
    v-if="totalPages > 0"
    class="w-full flex"
    :class="[
      showInfo
        ? 'flex-col sm:flex-row items-center justify-between gap-4'
        : alignClasses
    ]"
  >
    <!-- Optional Info Count -->
    <div
      v-if="showInfo"
      class="font-body-2 text-neutral-500 order-2 sm:order-1"
    >
      <span v-if="totalItems !== undefined">
        Menampilkan
        <strong class="font-semibold text-neutral-800">{{ startItem }}-{{ endItem }}</strong>
        dari
        <strong class="font-semibold text-neutral-800">{{ totalItems }}</strong>
        proyek
      </span>
      <span v-else>
        Halaman
        <strong class="font-semibold text-neutral-800">{{ modelValue }}</strong>
        dari
        <strong class="font-semibold text-neutral-800">{{ totalPages }}</strong>
      </span>
    </div>

    <!-- Standalone Pagination Buttons Row (Matches Gambar 2) -->
    <nav
      class="flex items-center gap-2"
      :class="{ 'order-1 sm:order-2': showInfo }"
      aria-label="Navigasi Halaman"
    >
      <!-- Previous Button (<) -->
      <button
        type="button"
        :disabled="modelValue <= 1 || disabled"
        @click="goToPage(modelValue - 1)"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 transition-colors hover:border-neutral-300 hover:text-neutral-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Halaman sebelumnya"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <!-- Page Numbers -->
      <template v-for="(page, idx) in visiblePages" :key="idx">
        <button
          v-if="typeof page === 'number'"
          type="button"
          :disabled="disabled"
          @click="goToPage(page)"
          class="flex h-10 min-w-10 px-2 items-center justify-center rounded-xl font-label-2 text-sm transition-colors cursor-pointer"
          :class="[
            page === modelValue
              ? 'border border-primary-600 bg-primary-600 font-bold text-white shadow-xs'
              : 'border border-neutral-200 bg-white font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900'
          ]"
          :aria-current="page === modelValue ? 'page' : undefined"
        >
          {{ page }}
        </button>
        <span
          v-else
          class="flex h-10 w-10 items-center justify-center font-body-2 text-neutral-400 select-none"
        >
          {{ page }}
        </span>
      </template>

      <!-- Next Button (>) -->
      <button
        type="button"
        :disabled="modelValue >= totalPages || disabled"
        @click="goToPage(modelValue + 1)"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Halaman selanjutnya"
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    totalPages: number
    totalItems?: number
    perPage?: number
    disabled?: boolean
    showInfo?: boolean
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    modelValue: 1,
    totalPages: 1,
    perPage: 10,
    disabled: false,
    showInfo: false,
    align: 'start'
  }
)

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number]
}>()

const alignClasses = computed(() => {
  switch (props.align) {
    case 'center':
      return 'justify-center'
    case 'end':
      return 'justify-end'
    case 'start':
    default:
      return 'justify-start'
  }
})

const startItem = computed(() => {
  if (!props.totalItems || props.totalItems === 0) return 0
  return (props.modelValue - 1) * props.perPage + 1
})

const endItem = computed(() => {
  if (!props.totalItems) return 0
  return Math.min(props.modelValue * props.perPage, props.totalItems)
})

const visiblePages = computed<(number | string)[]>(() => {
  const current = props.modelValue
  const total = props.totalPages
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = [1]

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)
  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return
  emit('update:modelValue', page)
  emit('change', page)
}
</script>
