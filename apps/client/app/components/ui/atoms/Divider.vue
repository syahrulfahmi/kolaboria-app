<template>
  <div
    class="flex items-center"
    :class="[
      orientation === 'vertical' ? 'h-full flex-col' : 'w-full flex-row'
    ]"
    role="separator"
    :aria-orientation="orientation"
  >
    <div
      class="flex-grow border-neutral-200 opacity-75"
      :class="[
        orientation === 'vertical' ? 'border-l' : 'border-t',
        variant === 'dashed' ? 'border-dashed' : 'border-solid'
      ]"
    ></div>
    
    <span
      v-if="label && orientation === 'horizontal'"
      class="bg-white px-3 text-[11px] font-semibold tracking-widest uppercase text-neutral-400"
    >
      {{ label }}
    </span>
    
    <div
      v-if="label && orientation === 'horizontal'"
      class="flex-grow border-neutral-200 opacity-75"
      :class="[
        'border-t',
        variant === 'dashed' ? 'border-dashed' : 'border-solid'
      ]"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed'
}>()
</script>
