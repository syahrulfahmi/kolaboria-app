<template>
  <label
    class="inline-flex items-center gap-3 group"
    :class="[disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
  >
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        class="peer sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
      />
      <!-- Checkbox Box -->
      <div
        class="h-[18px] w-[18px] rounded border transition-all duration-150 ease-in-out peer-focus-visible:ring-2 peer-focus-visible:ring-primary-200 peer-focus-visible:ring-offset-1"
        :class="[
          disabled
            ? 'border-neutral-300 bg-neutral-100'
            : modelValue
              ? 'border-primary-500 bg-primary-500 ring-1 ring-primary-200'
              : 'border-neutral-300 bg-white group-hover:border-primary-400'
        ]"
      ></div>
      <!-- Check icon -->
      <svg
        class="pointer-events-none absolute h-3.5 w-3.5 text-white transition-transform duration-150 ease-in-out"
        :class="modelValue ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <span v-if="label" class="text-sm font-medium text-neutral-800 select-none">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  modelValue?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
