<template>
  <div>
    <p class="font-title-3 text-primary-600 mb-1">Satu Langkah Lagi</p>
    <h2 class="font-title-1 text-secondary-500 mb-2">Lengkapi Profil Kamu</h2>
    <p class="font-body-1 text-secondary mb-8">
      Bantu kami mengenal kamu lebih baik agar kami bisa mencarikan proyek & tim
      yang tepat.
    </p>

    <OnboardingTalentForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['auth', 'onboarding-guard']
})

useHead({
  title: 'Lengkapi Profil - Kolaboria',
  meta: [
    {
      name: 'description',
      content: 'Lengkapi profil Kolaboria kamu untuk memulai berkolaborasi.'
    }
  ]
})
</script>
