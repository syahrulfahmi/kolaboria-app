<template>
  <div class="flex flex-col gap-1.5" ref="dropdownRef">
    <label
      v-if="label"
      class="text-xs font-semibold tracking-wide uppercase text-neutral-500"
    >
      {{ label }}
      <span v-if="required" class="text-primary-400 text-base leading-none"
        >*</span
      >
    </label>

    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        :disabled="disabled"
        class="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
        :class="[
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-neutral-300 hover:border-primary-300 focus:border-primary-400 focus:ring-primary-200',
          !selectedOption ? 'text-neutral-400' : 'text-neutral-900',
          !isOpen && !disabled ? 'shadow-sm' : ''
        ]"
      >
        <span class="block truncate">{{
          selectedOption ? selectedOption.label : placeholder
        }}</span>
        <svg
          class="h-5 w-5 text-neutral-400 transition-transform duration-200"
          :class="{ 'rotate-180 text-primary-400': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <transition
        enter-active-class="transition-all ease-out duration-150"
        enter-from-class="transform opacity-0 -translate-y-3"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition-all ease-in duration-150"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-3"
      >
        <div
          v-if="isOpen"
          class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1.5 shadow-lg shadow-secondary-900/10 ring-1 ring-black/5 focus:outline-none"
        >
          <ul role="listbox">
            <li
              v-for="option in options"
              :key="String(option.value)"
              @click="selectOption(option)"
              class="relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-body text-neutral-800 transition-colors border-l-2"
              :class="[
                isSelected(option)
                  ? 'bg-primary-50 text-primary-700 font-medium border-primary-500'
                  : 'border-transparent hover:bg-neutral-50 hover:text-neutral-900 hover:border-primary-300'
              ]"
              role="option"
              :aria-selected="isSelected(option)"
            >
              <span class="block truncate">{{ option.label }}</span>
              <span
                v-if="isSelected(option)"
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-500"
              >
                <svg
                  class="h-5 w-5"
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
              </span>
            </li>
            <li
              v-if="options.length === 0"
              class="py-3 px-4 text-body text-neutral-500 text-center"
            >
              Tidak ada opsi
            </li>
          </ul>
        </div>
      </transition>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  label?: string
  modelValue?: string | number | null
  options: Option[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return null
  return props.options.find((opt) => opt.value === props.modelValue) || null
})

const isSelected = (option: Option) => {
  return option.value === props.modelValue
}

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
