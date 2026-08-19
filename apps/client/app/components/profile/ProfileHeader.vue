<script setup lang="ts">
import { computed } from 'vue'
import type { Profile, ContributionStats } from '../../types/profile'

const props = defineProps<{
  profile: Profile
  stats: ContributionStats
  isOwner?: boolean
}>()

const { add: addToast } = useToast()

const initials = computed(() =>
  (props.profile.full_name || props.profile.username || '?')
    .charAt(0)
    .toUpperCase()
)

const isTopRated = computed(() => {
  return props.profile.is_verified || props.profile.rating >= 4.5
})

const handleCoverClick = () => {
  if (!props.isOwner) return
  addToast({
    variant: 'info',
    title: 'Fitur Segera Hadir',
    message:
      'Fitur mengunggah dan mengubah foto sampul kustom akan segera hadir!'
  })
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6"
  >
    <!-- Cover Background inside Header Card -->
    <div
      class="h-32 sm:h-48 md:h-52 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 relative group"
      :class="{ 'cursor-pointer': isOwner }"
      @click="handleCoverClick"
    >
      <!-- Modern subtle decoration -->
      <div class="absolute inset-0 bg-white/[0.03] backdrop-blur-[2px]"></div>

      <!-- Cover Upload Hover Action -->
      <div
        v-if="isOwner"
        class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
      >
        <div
          class="font-label-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-300"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Ubah Foto Sampul
        </div>
      </div>
    </div>

    <!-- Header Content -->
    <div
      class="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left"
    >
      <!-- Avatar Overlapping Cover -->
      <div class="relative shrink-0 z-10 -mt-20 md:-mt-24">
        <AtomicAvatar
          :src="profile.avatar"
          :name="profile.full_name || profile.username"
          size="xl"
          :is-verified="profile.is_verified"
          hover-scale
        />
      </div>

      <!-- Header Info -->
      <!-- Header Info -->
      <div class="flex-1 w-full space-y-4">
        <div
          class="flex flex-col md:flex-row md:items-start justify-between gap-4"
        >
          <div class="text-center md:text-left">
            <div
              class="flex items-center justify-center md:justify-start flex-wrap gap-2"
            >
              <h1 class="font-title-1 leading-tight">
                {{ profile.full_name || profile.username }}
              </h1>
            </div>
            <p class="font-body-1 text-secondary mt-1">
              {{ profile.headline }}
            </p>
          </div>

          <!-- Edit Profile Action Button -->
          <div
            v-if="isOwner"
            class="shrink-0 flex justify-center md:justify-end"
          >
            <NuxtLink to="/profile/me/edit/basic">
              <AtomicButton
                variant="outline"
                size="sm"
                class="flex items-center gap-1.5 font-bold"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Profil
                </span>
              </AtomicButton>
            </NuxtLink>
          </div>
        </div>

        <div
          class="flex flex-wrap items-center justify-center md:justify-start gap-3"
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
        </div>
      </div>
    </div>
  </div>
</template>
