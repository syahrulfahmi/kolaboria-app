<script setup lang="ts">
import MyProjectsView from '~/components/project/MyProjectsView.vue'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard']
})

useHead({
  title: 'Proyek Saya — Kolaboria',
  meta: [
    {
      name: 'description',
      content: 'Kelola proyek yang kamu bangun dan kembangkan bersama kontributor di Kolaboria.'
    }
  ]
})
</script>

<template>
  <MyProjectsView />
</template>
