<script setup lang="ts">
import type { ProjectEditorStep } from '~/types/project-editor'

defineProps<{
  currentStep: ProjectEditorStep
  stepLabel: string
}>()
</script>

<template>
  <div
    class="w-full space-y-2 border-b border-neutral-200 bg-white p-4 sm:mx-0 sm:w-auto"
  >
    <p class="font-body-3 text-secondary" role="status" aria-live="polite">
      Langkah {{ currentStep + 1 }} dari 5 · {{ stepLabel }}
    </p>
    <ol aria-hidden="true" class="flex gap-1.5">
      <li
        v-for="step in 5"
        :key="step"
        class="h-1 flex-1 rounded-full transition-colors"
        :class="step <= currentStep + 1 ? 'bg-primary-600' : 'bg-neutral-200'"
      />
    </ol>
  </div>
</template>
