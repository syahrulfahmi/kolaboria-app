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
const { data } = await useAsyncData(
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
if (data.value) selectedExperience.value = data.value
const saveVisibility = async (v: 'private' | 'public') => {
  if (selectedExperience.value)
    await updateVisibility(selectedExperience.value.id, v)
}
const saveReflection = async (body: string) => {
  if (selectedExperience.value)
    await upsertReflection(selectedExperience.value.id, body)
}
</script>
<template>
  <ExperienceDetailView
    v-if="selectedExperience"
    :experience="selectedExperience"
    owner
    @visibility="saveVisibility"
    @reflection="saveReflection"
  />
  <div v-else class="p-8">
    <MoleculeLoading label="Memuat rekam kontribusi..." />
  </div>
</template>
