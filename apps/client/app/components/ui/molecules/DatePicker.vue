<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label -->
    <label v-if="label" class="font-label-1">
      {{ label }}
      <span v-if="required" class="text-danger-500 leading-none">*</span>
    </label>

    <!-- Input Trigger -->
    <div class="relative" ref="triggerRef">
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm text-left transition-all duration-150 focus:outline-none"
        :class="[
          disabled
            ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : error
              ? 'border-red-300 focus:border-red-500 bg-white text-neutral-800'
              : isOpen
                ? 'border-primary-500 bg-white text-neutral-800'
                : 'border-neutral-300 bg-white text-neutral-800 hover:border-primary-300'
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
          :class="{ 'text-primary-500': isOpen }"
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

      <!-- Calendar Panel (Teleported to body) -->
      <Teleport to="body">
        <transition
          enter-active-class="transition-all ease-out duration-200"
          :enter-from-class="
            openUpward
              ? 'opacity-0 translate-y-2'
              : 'opacity-0 -translate-y-2'
          "
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          :leave-to-class="
            openUpward
              ? 'opacity-0 translate-y-2'
              : 'opacity-0 -translate-y-2'
          "
        >
          <div
            v-if="isOpen"
            ref="panelRef"
            class="fixed z-[9999] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 focus:outline-none"
            :style="panelStyle"
          >
            <!-- Calendar Header: Month/Year Navigation -->
            <div class="flex items-center justify-between mb-4">
              <button
                type="button"
                class="rounded-lg p-1.5 hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-800"
                @click="prevMonth"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
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
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <!-- Day Headers -->
            <div class="grid grid-cols-7 mb-2">
              <div
                v-for="day in dayHeaders"
                :key="day"
                class="text-center font-label-3 py-1"
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
                class="flex items-center justify-center h-8 w-full rounded-lg font-label-3 text-secondary transition-all duration-150 focus:outline-none"
                :class="getDayClass(day)"
                :disabled="isDayDisabled(day)"
                @click="selectDay(day)"
                @mouseenter="hoverDay = day"
                @mouseleave="hoverDay = null"
              >
                {{ day }}
              </button>
            </div>

            <!-- Footer: Today + Clear buttons -->
            <div
              class="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100"
            >
              <button
                type="button"
                class="font-label-3 text-primary-600 hover:text-primary-700 transition-colors"
                @click="selectToday"
              >
                Hari Ini
              </button>
              <button
                type="button"
                v-if="hasValue"
                class="font-label-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                @click="clearValue"
              >
                Hapus
              </button>
            </div>
          </div>
        </transition>
      </Teleport>
    </div>

    <!-- Error message -->
    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <svg
        class="h-3.5 w-3.5 text-danger-500 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="font-body-3 text-red-500">{{ error }}</span>
    </div>
    <span v-else-if="hint" class="font-body-3 text-secondary mt-1">{{
      hint
    }}</span>
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
  hint?: string
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
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const today = new Date()

// Calendar navigation state
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

// Range mode hover tracking
const hoverDay = ref<number | null>(null)

// Panel positioning
const openUpward = ref(false)
const panelStyle = ref<Record<string, string>>({})

const PANEL_MIN_HEIGHT = 340

// ─── Constants ───────────────────────────────────────────────────────────────

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
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
  if (props.mode === 'range')
    return (props.modelValue as RangeValue) || { start: null, end: null }
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
    if (isToday)
      return 'ring-1 ring-primary-300 text-primary-600 text-body hover:bg-primary-50'
    return 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'
  }

  // Range mode
  const { start, end } = rangeValue.value
  const isStart = start && isSameDay(d, start)
  const isEnd = end && isSameDay(d, end)

  const hoverDate = hoverDay.value ? makeDateFromView(hoverDay.value) : null
  const rangeEnd = end || hoverDate

  const inRange = start && rangeEnd && d > start && d < rangeEnd

  if (isStart || isEnd)
    return 'bg-primary-500 text-white font-bold shadow-sm z-10 relative'
  if (inRange)
    return 'bg-primary-100 text-primary-700 rounded-none cursor-pointer'
  if (isToday)
    return 'ring-1 ring-primary-300 text-primary-600 text-body hover:bg-primary-50'
  return 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'
}

// ─── Position ────────────────────────────────────────────────────────────────

const calculatePosition = () => {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  openUpward.value = spaceBelow < PANEL_MIN_HEIGHT && spaceAbove > spaceBelow

  panelStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${Math.max(rect.width, 300)}px`,
    zIndex: '9999',
    ...(openUpward.value
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` })
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────

const toggleCalendar = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    calculatePosition()
  }
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

// ─── Click Outside & Scroll/Resize ───────────────────────────────────────────

const handleClickOutside = (e: MouseEvent) => {
  const t = e.target as Node
  const outsideTrigger = triggerRef.value && !triggerRef.value.contains(t)
  const outsidePanel = panelRef.value && !panelRef.value.contains(t)
  if (outsideTrigger && outsidePanel) {
    isOpen.value = false
  }
}

const handleScrollOrResize = () => {
  if (isOpen.value) calculatePosition()
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>
