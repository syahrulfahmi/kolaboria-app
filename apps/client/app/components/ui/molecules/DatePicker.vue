<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { DatePickerMode, DatePickerGranularity, DateValue, RangeValue } from '../../../types/date-picker'
import { monthNames } from '../../../utils/year-month'
import Calendar from './DatePickerCalendar.vue'
import Drawer from '../organisms/Drawer.vue'

export type { DatePickerMode, DatePickerGranularity, DateValue, RangeValue } from '../../../types/date-picker'

const props = withDefaults(defineProps<{
  modelValue?: DateValue | RangeValue
  mode?: DatePickerMode
  granularity?: DatePickerGranularity
  initialViewYear?: number
  label?: string
  placeholder?: string
  minDate?: Date | string
  maxDate?: Date | string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}>(), { mode: 'single', granularity: 'day' })

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | RangeValue]
}>()

const triggerId = useId()
const panelId = `${triggerId}-panel`
const messageId = `${triggerId}-message`
const isOpen = ref(false)
const isMobile = useMediaQuery('(max-width: 639px)')
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const openUpward = ref(false)
const panelStyle = ref<Record<string, string>>({})
const pickerTitle = computed(() => props.label || (props.granularity === 'month'
  ? 'Pilih bulan dan tahun' : 'Pilih tanggal'))
const placeholder = computed(() => props.placeholder || (props.granularity === 'month'
  ? 'Pilih bulan dan tahun' : 'Pilih tanggal'))
const calendarProps = computed(() => ({
  modelValue: props.modelValue,
  mode: props.mode,
  granularity: props.granularity,
  initialViewYear: props.initialViewYear,
  minDate: props.minDate,
  maxDate: props.maxDate
}))

const formatDate = (date: Date) => {
  const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  return props.granularity === 'month' ? monthYear
    : `${String(date.getDate()).padStart(2, '0')} ${monthYear}`
}
const displayValue = computed(() => {
  const value = props.modelValue
  if (props.mode === 'single') return value instanceof Date ? formatDate(value) : ''
  if (!value || value instanceof Date || !value.start) return ''
  return `${formatDate(value.start)} – ${value.end ? formatDate(value.end) : '...'}`
})

const calculatePosition = () => {
  if (isMobile.value || !triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const margin = 8
  const width = Math.min(Math.max(rect.width, 300), window.innerWidth - margin * 2)
  const height = panelRef.value?.offsetHeight ?? 340
  const spaceBelow = window.innerHeight - rect.bottom
  openUpward.value = spaceBelow < height && rect.top > spaceBelow
  const top = openUpward.value ? rect.top - height - 4 : rect.bottom + 4
  panelStyle.value = {
    left: `${Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin))}px`,
    top: `${Math.max(margin, Math.min(top, window.innerHeight - height - margin))}px`,
    width: `${width}px`,
    maxHeight: `${window.innerHeight - margin * 2}px`
  }
}
const closePicker = () => {
  isOpen.value = false
  triggerRef.value?.focus()
}
const togglePicker = async () => {
  if (props.disabled) return
  if (isOpen.value) return closePicker()
  isOpen.value = true
  calculatePosition()
  await nextTick()
  calculatePosition()
  panelRef.value?.focus({ preventScroll: true })
}
const updateValue = (value: DateValue | RangeValue) => {
  if (!props.disabled) emit('update:modelValue', value)
}
const handlePointerDown = (event: PointerEvent) => {
  if (!isOpen.value || isMobile.value || !(event.target instanceof Node)) return
  if (!triggerRef.value?.contains(event.target) && !panelRef.value?.contains(event.target)) {
    isOpen.value = false
  }
}
const handleEscape = (event: KeyboardEvent) => {
  if (isOpen.value && event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closePicker()
  }
}
const handleViewportChange = () => {
  if (isOpen.value) calculatePosition()
}
watch(() => props.disabled, disabled => { if (disabled) isOpen.value = false })
watch(isMobile, async () => {
  if (!isOpen.value) return
  await nextTick()
  calculatePosition()
  panelRef.value?.focus({ preventScroll: true })
})
onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('keydown', handleEscape)
  window.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('scroll', handleViewportChange, true)
  window.removeEventListener('resize', handleViewportChange)
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="triggerId" class="font-label-1">
      {{ label }} <span v-if="required" class="text-danger-500 leading-none">*</span>
    </label>
    <button
      :id="triggerId"
      ref="triggerRef"
      type="button"
      class="flex min-h-11 w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      :class="disabled
        ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
        : error ? 'border-danger-300 bg-white text-neutral-800'
        : isOpen ? 'border-primary-500 bg-white text-neutral-800'
        : 'border-neutral-300 bg-white text-neutral-800 hover:border-primary-300'"
      :disabled="disabled"
      :aria-label="label || placeholder"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? panelId : undefined"
      :aria-invalid="!!error"
      :aria-describedby="error || hint ? messageId : undefined"
      @click="togglePicker"
    >
      <span :class="displayValue ? 'text-neutral-800' : 'text-neutral-400'">{{ displayValue || placeholder }}</span>
      <Icon name="lucide:calendar-days" class="h-5 w-5 shrink-0 text-neutral-400" :class="{ 'text-primary-500': isOpen }" aria-hidden="true" />
    </button>

    <Drawer
      v-if="isMobile"
      :model-value="isOpen"
      :title="pickerTitle"
      :z-index="10000"
      @close="closePicker"
    >
      <div :id="panelId" ref="panelRef" tabindex="-1" class="outline-none">
        <Calendar v-bind="calendarProps" @update:model-value="updateValue" @complete="closePicker" />
      </div>
    </Drawer>
    <Teleport v-else to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        :enter-from-class="openUpward ? 'opacity-0 translate-y-2' : 'opacity-0 -translate-y-2'"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          :id="panelId"
          ref="panelRef"
          tabindex="-1"
          role="dialog"
          :aria-label="pickerTitle"
          class="fixed z-[9999] overflow-y-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5 outline-none"
          :style="panelStyle"
        >
          <Calendar v-bind="calendarProps" @update:model-value="updateValue" @complete="closePicker" />
        </div>
      </Transition>
    </Teleport>
    <span v-if="error" :id="messageId" class="font-body-3 text-danger-500">{{ error }}</span>
    <span v-else-if="hint" :id="messageId" class="font-body-3 text-secondary mt-1">{{ hint }}</span>
  </div>
</template>
