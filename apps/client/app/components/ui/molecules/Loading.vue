<template>
  <div
    class="flex flex-col items-center justify-center gap-4 transition-all duration-300"
    :class="[
      type === 'fullscreen' ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm' : 'relative p-8 w-full min-h-[200px]'
    ]"
    role="status"
    aria-live="polite"
  >
    <!-- Premium Dots Animation with Depth -->
    <div class="flex items-center gap-2" aria-hidden="true">
      <div class="h-3 w-3 animate-bounce rounded-full bg-primary-300 shadow-sm" style="animation-delay: -0.30s"></div>
      <div class="h-3 w-3 animate-bounce rounded-full bg-primary-400 shadow-sm" style="animation-delay: -0.15s"></div>
      <div class="h-3 w-3 animate-bounce rounded-full bg-primary-500 shadow-sm"></div>
    </div>

    <!-- Optional Label -->
    <span
      v-if="label"
      class="text-xs font-semibold tracking-wide text-neutral-500 uppercase animate-pulse"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'section' | 'fullscreen'
  label?: string
}>()
</script>
