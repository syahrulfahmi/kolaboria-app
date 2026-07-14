<script setup lang="ts">
import { computed } from 'vue'
import type { ContributionStats, TalentProfile } from '../../types/profile'

const props = defineProps<{
  stats: ContributionStats
  talentProfile?: TalentProfile | null
}>()

const portfolioScore = computed(() => {
  return props.stats.contribution_score || 98
})

const collaborationScore = computed(() => {
  if (!props.stats.project_completed) return '4.9/5'
  const calculated = Math.min(5.0, 4.5 + props.stats.project_completed * 0.1)
  return `${calculated.toFixed(1)}/5`
})

const experienceLabel = computed(() => {
  if (!props.talentProfile) return '1+ Yrs'
  switch (props.talentProfile.experience_level) {
    case 'senior':
      return '5+ Yrs'
    case 'mid':
      return '3-5 Yrs'
    case 'entry':
      return '0-2 Yrs'
    default:
      return '1+ Yrs'
  }
})

const cards = computed(() => [
  {
    title: 'Portfolio Score',
    value: portfolioScore.value,
    path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    title: 'Projects',
    value: props.stats.project_joined || 0,
    path: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
  },
  {
    title: 'Collaboration',
    value: collaborationScore.value,
    path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    title: 'Years of Exp',
    value: experienceLabel.value,
    path: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z'
  }
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 my-6">
    <div
      v-for="card in cards"
      :key="card.title"
      class="bg-white rounded-2xl p-5 border border-neutral-200 flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <div
        class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="card.path"
          />
        </svg>
      </div>
      <div>
        <span class="font-label-1">{{ card.title }}</span>
        <span class="font-body-1 block leading-none">{{ card.value }}</span>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 h-[4px] bg-primary-600"
      ></div>
    </div>
  </div>
</template>
