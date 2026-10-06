<script setup lang="ts">
import { computed } from 'vue'
import { getProfileFixture } from '../../../data/profile-fixtures'

definePageMeta({ layout: 'home' })

const route = useRoute()
const username = computed(() => String(route.params.username ?? ''))
const profileData = computed(() => getProfileFixture(username.value))

useHead(() => ({
  title: profileData.value
    ? `${profileData.value.profile.fullName} - Kolaboria`
    : 'Profil tidak ditemukan - Kolaboria'
}))
</script>

<template>
  <ProfileView
    v-if="profileData"
    :data="profileData"
    :is-owner="false"
  />

  <main v-else class="mx-auto max-w-3xl px-4 py-20 text-center">
    <h1 class="text-display text-secondary-900">Profil tidak ditemukan</h1>
    <p class="mx-auto mt-3 max-w-lg text-body text-neutral-600">
      Belum ada data contoh untuk <span class="font-semibold">@{{ username }}</span>.
    </p>
    <NuxtLink
      to="/profile/alya-pratama"
      class="mt-6 inline-flex rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      Lihat profil contoh
    </NuxtLink>
  </main>
</template>
