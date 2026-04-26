<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label -->
    <label v-if="label" class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
      {{ label }}
      <span v-if="required" class="text-primary-400 text-base leading-none">*</span>
    </label>

    <!-- Input Trigger -->
    <div class="relative" ref="containerRef">
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm text-left transition-all duration-200 focus:outline-none"
        :class="[
          disabled
            ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : error
              ? 'border-danger-400 bg-white text-neutral-800 focus:ring-2 focus:ring-danger-200'
              : isOpen
                ? 'border-primary-400 bg-white ring-2 ring-primary-200 shadow-md text-neutral-800'
                : 'border-neutral-300 bg-white text-neutral-800 hover:border-primary-300 shadow-sm'
        ]"
        :disabled="disabled"
        @click="toggleCalendar"
      >
        <!-- Display value -->
        <span :class="displayValue ? 'text-neutral-800' : 'text-neutral-400'">
          {{ displayValue || placeholder }}
        </span>
        <!-- Calendar icon -->
        <svg
          class="h-5 w-5 text-neutral-400 shrink-0 transition-colors"
          :class="{ 'text-primary-400': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      <!-- Calendar Panel -->
      <transition
        enter-active-class="transition-all ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isOpen"
          class="absolute left-0 z-20 mt-2 w-full min-w-[300px] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 focus:outline-none"
        >
          <!-- Calendar Header: Month/Year Navigation -->
          <div class="flex items-center justify-between mb-4">
            <button
              type="button"
              class="rounded-lg p-1.5 hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-800"
              @click="prevMonth"
            >
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>

            <span class="text-sm font-bold text-neutral-800">
              {{ monthNames[viewMonth] }} {{ viewYear }}
            </span>

            <button
              type="button"
              class="rounded-lg p-1.5 hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-800"
              @click="nextMonth"
            >
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Day Headers -->
          <div class="grid grid-cols-7 mb-2">
            <div
              v-for="day in dayHeaders"
              :key="day"
              class="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400 py-1"
            >
              {{ day }}
            </div>
          </div>

          <!-- Day Grid -->
          <div class="grid grid-cols-7 gap-y-1">
            <!-- Empty cells for offset -->
            <div v-for="n in firstDayOffset" :key="`empty-${n}`" />

            <!-- Day cells -->
            <button
              v-for="day in daysInMonth"
              :key="day"
              type="button"
              class="flex items-center justify-center h-8 w-full rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none"
              :class="getDayClass(day)"
              :disabled="isDayDisabled(day)"
              @click="selectDay(day)"
            >
              {{ day }}
            </button>
          </div>

          <!-- Footer: Today + Clear buttons -->
          <div class="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <button
              type="button"
              class="text-xs font-semibold text-primary-500 hover:text-primary-700 transition-colors"
              @click="selectToday"
            >
              Hari Ini
            </button>
            <button
              v-if="hasValue"
              type="button"
              class="text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
              @click="clearValue"
            >
              Hapus
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Error message -->
    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <svg class="h-3.5 w-3.5 text-danger-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
      <span class="text-caption text-danger-500">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// ─── Types ──────────────────────────────────────────────────────────────────

export type DatePickerMode = 'single' | 'range'
export type DateValue = Date | null
export type RangeValue = { start: Date | null; end: Date | null }

interface Props {
  modelValue?: DateValue | RangeValue
  mode?: DatePickerMode
  label?: string
  placeholder?: string
  minDate?: Date | string
  maxDate?: Date | string
  required?: boolean
  disabled?: boolean
  error?: string
}

// ─── Props & Emits ───────────────────────────────────────────────────────────

const props = withDefaults(defineProps<Props>(), {
  mode: 'single',
  placeholder: 'Pilih tanggal'
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | RangeValue]
}>()

// ─── State ───────────────────────────────────────────────────────────────────

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const today = new Date()

// Calendar navigation state
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

// Range mode hover tracking
const hoverDay = ref<number | null>(null)

// ─── Constants ───────────────────────────────────────────────────────────────

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

// ─── Computed ────────────────────────────────────────────────────────────────

const daysInMonth = computed(() => {
  return new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
})

const firstDayOffset = computed(() => {
  return new Date(viewYear.value, viewMonth.value, 1).getDay()
})

const minDateObj = computed(() =>
  props.minDate ? new Date(props.minDate) : null
)

const maxDateObj = computed(() =>
  props.maxDate ? new Date(props.maxDate) : null
)

// Single mode value
const singleValue = computed<DateValue>(() => {
  if (props.mode === 'single') return props.modelValue as DateValue
  return null
})

// Range mode values
const rangeValue = computed<RangeValue>(() => {
  if (props.mode === 'range') return props.modelValue as RangeValue || { start: null, end: null }
  return { start: null, end: null }
})

const hasValue = computed(() => {
  if (props.mode === 'single') return !!singleValue.value
  return !!(rangeValue.value.start || rangeValue.value.end)
})

const displayValue = computed(() => {
  if (props.mode === 'single') {
    return singleValue.value ? formatDate(singleValue.value) : ''
  }
  const { start, end } = rangeValue.value
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`
  if (start) return `${formatDate(start)} – ...`
  return ''
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (date: Date): string => {
  const d = date.getDate().toString().padStart(2, '0')
  const m = monthNames[date.getMonth()]
  const y = date.getFullYear()
  return `${d} ${m} ${y}`
}

const makeDateFromView = (day: number) =>
  new Date(viewYear.value, viewMonth.value, day)

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const isDayDisabled = (day: number): boolean => {
  const d = makeDateFromView(day)
  if (minDateObj.value && d < minDateObj.value) return true
  if (maxDateObj.value && d > maxDateObj.value) return true
  return false
}

// ─── Day Styling ─────────────────────────────────────────────────────────────

const getDayClass = (day: number) => {
  const d = makeDateFromView(day)
  const isToday = isSameDay(d, today)
  const disabled = isDayDisabled(day)

  if (disabled) {
    return 'text-neutral-300 cursor-not-allowed'
  }

  if (props.mode === 'single') {
    const selected = singleValue.value && isSameDay(d, singleValue.value)
    if (selected) return 'bg-primary-500 text-white font-bold shadow-sm'
    if (isToday) return 'ring-1 ring-primary-300 text-primary-600 font-semibold hover:bg-primary-50'
    return 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'
  }

  // Range mode
  const { start, end } = rangeValue.value
  const isStart = start && isSameDay(d, start)
  const isEnd = end && isSameDay(d, end)

  const hoverDate = hoverDay.value ? makeDateFromView(hoverDay.value) : null
  const rangeEnd = end || hoverDate

  const inRange = start && rangeEnd && d > start && d < rangeEnd

  if (isStart || isEnd) return 'bg-primary-500 text-white font-bold shadow-sm z-10 relative'
  if (inRange) return 'bg-primary-100 text-primary-700 rounded-none cursor-pointer'
  if (isToday) return 'ring-1 ring-primary-300 text-primary-600 font-semibold hover:bg-primary-50'
  return 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'
}

// ─── Actions ─────────────────────────────────────────────────────────────────

const toggleCalendar = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const prevMonth = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

const nextMonth = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

const selectDay = (day: number) => {
  const d = makeDateFromView(day)

  if (props.mode === 'single') {
    emit('update:modelValue', d)
    isOpen.value = false
    return
  }

  // Range mode
  const { start, end } = rangeValue.value
  if (!start || (start && end)) {
    // Start fresh: set only start date
    emit('update:modelValue', { start: d, end: null })
  } else {
    // Already has start, set end (ensure start < end)
    if (d < start) {
      emit('update:modelValue', { start: d, end: start })
    } else {
      emit('update:modelValue', { start, end: d })
    }
    isOpen.value = false
  }
}

const selectToday = () => {
  if (props.mode === 'single') {
    emit('update:modelValue', today)
    isOpen.value = false
  } else {
    emit('update:modelValue', { start: today, end: null })
  }
}

const clearValue = () => {
  if (props.mode === 'single') {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', { start: null, end: null })
  }
}

// ─── Click Outside ───────────────────────────────────────────────────────────

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
