<template>
  <div class="flex flex-col gap-1.5">
    <div
      v-if="label || (showCounter && maxLength)"
      class="flex items-center justify-between"
    >
      <label v-if="label" :for="resolvedId" class="font-label-1 text-primary">
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
      :id="resolvedId"
      :aria-describedby="descriptionId"
      :aria-invalid="error ? 'true' : undefined"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      class="w-full resize-none rounded-xl border bg-white px-4 py-3 font-body-2 text-primary transition-colors duration-200 focus:border-primary-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500"
      :class="[
        error
          ? 'border-red-300 focus:border-red-500'
          : 'border-neutral-300 focus:border-primary-500'
      ]"
      v-bind="$attrs"
    />

    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <Icon
        name="lucide:circle-alert"
        class="h-3.5 w-3.5 text-red-500 shrink-0"
      />
      <span :id="errorId" class="font-body-3 text-red-500">{{ error }}</span>
    </div>
    <span
      v-else-if="hint"
      :id="hintId"
      class="font-body-3 text-secondary mt-1"
      >{{ hint }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    id?: string
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

const generatedId = useId()
const resolvedId = computed(() => props.id || 'textarea-' + generatedId)
const hintId = computed(() => resolvedId.value + '-hint')
const errorId = computed(() => resolvedId.value + '-error')
const descriptionId = computed(() =>
  props.error ? errorId.value : props.hint ? hintId.value : undefined
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
