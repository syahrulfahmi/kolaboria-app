<script setup lang="ts">
import type { ExperienceCard } from '../../types/experience'
defineProps<{ experiences: ExperienceCard[]; isOwner?: boolean }>()
</script>
<template>
  <section aria-labelledby="verified-experiences-title" class="space-y-4">
    <div class="flex items-end justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-wide text-primary-700">Bukti kontribusi</p><h2 id="verified-experiences-title" class="mt-1 text-xl font-semibold text-secondary-900">Verified Project Experiences</h2><p class="mt-1 text-sm text-neutral-500">Ringkasan kontribusi yang dihasilkan dari project yang telah selesai.</p></div><AtomicButton v-if="isOwner" to="/profile/me/experiences" variant="ghost" size="sm">Kelola Rekam</AtomicButton></div>
    <div v-if="experiences.length" class="space-y-4"><ExperienceCard v-for="experience in experiences" :key="experience.id" :experience="experience" :owner="isOwner" /></div>
    <div v-else class="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-600">Belum ada rekam kontribusi publik. Setelah project selesai, rekam akan dikumpulkan otomatis dan tetap privat sampai Anda memilih untuk membagikannya.</div>
  </section>
</template>
