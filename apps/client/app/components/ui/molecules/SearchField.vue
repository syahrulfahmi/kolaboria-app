<template>
  <div class="relative flex items-center w-full">
    <!-- Icon Left (Search or Loading) -->
    <div class="absolute left-4 text-neutral-400">
      <Icon name="lucide:loader-circle" v-if="loading" class="animate-spin h-5 w-5 text-primary-400" />
      <Icon name="lucide:search" v-else class="h-5 w-5" aria-hidden="true" />
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
        <Icon name="lucide:x" class="h-4 w-4" />
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
