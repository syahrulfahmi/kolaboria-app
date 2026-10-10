<script setup lang="ts">
const route = useRoute()
const username = route.params.username as string
const slug = route.params.experienceSlug as string
const { getPublic } = useExperiences()
const { data, pending, error, refresh } = await useLazyAsyncData(
  `public-experience-${username}-${slug}`,
  () => getPublic(username, slug)
)
</script>
<template>
  <OrganismAsyncContent :pending="pending" :ready="Boolean(data)" label="Memuat rekam kontribusi...">
  <ExperienceDetailView v-if="data && !error" :experience="data" />
  <div v-else class="mx-auto max-w-2xl px-4 py-20 text-center">
    <h1 class="text-2xl font-semibold text-secondary-900">
      Rekam kontribusi tidak tersedia
    </h1>
    <p class="mt-2 text-sm text-neutral-600">
      Rekam ini mungkin masih privat atau belum selesai diverifikasi.
    </p>
    <AtomicButton v-if="error" class="mt-6" variant="outline" @click="refresh">
      Coba lagi
    </AtomicButton>
  </div>
  </OrganismAsyncContent>
</template>
