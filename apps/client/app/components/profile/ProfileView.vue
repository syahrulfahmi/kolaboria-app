<script setup lang="ts">
import type {
  ContributionStats,
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../types/profile'

const props = defineProps<{
  profile: Profile
  skills: UserSkill[]
  tools: UserTool[]
  stats: ContributionStats
  talentProfile?: TalentProfile | null
  isOwner: boolean
}>()

const { getPublicCareers, getPublicPortfolio } = useProfile()

const { data: projects } = await useAsyncData(
  `portfolio-${props.profile.id}`,
  async () => {
    return await getPublicPortfolio(props.profile.username)
  }
)

const { data: careerJourneys } = await useAsyncData(
  `career-${props.profile.id}`,
  async () => {
    return await getPublicCareers(props.profile.username)
  }
)
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-8">
    <div class="mx-auto">
      <!-- Profile Header Card (Self-contained) -->
      <ProfileHeader :profile="profile" :stats="stats" :is-owner="isOwner" />

      <!-- 4 Stat Cards Row -->
      <ProfileStatCards :stats="stats" :talent-profile="talentProfile" />

      <!-- Main Layout Grid Below -->
      <div class="grid gap-6 lg:grid-cols-[2fr_1fr] items-start mt-6">
        <!-- Konten Utama Kiri (2fr) -->
        <main class="space-y-6">
          <ProfileProjectsSection
            :projects="projects || []"
            :is-owner="isOwner"
            :username="profile.username"
          />
          <ProfileCareerSection
            :career-journeys="careerJourneys"
            :is-owner="isOwner"
            :username="profile.username"
          />
        </main>

        <!-- Sidebar Kanan (1fr) -->
        <aside class="space-y-6">
          <ProfileBioSection
            :bio="profile.bio"
            :goal="talentProfile?.goal"
            :username="profile.username"
            :is-owner="isOwner"
            :external-links="profile.external_links"
            :experience-level="talentProfile?.experience_level"
          />
          <ProfileSkillSection :skills="skills" :tools="tools" />
        </aside>
      </div>
    </div>
  </div>
</template>
