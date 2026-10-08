<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="resolvedId" class="font-label-1 text-primary">
      {{ label }}
      <span v-if="required" class="text-danger-500 leading-none">*</span>
    </label>

    <div class="relative flex items-center">
      <!-- Icon Left -->
      <div v-if="$slots['icon-left']" class="absolute left-3 text-neutral-400">
        <slot name="icon-left" />
      </div>

      <input
        :type="inputType"
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
        :id="resolvedId"
        :aria-describedby="descriptionId"
        :aria-invalid="error ? 'true' : undefined"
        :required="required"
        class="w-full rounded-lg border bg-white px-4 py-2.5 text-body text-neutral-900 transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
        :class="[
          $slots['icon-left'] ? 'pl-10' : '',
          $slots['icon-right'] || type === 'password' ? 'pr-10' : '',
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-neutral-300 focus:border-primary-500',
          type === 'number'
            ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            : ''
        ]"
        v-bind="$attrs"
      />

      <!-- Icon Right or Password Toggle -->
      <div
        v-if="$slots['icon-right'] || type === 'password'"
        class="absolute right-3 flex items-center text-neutral-400"
      >
        <button
          v-if="type === 'password'"
          type="button"
          @click="togglePassword"
          class="focus:outline-none hover:text-neutral-600 transition-colors flex items-center justify-center"
          tabindex="-1"
          :aria-label="
            showPassword ? 'Sembunyikan password' : 'Tampilkan password'
          "
        >
          <!-- Eye Slash Icon (Hide) -->
          <Icon name="lucide:eye-off" v-if="showPassword" class="h-5 w-5" />
          <!-- Eye Icon (Show) -->
          <Icon name="lucide:eye" v-else class="h-5 w-5" />
        </button>
        <slot v-else name="icon-right" />
      </div>
    </div>

    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <Icon name="lucide:circle-alert" class="h-3.5 w-3.5 text-red-500 shrink-0" />
      <span :id="errorId" class="font-body-3 text-red-500">{{ error }}</span>
    </div>
    <span v-else-if="hint" :id="hintId" class="font-body-3 text-secondary mt-1">{{
      hint
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue'

const props = defineProps<{
  label?: string
  id?: string
  modelValue?: string | number
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  type?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
const generatedId = useId()
const resolvedId = computed(() => props.id || 'input-' + generatedId)
const hintId = computed(() => resolvedId.value + '-hint')
const errorId = computed(() => resolvedId.value + '-error')
const descriptionId = computed(() =>
  props.error ? errorId.value : props.hint ? hintId.value : undefined
)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type || 'text'
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>
