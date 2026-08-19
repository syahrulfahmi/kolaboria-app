<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>
<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-6">
    <h2 class="text-xl font-semibold text-secondary-900">
      Mengapa rekam ini dapat dipercaya?
    </h2>
    <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
