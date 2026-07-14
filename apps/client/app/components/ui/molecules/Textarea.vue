<template>
  <div class="flex flex-col gap-1.5">
    <div
      v-if="label || (showCounter && maxLength)"
      class="flex items-center justify-between"
    >
      <label v-if="label" class="font-label-1">
        {{ label }}
        <span v-if="required" class="text-danger-500 leading-none">*</span>
      </label>
      <span
        v-if="showCounter && maxLength"
        class="font-label-2"
        :class="
          (modelValue?.length || 0) >= Number(maxLength) * 0.96
            ? 'text-red-500 font-bold'
            : 'text-neutral-400'
        "
      >
        {{ modelValue?.length || 0 }} / {{ maxLength }}
      </span>
    </div>

    <textarea
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      class="w-full resize-none rounded-xl border bg-white px-4 py-3 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500"
      :class="[
        error
          ? 'border-red-300 focus:border-red-500'
          : 'border-neutral-300 focus:border-primary-500'
      ]"
      v-bind="$attrs"
    />

    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <svg
        class="h-3.5 w-3.5 text-red-500 shrink-0"
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
      <span class="font-body-3 text-danger">{{ error }}</span>
    </div>
    <span v-else-if="hint" class="font-body-3 text-secondary mt-1">{{
      hint
    }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    modelValue?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    rows?: number | string
    maxLength?: number | string
    showCounter?: boolean
  }>(),
  {
    rows: 3,
    showCounter: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
