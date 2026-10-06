<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  completedProjects: number | null
  publicExperiences: number | null
  skillCount: number
}>()

const items = computed(() => [
  { label: 'Proyek selesai', value: props.completedProjects },
  { label: 'Rekam publik', value: props.publicExperiences },
  { label: 'Keahlian', value: props.skillCount }
])
</script>

<template>
  <section
    aria-label="Ringkasan kontribusi"
    class="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
  >
    <dl class="grid grid-cols-3 divide-x divide-neutral-200">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex min-w-0 flex-col-reverse items-center justify-center gap-1 px-1.5 py-4 text-center sm:px-3 sm:py-5"
      >
        <dt class="text-[0.7rem] leading-tight text-neutral-600 sm:text-xs">
          {{ item.label }}
        </dt>
        <dd class="font-display text-2xl font-semibold tabular-nums text-secondary-900 sm:text-3xl">
          {{ item.value ?? '—' }}
        </dd>
      </div>
    </dl>
  </section>
</template>
