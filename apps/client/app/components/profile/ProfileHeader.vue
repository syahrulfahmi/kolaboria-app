<script setup lang="ts">
import { computed } from 'vue'
import type { Profile, ContributionStats } from '../../types/profile'

const props = defineProps<{
  profile: Profile
  stats: ContributionStats
  isOwner?: boolean
}>()

const initials = computed(() =>
  (props.profile.full_name || props.profile.username || '?')
    .charAt(0)
    .toUpperCase()
)

const availabilityLabel = computed(() => {
  switch (props.profile.availability_status) {
    case 'available':
      return 'Available'
    case 'busy':
      return 'Busy'
    case 'unavailable':
      return 'Unavailable'
    default:
      return 'Status belum diatur'
  }
})

const availabilityVariant = computed(() => {
  switch (props.profile.availability_status) {
    case 'available':
      return 'success'
    case 'busy':
      return 'accent'
    case 'unavailable':
      return 'danger'
    default:
      return 'default'
  }
})

const isTopRated = computed(() => {
  return props.profile.is_verified || props.profile.rating >= 4.5
})

const shareProfile = () => {
  // Mock share profile functionality
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
    alert('Link profil berhasil disalin!')
  }
}
</script>

<template>
  <div
    class="bg-white rounded-2xl p-6 md:p-10 border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-left transition-shadow hover:shadow-md"
  >
    <!-- Avatar Flat -->
    <div class="relative shrink-0 z-10 pt-2 md:pt-0">
      <div
        class="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-primary-50 text-display text-primary-700 overflow-hidden relative shadow-md group ring-4 ring-primary-50 transition-all duration-300 flex items-center justify-center"
      >
        <img
          v-if="profile.avatar"
          :src="profile.avatar"
          :alt="profile.full_name || profile.username"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <span v-else>{{ initials }}</span>
      </div>
      <!-- Availability Indicator Dot -->
      <div
        v-if="profile.availability_status === 'available'"
        class="absolute bottom-1 right-2 md:bottom-2 md:right-2 w-6 h-6 bg-success-500 border-4 border-white rounded-full shadow-sm"
      ></div>
    </div>

    <!-- Header Info -->
    <div class="flex-1 w-full space-y-4">
      <div>
        <h1
          class="text-display text-secondary-900 tracking-tight leading-tight"
        >
          {{ profile.full_name || profile.username }}
        </h1>
        <p class="text-title text-primary-600 mt-1">
          {{ profile.headline || 'Talent at Kolaboria' }}
        </p>
      </div>

      <div
        class="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 pb-2"
      >
        <AtomicTag
          v-if="profile.location"
          variant="default"
          class="bg-neutral-100 text-neutral-700 font-medium"
        >
          <svg
            class="w-4 h-4 inline-block mr-1 -mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {{ profile.location }}
        </AtomicTag>
        <AtomicTag v-if="isTopRated" variant="accent" class="font-semibold">
          <svg
            class="w-4 h-4 inline-block mr-1 -mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          Top Rated
        </AtomicTag>
        <AtomicTag :variant="availabilityVariant">{{
          availabilityLabel
        }}</AtomicTag>
      </div>

      <!-- Action Buttons & Stats -->
      <div
        class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-4 border-t border-neutral-100"
      >
        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <NuxtLink :to="`/profile/${profile.username}/edit`">
            <AtomicButton
              v-if="isOwner"
              variant="primary"
              class="w-full flex-1"
            >
              Edit Profil
            </AtomicButton>
          </NuxtLink>
          <AtomicButton
            variant="outline"
            @click="shareProfile"
            class="w-full flex-1"
          >
            Bagikan Profil
          </AtomicButton>
        </div>

        <!-- Inline Stats -->
        <div
          class="flex gap-5 justify-center xl:justify-end shrink-0 bg-neutral-50 rounded-xl py-3 px-5 border border-neutral-100"
        >
          <!-- Project Diikuti -->
          <div class="flex flex-col items-center gap-0.5 text-center">
            <svg
              class="w-4 h-4 text-neutral-400 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span
              class="text-heading font-black text-secondary-900 block leading-none"
              >{{ stats.project_joined }}</span
            >
            <span
              class="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mt-0.5"
              >Project</span
            >
          </div>

          <div class="w-px bg-neutral-200 self-stretch"></div>

          <!-- Project Selesai -->
          <div class="flex flex-col items-center gap-0.5 text-center">
            <svg
              class="w-4 h-4 text-success-400 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span
              class="text-heading font-black text-secondary-900 block leading-none"
              >{{ stats.project_completed }}</span
            >
            <span
              class="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mt-0.5"
              >Selesai</span
            >
          </div>

          <div class="w-px bg-neutral-200 self-stretch"></div>

          <!-- Contribution Score -->
          <div class="flex flex-col items-center gap-0.5 text-center">
            <svg
              class="w-4 h-4 text-accent-400 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span
              class="text-heading font-black text-accent-600 block leading-none"
              >{{ stats.contribution_score }}</span
            >
            <span
              class="text-[10px] font-semibold uppercase tracking-wider text-accent-600 mt-0.5"
              >Kontribusi</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
