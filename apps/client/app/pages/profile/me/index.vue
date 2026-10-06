<script setup lang="ts">
import { myProfileFixture } from '../../../data/profile-fixtures'
import { CareerService } from '../../../services/career.service'
import { ProfileService } from '../../../services/profile.service'
import type { ProfilePageData } from '../../../types/profile-page'

definePageMeta({
  layout: 'home',
  homeNavbar: {
    mainHorizontalPadding: 'none'
  }
})

const { data, pending, error, refresh } = await useAsyncData<ProfilePageData>(
  'profile-me',
  async () => {
    const [profileResponse, careerResponse] = await Promise.all([
      ProfileService.getProfile(),
      CareerService.getMyCareerHistories()
    ])
    const profile = profileResponse.data

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Profil tidak ditemukan'
      })
    }

    return {
      profile: {
        username: profile.username,
        fullName: profile.full_name,
        avatar: profile.avatar,
        headline: profile.headline,
        location: profile.location,
        bio: profile.bio,
        externalLinks: profile.external_links,
        isVerified: profile.is_verified
      },
      talent: {
        experienceLevel: profile.talent_profile?.experience_level ?? null,
        collaborationGoal: profile.talent_profile?.goal ?? null
      },
      // These values are not part of the current profile API response.
      completedProjects: null,
      skills: profile.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        isPrimary: skill.is_primary
      })),
      tools: profile.tools.map((tool) => ({
        id: tool.id,
        name: tool.name
      })),
      // Experience has no registered route in the current API checkout.
      experiences: null,
      careerJourneys: (careerResponse.data ?? []).map((career) => ({
        id: career.id,
        title: career.title,
        company: career.company,
        startYear: String(career.start_year),
        startMonth: career.start_month,
        endYear: career.end_year === null ? null : String(career.end_year),
        endMonth: career.end_month,
        description: career.description
      })),
      // Karya Unggulan and Portofolio remain on their existing fixture source.
      projects: myProfileFixture.projects,
      portfolio: myProfileFixture.portfolio
    }
  },
  {
    // Re-fetch on page entry after an edit; use the SSR payload only for hydration.
    getCachedData: (key, nuxtApp) =>
      nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined
  }
)

useHead(() => ({
  title: `${data.value?.profile.fullName || data.value?.profile.username || 'Profil Saya'} - Kolaboria`
}))
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <MoleculeLoading label="Memuat profil..." />
    </div>

    <div
      v-else-if="error || !data"
      class="mx-auto max-w-4xl px-4 py-20 text-center"
    >
      <h1 class="mb-4 text-display text-secondary-900">Gagal Memuat Profil</h1>
      <p class="mb-8 text-body text-neutral-500">
        Terjadi kesalahan saat memuat profil Anda.
      </p>
      <AtomicButton variant="primary" @click="refresh">
        Coba lagi
      </AtomicButton>
    </div>

    <ProfileView v-else :data="data" :is-owner="true" />
  </div>
</template>
