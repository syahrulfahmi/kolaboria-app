<script setup lang="ts">
import { myProfileFixture } from '../../../data/profile-fixtures'

definePageMeta({ layout: 'home' })

useHead({
  title: `${myProfileFixture.profile.fullName} - Kolaboria`
})
</script>

<template>
  <ProfileView :data="myProfileFixture" :is-owner="true" />
</template>
