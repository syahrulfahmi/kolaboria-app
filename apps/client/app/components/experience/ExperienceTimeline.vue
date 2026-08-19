<script setup lang="ts">
defineProps<{
  joinedAt?: string | null
  startedAt?: string | null
  endedAt?: string | null
}>()
</script>
<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-6">
    <h2 class="text-xl font-semibold text-secondary-900">Timeline</h2>
    <div class="mt-4 grid gap-3 text-sm text-neutral-600 sm:grid-cols-3">
      <p>
        <span class="block text-xs text-neutral-400">Bergabung</span
        >{{ joinedAt ? new Date(joinedAt).toLocaleDateString('id-ID') : '—' }}
      </p>
      <p>
        <span class="block text-xs text-neutral-400">Project dimulai</span
        >{{ startedAt ? new Date(startedAt).toLocaleDateString('id-ID') : '—' }}
      </p>
      <p>
        <span class="block text-xs text-neutral-400">Project selesai</span
        >{{ endedAt ? new Date(endedAt).toLocaleDateString('id-ID') : '—' }}
      </p>
    </div>
  </section>
</template>
