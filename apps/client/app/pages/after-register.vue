<template>
  <div>
    <p
      class="text-caption font-semibold tracking-widest uppercase text-primary-500 mb-1"
    >
      Satu Langkah Lagi
    </p>
    <h2 class="text-heading text-secondary-500 mb-2">Lengkapi Profil Kamu</h2>
    <p class="text-body text-neutral-500 mb-8">
      Bantu kami mengenal kamu lebih baik agar kami bisa mencarikan proyek & tim
      yang tepat.
    </p>

    <OnboardingTalentForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['auth']
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

// Guard: if already onboarded, redirect to /home
const { checkOnboardingStatus } = useProfile()
const router = useRouter()

onMounted(async () => {
  const isOnboarded = await checkOnboardingStatus()

  if (isOnboarded) {
    router.push('/home')
  }
})
</script>
