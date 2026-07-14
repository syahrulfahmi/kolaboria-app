<script setup lang="ts">
const { isOpen, options, handlePositive, handleNegative } = usePopup()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <MoleculeToastContainer />

  <!-- Global Dynamic Popup -->
  <OrganismPopup
    :model-value="isOpen"
    :title="options.title"
    :description="options.description"
    :type="options.type"
    :positive-label="options.positiveLabel"
    :negative-label="options.negativeLabel"
    @positive="handlePositive"
    @negative="handleNegative"
    @update:model-value="isOpen = $event"
  />
</template>
