<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      class="text-xs font-semibold tracking-wide uppercase text-neutral-500"
    >
      {{ label }}
      <span v-if="required" class="text-primary-400 text-base leading-none"
        >*</span
      >
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
        :required="required"
        class="w-full rounded-lg border bg-white px-4 py-2.5 text-body text-neutral-900 transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
        :class="[
          $slots['icon-left'] ? 'pl-10' : '',
          $slots['icon-right'] || type === 'password' ? 'pr-10' : '',
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-neutral-300 focus:border-primary-500'
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
          <svg
            v-if="showPassword"
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
          <!-- Eye Icon (Show) -->
          <svg
            v-else
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <slot v-else name="icon-right" />
      </div>
    </div>

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
      <span class="text-caption text-red-500">{{ error }}</span>
    </div>
    <span v-else-if="hint" class="text-caption text-neutral-500 mt-0.5">{{
      hint
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  label?: string
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
