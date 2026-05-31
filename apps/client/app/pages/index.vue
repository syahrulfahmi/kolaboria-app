<template>
  <div>
    <LandingPage v-if="!isComingSoon" />
    <LandingComingSoon v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LandingPage from '~/components/landing/LandingPage.vue'

definePageMeta({ layout: false })

const isComingSoon = ref(false)

useHead({
  title: 'Kolaboria - Platform Kolaborasi Terbuka'
})
</script>
