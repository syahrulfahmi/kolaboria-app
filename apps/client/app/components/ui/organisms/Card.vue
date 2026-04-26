<template>
  <div
    class="flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-200"
    :class="[
      variantClasses,
      hoverable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary-900/10' : ''
    ]"
  >
    <!-- Media Slot (Full width at top) -->
    <div v-if="$slots.media" class="w-full">
      <slot name="media" />
    </div>

    <!-- Main Content Wrapper -->
    <div class="flex flex-1 flex-col" :class="paddingClass">
      <!-- Header -->
      <div v-if="$slots.header || title || description" class="mb-5">
        <slot name="header">
          <h3 v-if="title" class="text-title font-semibold tracking-tight text-neutral-900">{{ title }}</h3>
          <p v-if="description" class="mt-1.5 text-sm leading-relaxed text-neutral-500">{{ description }}</p>
        </slot>
      </div>

      <!-- Default Slot (Body) -->
      <div class="flex-1 text-body text-neutral-800">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="mt-6 pt-5 border-t border-neutral-200">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  description?: string
  variant?: 'default' | 'outlined' | 'elevated'
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outlined':
      return 'border-2 border-neutral-100 shadow-sm'
    case 'elevated':
      return 'border border-neutral-200/50 shadow-lg shadow-secondary-900/5'
    case 'default':
    default:
      return 'border border-neutral-200 shadow-sm'
  }
})

const paddingClass = computed(() => {
  switch (props.padding) {
    case 'none': return 'p-0'
    case 'sm': return 'p-5'
    case 'lg': return 'p-10'
    case 'md':
    default: return 'p-7'
  }
})
</script>
