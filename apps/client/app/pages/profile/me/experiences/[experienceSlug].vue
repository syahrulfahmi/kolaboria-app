<script setup lang="ts">
definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })
const route = useRoute()
const {
  experiences,
  listMine,
  getById,
  selectedExperience,
  updateVisibility,
  upsertReflection
} = useExperiences()
const { data, pending, error, refresh } = await useLazyAsyncData(
  `experience-owner-${route.params.experienceSlug}`,
  async () => {
    await listMine()
    const item = experiences.value.find(
      (x) => x.slug === route.params.experienceSlug
    )
    if (!item)
      throw createError({
        statusCode: 404,
        statusMessage: 'Experience not found'
      })
    return getById(item.id)
  }
)
const saveVisibility = async (v: 'private' | 'public') => {
  if (data.value && !pending.value && !error.value) {
    await updateVisibility(data.value.id, v)
    data.value = { ...data.value, visibility: v, visibility_label: v === 'public' ? 'Publik' : 'Privat' }
  }
}
const saveReflection = async (body: string) => {
  if (data.value && !pending.value && !error.value) {
    await upsertReflection(data.value.id, body)
    if (selectedExperience.value?.id === data.value.id) {
      data.value = { ...data.value, reflection: selectedExperience.value.reflection }
    }
  }
}
</script>
<template>
  <OrganismAsyncContent :pending="pending" :ready="Boolean(data)" label="Memuat rekam kontribusi...">
  <ExperienceDetailView
    v-if="!error && data"
    :experience="data"
    owner
    @visibility="saveVisibility"
    @reflection="saveReflection"
  />
  <div v-else class="p-8 text-center" role="alert">
    <p class="font-body-2 text-neutral-600">Rekam kontribusi belum dapat dimuat.</p>
    <AtomicButton class="mt-4" variant="outline" @click="refresh">Coba lagi</AtomicButton>
  </div>
  </OrganismAsyncContent>
</template>
