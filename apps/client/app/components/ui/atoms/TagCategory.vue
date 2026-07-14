<template>
  <span
    class="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1 font-label-2 tracking-wider transition-colors"
    :class="variantClasses"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }>(),
  {
    variant: 'default'
  }
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-50 text-primary-700 ring-1 ring-primary-200/50'
    case 'success':
      return 'bg-success-50 text-success-700 ring-1 ring-success-200/50'
    case 'warning':
      return 'bg-accent-50 text-accent-700 ring-1 ring-accent-200/50'
    case 'danger':
      return 'bg-danger-50 text-danger-700 ring-1 ring-danger-200/50'
    case 'info':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50'
    case 'default':
    default:
      return 'bg-neutral-50 text-neutral-600 ring-1 ring-neutral-200'
  }
})
</script>
