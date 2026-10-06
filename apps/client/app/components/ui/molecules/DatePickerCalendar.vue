<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DatePickerGranularity, DatePickerMode, DateValue, RangeValue } from '../../../types/date-picker'
import { monthIndex, monthNames } from '../../../utils/year-month'
import Dropdown from './Dropdown.vue'
import IconButton from '../atoms/IconButton.vue'
import Button from '../atoms/Button.vue'

const props = withDefaults(defineProps<{
  modelValue?: DateValue | RangeValue
  mode?: DatePickerMode
  granularity?: DatePickerGranularity
  initialViewYear?: number
  minDate?: Date | string
  maxDate?: Date | string
}>(), { mode: 'single', granularity: 'day' })

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | RangeValue]
  complete: []
}>()

const today = new Date()
const minDate = computed(() => props.minDate ? new Date(props.minDate) : null)
const maxDate = computed(() => props.maxDate ? new Date(props.maxDate) : null)
const firstYear = computed(() => minDate.value?.getFullYear() ?? today.getFullYear() - 100)
const lastYear = computed(() => maxDate.value?.getFullYear() ?? today.getFullYear() + 10)
const years = computed(() => Array.from(
  { length: Math.max(0, lastYear.value - firstYear.value + 1) },
  (_, index) => ({ label: String(lastYear.value - index), value: lastYear.value - index })
))
const singleValue = computed(() => props.modelValue instanceof Date ? props.modelValue : null)
const rangeValue = computed<RangeValue>(() =>
  props.mode === 'range' && props.modelValue && !(props.modelValue instanceof Date)
    ? props.modelValue : { start: null, end: null }
)
const initialDate = singleValue.value || rangeValue.value.start
const viewYear = ref(Math.max(firstYear.value, Math.min(
  initialDate?.getFullYear() ?? props.initialViewYear ?? today.getFullYear(),
  lastYear.value
)))
const viewMonth = ref(initialDate?.getMonth() ?? today.getMonth())
const hoverDate = ref<Date | null>(null)
const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate())
const firstDayOffset = computed(() => new Date(viewYear.value, viewMonth.value, 1).getDay())
const hasValue = computed(() => props.mode === 'single'
  ? !!singleValue.value : !!(rangeValue.value.start || rangeValue.value.end))

const dateKey = (date: Date) => props.granularity === 'month'
  ? monthIndex(date) : new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
const isDisabled = (date: Date) =>
  !!((minDate.value && dateKey(date) < dateKey(minDate.value)) ||
    (maxDate.value && dateKey(date) > dateKey(maxDate.value)))
const monthDate = (month: number) => new Date(viewYear.value, month, 1)
const dayDate = (day: number) => new Date(viewYear.value, viewMonth.value, day)
const isSelected = (date: Date) => {
  const values = props.mode === 'single'
    ? [singleValue.value] : [rangeValue.value.start, rangeValue.value.end]
  return values.some(value => value && dateKey(value) === dateKey(date))
}
const cellClass = (date: Date) => {
  if (isDisabled(date)) return 'text-neutral-300 cursor-not-allowed'
  if (isSelected(date)) return 'bg-primary-500 text-white font-semibold'
  const { start, end } = rangeValue.value
  const rangeEnd = end || hoverDate.value
  if (props.mode === 'range' && start && rangeEnd &&
    dateKey(date) > dateKey(start) && dateKey(date) < dateKey(rangeEnd)) {
    return 'bg-primary-100 text-primary-700'
  }
  if (dateKey(date) === dateKey(today)) {
    return 'ring-1 ring-primary-300 text-primary-600 hover:bg-primary-50'
  }
  return 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
}

const updateYear = (value: string | number | (string | number)[] | null) => {
  if (typeof value !== 'number' || !Number.isInteger(value)) return
  if (value >= firstYear.value && value <= lastYear.value) viewYear.value = value
}
const navigate = (direction: -1 | 1) => {
  if (props.granularity === 'month') {
    viewYear.value = Math.max(firstYear.value, Math.min(viewYear.value + direction, lastYear.value))
    return
  }
  const date = new Date(viewYear.value, viewMonth.value + direction, 1)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}
const selectDate = (date: Date) => {
  if (isDisabled(date)) return
  if (props.mode === 'single') {
    emit('update:modelValue', date)
    emit('complete')
    return
  }
  const { start, end } = rangeValue.value
  if (!start || end) emit('update:modelValue', { start: date, end: null })
  else {
    emit('update:modelValue', dateKey(date) < dateKey(start)
      ? { start: date, end: start } : { start, end: date })
    emit('complete')
  }
}
const selectToday = () => {
  const date = props.granularity === 'month'
    ? new Date(today.getFullYear(), today.getMonth(), 1) : today
  if (isDisabled(date)) return
  if (props.mode === 'single') selectDate(date)
  else emit('update:modelValue', { start: date, end: null })
}
const clearValue = () => emit('update:modelValue', props.mode === 'single'
  ? null : { start: null, end: null })
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between gap-3">
      <IconButton
        shape="square"
        class="h-11 w-11 sm:h-10 sm:w-10"
        :aria-label="granularity === 'month' ? 'Tahun sebelumnya' : 'Bulan sebelumnya'"
        :disabled="granularity === 'month' && viewYear <= firstYear"
        @click="navigate(-1)"
      >
        <Icon name="lucide:chevron-left" class="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <Dropdown
        v-if="granularity === 'month'"
        :model-value="viewYear"
        :options="years"
        :teleport="false"
        searchable
        placeholder="Pilih tahun"
        class="min-w-0 flex-1 max-w-48 [&_input]:text-base sm:[&_input]:text-sm"
        @update:model-value="updateYear"
      />
      <span v-else class="text-sm font-semibold text-neutral-800">
        {{ monthNames[viewMonth] }} {{ viewYear }}
      </span>
      <IconButton
        shape="square"
        class="h-11 w-11 sm:h-10 sm:w-10"
        :aria-label="granularity === 'month' ? 'Tahun berikutnya' : 'Bulan berikutnya'"
        :disabled="granularity === 'month' && viewYear >= lastYear"
        @click="navigate(1)"
      >
        <Icon name="lucide:chevron-right" class="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
    <div v-if="granularity === 'month'" class="grid grid-cols-3 gap-2">
      <button
        v-for="(month, index) in monthNames"
        :key="month"
        type="button"
        class="min-h-11 rounded-lg px-1 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        :class="cellClass(monthDate(index))"
        :disabled="isDisabled(monthDate(index))"
        :aria-pressed="isSelected(monthDate(index))"
        :aria-label="`${month} ${viewYear}`"
        @click="selectDate(monthDate(index))"
        @mouseenter="hoverDate = monthDate(index)"
        @mouseleave="hoverDate = null"
      >{{ month }}</button>
    </div>
    <template v-else>
      <div class="mb-2 grid grid-cols-7">
        <div v-for="day in dayHeaders" :key="day" class="py-1 text-center font-label-3">
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-y-1">
        <div v-for="offset in firstDayOffset" :key="`empty-${offset}`" />
        <button
          v-for="day in daysInMonth"
          :key="day"
          type="button"
          class="flex h-11 sm:h-8 w-full items-center justify-center rounded-lg font-label-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          :class="cellClass(dayDate(day))"
          :disabled="isDisabled(dayDate(day))"
          :aria-pressed="isSelected(dayDate(day))"
          :aria-label="`${day} ${monthNames[viewMonth]} ${viewYear}`"
          @click="selectDate(dayDate(day))"
          @mouseenter="hoverDate = dayDate(day)"
          @mouseleave="hoverDate = null"
        >{{ day }}</button>
      </div>
    </template>

    <div class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
      <Button variant="ghost-primary" size="sm" class="min-h-11 sm:min-h-8" :disabled="isDisabled(today)" @click="selectToday">
        {{ granularity === 'month' ? 'Bulan Ini' : 'Hari Ini' }}
      </Button>
      <Button v-if="hasValue" variant="ghost-primary" size="sm" class="min-h-11 sm:min-h-8" @click="clearValue">
        Hapus
      </Button>
    </div>
  </div>
</template>
