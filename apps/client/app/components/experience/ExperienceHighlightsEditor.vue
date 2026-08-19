<script setup lang="ts">
import type { ExperienceHighlight } from '../../types/experience'
defineProps<{ highlights: ExperienceHighlight[]; editable?: boolean }>()
</script>
<template>
  <div class="space-y-3">
    <div
      v-for="highlight in highlights"
      :key="highlight.id"
      class="border-l-2 border-primary-500 pl-4"
    >
      <p class="font-medium text-secondary-900">{{ highlight.title }}</p>
      <p v-if="highlight.description" class="mt-1 text-sm text-neutral-600">
        {{ highlight.description }}
      </p>
      <p v-if="!highlight.available" class="mt-1 text-xs text-warning-700">
        {{ highlight.unavailable_reason }}
      </p>
    </div>
  </div>
</template>
