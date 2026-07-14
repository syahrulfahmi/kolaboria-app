<template>
  <div class="relative inline-flex shrink-0">
    <!-- Avatar Image -->
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="rounded-full object-cover shadow-sm border-2 border-white"
      :class="[
        sizeClasses,
        hoverScale &&
          'hover:scale-105 transition-transform duration-500 ease-in-out'
      ]"
    />

    <!-- Fallback Initials -->
    <div
      v-else
      class="flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-primary-700 shadow-sm font-semibold"
      :class="sizeClasses"
    >
      {{ initials }}
    </div>

    <!-- Verification Badge -->
    <span
      v-if="isVerified !== undefined"
      class="absolute rounded-full flex items-center justify-center border-white shadow-sm"
      :class="[
        badgeSizeClasses,
        isVerified ? 'bg-transparent' : 'bg-accent-500 text-white'
      ]"
      :title="isVerified ? 'Verified Member' : 'Belum Verifikasi'"
    >
      <!-- Checkmark for Verified -->
      <UiIconUserBadgeVerified v-if="isVerified" class="h-full w-full" />
      <!-- Clock Icon for Unverified -->
      <svg
        v-else
        :class="badgeIconSizeClasses"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    isVerified?: boolean
    hoverScale?: boolean
  }>(),
  {
    name: '?',
    size: 'md',
    isVerified: undefined,
    hoverScale: false
  }
)

const initials = computed(
  () =>
    props.name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase() || '?'
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-5 w-5 text-[9px]'
    case 'sm':
      return 'h-8 w-8 text-xs'
    case 'lg':
      return 'h-14 w-14 text-body-1'
    case 'xl':
      return 'h-32 w-32 text-display'
    case 'md':
    default:
      return 'h-12 w-12 text-body-2'
  }
})

const badgeSizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-2 w-2 -bottom-0.5 -right-1'
    case 'sm':
      return 'h-3 w-3 -bottom-0.5 -right-1'
    case 'lg':
      return 'h-5 w-5 -bottom-0.5 -right-1'
    case 'xl':
      return 'h-8 w-8 bottom-1 right-1'
    case 'md':
    default:
      return 'h-4.5 w-4.5 -bottom-0.5 -right-1'
  }
})

const badgeIconSizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
    case 'sm':
      return 'hidden'
    case 'lg':
      return 'h-2.5 w-2.5'
    case 'xl':
      return 'h-4 w-4'
    case 'md':
    default:
      return 'h-2 w-2'
  }
})
</script>
