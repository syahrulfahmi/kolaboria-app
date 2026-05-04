<template>
  <div
    :class="[
      type === 'fullscreen' 
        ? 'fixed inset-0 z-[9999] bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300' 
        : 'relative p-8 w-full min-h-[200px] flex flex-col items-center justify-center gap-4 transition-all duration-300'
    ]"
    role="status"
    aria-live="polite"
  >
    <div
      :class="[
        type === 'fullscreen' 
          ? 'bg-white rounded-2xl shadow-xl shadow-neutral-200/50 p-8 flex flex-col items-center justify-center min-w-[240px] border border-neutral-100 gap-5' 
          : 'contents'
      ]"
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
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'section' | 'fullscreen'
  label?: string
}>(), {
  type: 'section'
})
</script>
