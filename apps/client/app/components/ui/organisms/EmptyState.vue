<template>
  <div class="flex flex-col items-center justify-center p-8 text-center sm:p-12">
    <!-- Premium Illustration Slot or Icon -->
    <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-primary-100 text-primary-500 ring-1 ring-primary-200/50 shadow-sm">
      <slot name="illustration">
        <svg
          v-if="icon === 'folder'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-9 w-9"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
        
        <svg
          v-else-if="icon === 'search'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-9 w-9"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        
        <!-- Default Icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-9 w-9"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </slot>
    </div>

    <!-- Content -->
    <h3 class="text-title font-semibold tracking-tight text-neutral-900">{{ title }}</h3>
    <p v-if="description" class="mt-3 max-w-[320px] text-sm leading-relaxed text-neutral-500">{{ description }}</p>

    <!-- Actions -->
    <div v-if="action || $slots.actions" class="mt-8">
      <slot name="actions">
        <AtomicButton
          v-if="action"
          variant="primary"
          @click="emit('action')"
        >
          {{ action }}
        </AtomicButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  title: string
  description?: string
  icon?: 'document' | 'folder' | 'search' | string
  action?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>
