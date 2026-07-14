<template>
  <div class="flex items-center gap-2 my-4">
    <span
      class="w-1 h-4 rounded-full flex-shrink-0"
      :class="indicatorClass"
    ></span>
    <h2 class="font-body-1" :class="textClass">
      <slot>{{ title }}</slot>
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    variant?:
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'info'
      | 'accent'
  }>(),
  {
    variant: 'default'
  }
)

const indicatorClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-400'
    case 'success':
      return 'bg-success-500'
    case 'warning':
    case 'accent':
      return 'bg-accent-400'
    case 'danger':
      return 'bg-danger-500'
    case 'info':
      return 'bg-blue-400'
    case 'default':
    default:
      return 'bg-neutral-900'
  }
})

const textClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-primary-600'
    case 'success':
      return 'text-success-700'
    case 'warning':
    case 'accent':
      return 'text-accent-600'
    case 'danger':
      return 'text-danger-700'
    case 'info':
      return 'text-blue-600'
    case 'default':
    default:
      return 'text-neutral-900'
  }
})
</script>
