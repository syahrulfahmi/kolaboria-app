<script setup lang="ts">
definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })

const { experiences, listMine, error } = useExperiences()
const { pending } = await useLazyAsyncData('my-experiences', listMine)
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6 px-4 py-8">
    <header>
      <p class="text-xs font-semibold uppercase tracking-wide text-primary-700">
        Personal branding
      </p>
      <h1 class="mt-1 text-3xl font-semibold text-secondary-900">
        Rekam Kontribusi Saya
      </h1>
      <p class="mt-2 text-sm text-neutral-600">
        Tinjau fakta kontribusi project, tambahkan konteks personal, dan pilih
        apakah rekam akan dibagikan.
      </p>
    </header>
    <OrganismAsyncContent :pending="pending" :ready="Boolean(experiences.length)" label="Memuat rekam kontribusi...">
    <p
      v-if="error"
      class="rounded-xl bg-danger-50 p-4 text-sm text-danger-700"
    >
      {{ error }}
    </p>
    <div v-else-if="experiences.length" class="space-y-4">
      <ExperienceCard
        v-for="experience in experiences"
        :key="experience.id"
        :experience="experience"
        :owner="true"
      />
    </div>
    <div
      v-else
      class="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-600"
    >
      Belum ada project selesai yang menghasilkan rekam kontribusi.
    </div>
    </OrganismAsyncContent>
  </div>
</template>
