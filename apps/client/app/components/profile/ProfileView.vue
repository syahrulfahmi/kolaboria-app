<script setup lang="ts">
import { computed } from 'vue'
import type { ProfilePageData } from '../../types/profile-page'

const props = defineProps<{
  data: ProfilePageData
  isOwner: boolean
}>()

const publicExperienceCount = computed(
  () =>
    props.data.experiences?.filter(
      (experience) => experience.visibility === 'public'
    ).length ?? null
)
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="mx-auto w-full">
      <ProfileHeader
        :profile="data.profile"
        :is-owner="isOwner"
      />

      <main
        class="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,0.9fr)]"
      >
        <div class="contents lg:col-start-1 lg:row-start-1 lg:block lg:space-y-6">
          <ProfileStatCards
            :completed-projects="data.completedProjects"
            :public-experiences="publicExperienceCount"
            :skill-count="data.skills.length"
            class="order-0 min-w-0 lg:order-none"
          />
          <ProfileProjectsSection
            :projects="data.projects"
            :is-owner="isOwner"
            class="order-3 min-w-0 lg:order-none"
          />
          <ProfilePortfolioSection
            :items="data.portfolio"
            class="order-4 min-w-0 lg:order-none"
          />
          <ProfileCareerSection
            :career-journeys="data.careerJourneys"
            :is-owner="isOwner"
            class="order-5 min-w-0 lg:order-none"
          />
          <VerifiedExperienceSection
            :experiences="data.experiences"
            :is-owner="isOwner"
            class="order-6 min-w-0 lg:order-none"
          />
        </div>

        <div class="contents lg:col-start-2 lg:row-start-1 lg:block lg:space-y-6">
          <ProfileBioSection
            :bio="data.profile.bio"
            :goal="data.talent.collaborationGoal"
            :username="data.profile.username"
            :is-owner="isOwner"
            :external-links="data.profile.externalLinks"
            :experience-level="data.talent.experienceLevel"
            class="order-1 min-w-0 lg:order-none"
          />
          <ProfileSkillSection
            :skills="data.skills"
            :tools="data.tools"
            class="order-2 min-w-0 lg:order-none"
          />
        </div>
      </main>
    </div>
  </div>
</template>
