<template>
  <div class="relative flex items-center w-full">
    <!-- Icon Left (Search or Loading) -->
    <div class="absolute left-4 text-neutral-400">
      <svg
        v-if="loading"
        class="animate-spin h-5 w-5 text-primary-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
        ></path>
      </svg>
      <svg
        v-else
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Input -->
    <input
      type="text"
      v-model="localValue"
      :placeholder="placeholder"
      class="w-full bg-white border border-neutral-200 rounded-lg pl-9 pr-3.5 py-1.5 font-body-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-neutral-400 text-neutral-800"
      v-bind="$attrs"
    />

    <!-- Clear Button -->
    <div
      v-if="localValue && !loading"
      class="absolute right-3 text-neutral-400"
    >
      <button
        type="button"
        @click="clear"
        class="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
        aria-label="Clear search"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    loading?: boolean
    debounceMs?: number
  }>(),
  {
    modelValue: '',
    placeholder: '',
    loading: false,
    debounceMs: 300
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)

// Keep localValue updated when prop changes from outside
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal || ''
    }
  }
)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Watch localValue changes and emit update:modelValue with debounce
watch(localValue, (newVal) => {
  // If the change matches the current prop value, do not emit again
  if (newVal === props.modelValue) return

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // If the input is cleared, emit immediately for responsiveness
  if (!newVal) {
    emit('update:modelValue', '')
    return
  }

  debounceTimer = setTimeout(() => {
    emit('update:modelValue', newVal)
  }, props.debounceMs)
})

// Clean up timer on component unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})

const clear = () => {
  localValue.value = ''
}
</script>
