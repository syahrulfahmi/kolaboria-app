<template>
  <label
    class="inline-flex items-center gap-3 group"
    :class="[
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    ]"
  >
    <div class="relative flex items-center justify-center">
      <input
        type="radio"
        class="peer sr-only"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        @change="handleChange"
      />
      <!-- Outer circle -->
      <div
        class="flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-150 ease-in-out peer-focus-visible:ring-2 peer-focus-visible:ring-primary-200 peer-focus-visible:ring-offset-1"
        :class="[
          disabled ? 'border-neutral-300 bg-neutral-100' : 'border-neutral-300 bg-white group-hover:border-primary-400',
          isChecked ? 'border-primary-500 shadow-sm ring-1 ring-primary-100' : ''
        ]"
      >
        <!-- Inner circle (dot) -->
        <div
          class="h-2 w-2 rounded-full transition-transform duration-150 ease-in-out"
          :class="[
            disabled ? 'bg-neutral-400' : 'bg-primary-500',
            isChecked ? 'scale-100' : 'scale-0'
          ]"
        ></div>
      </div>
    </div>
    <span v-if="label" class="text-sm font-medium text-neutral-800 select-none">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  modelValue?: string | number | boolean
  value: string | number | boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
}
</script>
