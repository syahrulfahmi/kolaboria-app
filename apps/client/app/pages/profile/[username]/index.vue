<script setup lang="ts">
definePageMeta({ layout: 'home' })
useHead({ title: 'Profil publik belum tersedia — Kolaboria' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-20 text-center">
    <h1 class="text-display text-secondary-900">Profil publik belum tersedia</h1>
    <p class="mx-auto mt-3 max-w-lg text-body text-neutral-600">
      Kolaboria belum menyediakan endpoint untuk menampilkan profil publik.
    </p>
    <NuxtLink
      to="/projects"
      class="mt-6 inline-flex rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      Jelajahi proyek
    </NuxtLink>
  </main>
</template>
