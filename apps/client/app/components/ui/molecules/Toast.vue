<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ToastVariant } from '../../../composables/useToast'

const props = defineProps<{
  id: string
  variant: ToastVariant
  title?: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'close', id: string): void
}>()

const iconPath = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'danger':
      return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return {
        wrapper:
          'bg-white border-l-4 border-l-success-500 border-y-neutral-200 border-r-neutral-200 shadow-lg shadow-success-500/10',
        icon: 'text-success-500',
        title: 'text-neutral-900',
        message: 'text-neutral-600',
        close: 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
      }
    case 'danger':
      return {
        wrapper:
          'bg-white border-l-4 border-l-danger-500 border-y-neutral-200 border-r-neutral-200 shadow-lg shadow-danger-500/10',
        icon: 'text-danger-500',
        title: 'text-neutral-900',
        message: 'text-neutral-600',
        close: 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
      }
    case 'warning':
      return {
        wrapper:
          'bg-white border-l-4 border-l-accent-500 border-y-neutral-200 border-r-neutral-200 shadow-lg shadow-accent-500/10',
        icon: 'text-accent-500',
        title: 'text-neutral-900',
        message: 'text-neutral-600',
        close: 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
      }
    case 'info':
    default:
      return {
        wrapper:
          'bg-white border-l-4 border-l-primary-500 border-y-neutral-200 border-r-neutral-200 shadow-lg shadow-primary-500/10',
        icon: 'text-primary-500',
        title: 'text-neutral-900',
        message: 'text-neutral-600',
        close: 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
      }
  }
})

const isVisible = ref(false)

onMounted(() => {
  // trigger animation after mount
  setTimeout(() => {
    isVisible.value = true
  }, 50)
})
</script>

<template>
  <div
    class="flex items-start gap-3 p-4 border rounded-xl pointer-events-auto w-full sm:w-[350px] transition-all duration-300 transform"
    :class="[
      variantClasses.wrapper,
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
    ]"
    role="alert"
  >
    <svg
      class="w-6 h-6 shrink-0 mt-0.5"
      :class="variantClasses.icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
    </svg>
    <div class="flex-1 min-w-0">
      <h4
        v-if="title"
        class="text-sm font-bold mb-1 truncate"
        :class="variantClasses.title"
      >
        {{ title }}
      </h4>
      <p class="text-sm leading-snug" :class="variantClasses.message">
        {{ message }}
      </p>
    </div>
    <button
      type="button"
      class="p-1.5 rounded-md transition-colors shrink-0 -mt-1 -mr-1"
      :class="variantClasses.close"
      @click="emit('close', id)"
      aria-label="Tutup"
    >
      <svg
        class="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
