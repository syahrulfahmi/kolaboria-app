<script setup lang="ts">
import { computed } from 'vue'
definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard']
})
useHead({ title: 'Portfolio Saya — Kolaboria' })
const { getPinnedProjects } = usePortfolio()
const {
  data: portfolio,
  pending,
  error
} = await useAsyncData('my-portfolio', () => getPinnedProjects())
</script>

<template>  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
    <!-- Improved Header Card -->
    <div
      class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div class="space-y-1">
        <span
          class="font-label-3 uppercase tracking-[0.15em] text-primary-600 block mb-1"
        >
          Showcase Karya
        </span>
        <h1
          class="font-title-1 text-3xl font-bold tracking-tight text-neutral-900 leading-tight"
        >
          Portfolio Saya
        </h1>
        <p class="font-paragraph-3 text-neutral-500 max-w-xl">
          Karya unggulan terbaik yang telah Anda selesaikan dan pilih untuk
          dipamerkan kepada dunia kolaborasi.
        </p>
      </div>
      <div class="shrink-0 flex items-center gap-6">
        <!-- Quick Stat: Total Pinned -->
        <div
          class="hidden sm:flex flex-col items-end pr-6 border-r border-neutral-200"
        >
          <span class="font-body-3 text-neutral-400">Total Pinned</span>
          <span class="font-title-2 text-primary-600 leading-none mt-1.5">{{
            portfolio?.length || 0
          }}</span>
        </div>
        <AtomicButton
          to="/profile/me/edit/portfolio"
          variant="outline"
          class="shadow-xs hover:shadow-sm transition-all duration-300 w-full sm:w-auto"
        >
          <template #icon-left>
            <Icon name="heroicons:pencil-square" class="h-4 w-4" />
          </template>
          Kelola Portfolio
        </AtomicButton>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="divide-y divide-neutral-200 border-t border-neutral-200"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="py-8 flex items-center justify-between gap-4"
      >
        <div class="flex-1 space-y-3">
          <div class="flex items-center gap-4">
            <div class="h-5 w-8 animate-pulse rounded bg-neutral-200"></div>
            <div class="h-5 w-48 animate-pulse rounded bg-neutral-200"></div>
          </div>
          <div class="h-4 w-3/4 animate-pulse rounded bg-neutral-200"></div>
          <div class="flex gap-1.5 pl-12">
            <div class="h-4 w-12 animate-pulse rounded bg-neutral-100"></div>
            <div class="h-4 w-12 animate-pulse rounded bg-neutral-100"></div>
          </div>
        </div>
        <div class="h-4 w-24 animate-pulse rounded bg-neutral-200"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-xl bg-danger-50 border border-danger-200 p-6 text-center font-body-2 text-danger-700"
    >
      <Icon
        name="heroicons:exclamation-triangle"
        class="h-6 w-6 mx-auto mb-2 text-danger-500"
      />
      Gagal memuat portfolio. Silakan coba lagi.
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!portfolio || portfolio.length === 0"
      class="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <Icon
        name="heroicons:folder-open"
        class="h-10 w-10 text-neutral-300 mb-4"
      />
      <h3 class="font-title-3 text-neutral-900 mb-1">
        Belum ada karya unggulan
      </h3>
      <p class="font-body-2 text-neutral-500 max-w-sm mb-6">
        Sematkan project yang sudah selesai dari profil Anda untuk ditampilkan di
        sini.
      </p>
      <NuxtLink
        to="/profile/me/edit/portfolio"
        class="font-label-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
      >
        Kelola sekarang &rarr;
      </NuxtLink>
    </div>

    <!-- Portfolio Cards List (Solid Cards, Restructured) -->
    <div v-else class="space-y-6">
      <div
        v-for="item in portfolio"
        :key="item.project_id"
        class="group bg-white border border-neutral-200 rounded-2xl p-6 transition-all duration-200 hover:border-primary-400 hover:bg-neutral-50/10"
      >
        <!-- Card Header Meta -->
        <div
          class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-neutral-100 pb-3"
        >
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent-700 bg-accent-50 border border-accent-150 rounded-full px-2.5 py-0.5"
              title="Disematkan di Profil"
            >
              📌 Pinned
            </span>
            <AtomicTag
              variant="primary"
              class="font-label-3 uppercase tracking-wider !text-[9px] !px-2.5 !py-0.5"
            >
              {{
                item.type
                  ?.replace('_', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              }}
            </AtomicTag>
          </div>
          <div
            class="flex items-center gap-4 text-xs font-body-3 text-neutral-400"
          >
            <span class="flex items-center gap-1">
              <Icon name="heroicons:users" class="h-3.5 w-3.5" />
              {{ item.member_count }} Anggota
            </span>
            <span>·</span>
            <span class="flex items-center gap-1" title="Tanggal Disematkan">
              <Icon name="heroicons:calendar" class="h-3.5 w-3.5" />
              {{
                new Date(item.pinned_at).toLocaleDateString('id-ID', {
                  month: 'short',
                  year: 'numeric'
                })
              }}
            </span>
          </div>
        </div>

        <!-- Card Body Content -->
        <div class="mb-5">
          <NuxtLink
            :to="`/portfolio/me/${item.slug}`"
            class="font-title-2 font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 block mb-2"
          >
            {{ item.title }}
          </NuxtLink>
          <p class="font-paragraph-3 text-neutral-500 line-clamp-2">
            {{ item.summary }}
          </p>
        </div>

        <!-- Card Footer -->
        <div
          class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100"
        >
          <!-- Tech Stack -->
          <div
            v-if="item.tech_stack && item.tech_stack.length > 0"
            class="flex flex-wrap gap-1.5"
          >
            <span
              v-for="tech in item.tech_stack.slice(0, 4)"
              :key="tech"
              class="inline-flex items-center text-[10px] font-semibold tracking-wide text-primary-700 bg-primary-50 border border-primary-100 rounded px-2 py-0.5"
            >
              {{ tech }}
            </span>
            <span
              v-if="item.tech_stack.length > 4"
              class="inline-flex items-center text-[10px] font-semibold tracking-wide text-neutral-450 bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5"
            >
              +{{ item.tech_stack.length - 4 }}
            </span>
          </div>

          <NuxtLink
            :to="`/portfolio/me/${item.slug}`"
            class="inline-flex items-center font-label-2 text-primary-600 hover:text-primary-700 transition-all duration-200 group/link ml-auto"
          >
            Lihat Detail Proyek
            <Icon
              name="heroicons:arrow-right"
              class="ml-1 h-3.5 w-3.5 transform transition-transform group-hover/link:translate-x-1"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
