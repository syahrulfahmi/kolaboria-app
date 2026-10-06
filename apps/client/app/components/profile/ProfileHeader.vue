<script setup lang="ts">
import type { ProfileIdentity } from '../../types/profile-page'

const props = defineProps<{
  profile: ProfileIdentity
  isOwner?: boolean
}>()

const { add: addToast } = useToast()

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
  <div class="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6">
    <div class="h-32 sm:h-48 md:h-52 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 relative group" :class="{ 'cursor-pointer': isOwner }" @click="handleCoverClick">
      <div class="absolute inset-0 bg-white/[0.03] backdrop-blur-[2px]"></div>
      <div v-if="isOwner" class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="font-label-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-300">
          <Icon name="lucide:camera" class="w-4 h-4" aria-hidden="true" />
          Ubah Foto Sampul
        </div>
      </div>
    </div>
    <div class="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
      <div class="relative shrink-0 z-10 -mt-20 md:-mt-24">
        <AtomicAvatar :src="profile.avatar" :name="profile.fullName || profile.username" size="xl" :is-verified="profile.isVerified" hover-scale />
      </div>
      <div class="flex-1 w-full space-y-4">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div class="text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start flex-wrap gap-2">
              <h1 class="font-title-1 leading-tight">{{ profile.fullName || profile.username }}</h1>
            </div>
            <p class="font-body-1 text-secondary mt-1">{{ profile.headline }}</p>
          </div>
          <div v-if="isOwner" class="shrink-0 flex justify-center md:justify-end">
            <NuxtLink to="/profile/me/edit">
              <AtomicButton variant="outline" size="sm" class="flex items-center gap-1.5 font-bold">
                <span class="flex items-center justify-center gap-2">
                  <Icon name="lucide:pencil" class="w-3.5 h-3.5" aria-hidden="true" />
                  Edit Profil
                </span>
              </AtomicButton>
            </NuxtLink>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <AtomicTag v-if="profile.location" variant="default" class="bg-neutral-100 text-neutral-700 font-medium">
            <Icon name="lucide:map-pin" class="w-4 h-4 inline-block mr-1 -mt-0.5" aria-hidden="true" />
            {{ profile.location }}
          </AtomicTag>
        </div>
      </div>
    </div>
  </div>
</template>
