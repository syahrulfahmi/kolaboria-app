<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bio: string | null
  goal?: string | null
  username: string
  isOwner: boolean
  externalLinks?: Record<string, string> | null
  experienceLevel?: string | null
}>()

const experienceLabel = computed(() => {
  switch (props.experienceLevel) {
    case 'entry': return 'Pemula (0-2 Tahun)'
    case 'mid': return 'Menengah (3-5 Tahun)'
    case 'senior': return 'Senior (5+ Tahun)'
    default: return 'Belum diatur'
  }
})

const portfolioUrl = computed(() => {
  if (!props.externalLinks) return null
  return props.externalLinks.portfolio || props.externalLinks.website || null
})

const displayPortfolioUrl = computed(() => {
  if (!portfolioUrl.value) return null
  return portfolioUrl.value.replace(/^https?:\/\//, '').replace(/\/$/, '')
})
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200 shadow-sm transition-shadow hover:shadow-md">
    <h3 class="text-heading text-secondary-900 mb-5 flex items-center gap-2">
      <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      Tentang Saya
    </h3>
    
    <div v-if="bio" class="text-body text-neutral-600 leading-relaxed mb-6 whitespace-pre-wrap">
      {{ bio }}
    </div>
    <div v-else class="mb-6">
      <p class="text-body text-neutral-500 italic">Bio belum ditambahkan.</p>
      <AtomicButton v-if="isOwner" :to="`/profile/${username}/edit`" variant="ghost-primary" class="mt-2 px-0 h-auto">
        Tambahkan bio
      </AtomicButton>
    </div>

    <!-- Additional Info (Portfolio, Experience, Goal) -->
    <div class="space-y-4 pt-6 border-t border-neutral-100">
      <!-- Portfolio -->
      <div v-if="portfolioUrl" class="flex items-center gap-4 group cursor-pointer">
        <div class="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-caption font-semibold uppercase tracking-wider text-neutral-500">Portofolio</p>
          <a :href="portfolioUrl" target="_blank" rel="noopener noreferrer" class="text-body font-semibold text-secondary-900 group-hover:text-primary-600 hover:underline truncate block transition-colors">
            {{ displayPortfolioUrl }}
          </a>
        </div>
      </div>

      <!-- Experience -->
      <div class="flex items-center gap-4 group cursor-default">
        <div class="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0 group-hover:bg-neutral-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-caption font-semibold uppercase tracking-wider text-neutral-500">Pengalaman</p>
          <p class="text-body font-semibold text-secondary-900 truncate">{{ experienceLabel }}</p>
        </div>
      </div>

      <!-- Goal -->
      <div class="flex items-start gap-4 group cursor-default">
        <div class="w-10 h-10 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600 shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-caption font-semibold uppercase tracking-wider text-accent-700">Goal Kolaborasi</p>
          <p v-if="goal" class="text-body font-medium text-secondary-900 mt-0.5">{{ goal }}</p>
          <p v-else class="text-body text-neutral-500 italic mt-0.5">Belum diatur.</p>
        </div>
      </div>
    </div>
  </section>
</template>
