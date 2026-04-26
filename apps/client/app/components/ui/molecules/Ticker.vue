<script setup lang="ts">
import { computed } from 'vue'

export type TickerVariant = 'success' | 'info' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    variant?: TickerVariant
    title?: string
    message: string
    closable?: boolean
  }>(),
  {
    variant: 'info',
    closable: true
  }
)

const emit = defineEmits<{
  (e: 'close'): void
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
        wrapper: 'bg-success-50 border-success-200',
        icon: 'text-success-500',
        title: 'text-success-900',
        message: 'text-success-700',
        close: 'text-success-500 hover:text-success-700 hover:bg-success-100'
      }
    case 'danger':
      return {
        wrapper: 'bg-danger-50 border-danger-200',
        icon: 'text-danger-500',
        title: 'text-danger-900',
        message: 'text-danger-700',
        close: 'text-danger-500 hover:text-danger-700 hover:bg-danger-100'
      }
    case 'warning':
      return {
        wrapper: 'bg-accent-50 border-accent-200',
        icon: 'text-accent-500',
        title: 'text-accent-900',
        message: 'text-accent-700',
        close: 'text-accent-500 hover:text-accent-700 hover:bg-accent-100'
      }
    case 'info':
    default:
      return {
        wrapper: 'bg-primary-50 border-primary-200',
        icon: 'text-primary-500',
        title: 'text-primary-900',
        message: 'text-primary-700',
        close: 'text-primary-500 hover:text-primary-700 hover:bg-primary-100'
      }
  }
})
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-xl border p-4 transition-all duration-300"
    :class="variantClasses.wrapper"
    role="alert"
  >
    <svg
      class="w-5 h-5 shrink-0 mt-0.5"
      :class="variantClasses.icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
    </svg>
    <div class="flex-1">
      <h4
        v-if="title"
        class="text-sm font-semibold mb-0.5"
        :class="variantClasses.title"
      >
        {{ title }}
      </h4>
      <p class="text-sm leading-relaxed" :class="variantClasses.message">
        {{ message }}
      </p>
    </div>
    <button
      v-if="closable"
      type="button"
      class="p-1 rounded-md transition-colors shrink-0"
      :class="variantClasses.close"
      @click="emit('close')"
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
