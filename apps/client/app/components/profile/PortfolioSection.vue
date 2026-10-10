<script setup lang="ts">
import type { PortfolioItem } from '../../types/profile-page'

defineProps<{ items: PortfolioItem[] }>()
</script>

<template>
  <section
    aria-labelledby="portfolio-title"
    class="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8"
  >
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 id="portfolio-title" class="font-label-1 text-xl">
          Project Portofolio
        </h2>
        <p class="mt-1 text-sm text-secondary">
          Pilihan karya dan proses di baliknya.
        </p>
      </div>
      <span
        class="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
      >
        Contoh
      </span>
    </div>

    <div v-if="items.length" class="grid gap-4 sm:grid-cols-2">
      <a
        v-for="item in items"
        :key="item.id"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <img
          v-if="item.thumbnailUrl"
          :src="item.thumbnailUrl"
          :alt="''"
          class="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
        <div
          v-else
          aria-hidden="true"
          class="flex aspect-[16/9] items-center justify-center bg-primary-50 text-primary-700"
        >
          <svg
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.7"
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
            />
          </svg>
        </div>
        <div class="p-4">
          <h3 class="font-body-1 font-semibold group-hover:text-primary-700">
            {{ item.title }}
          </h3>
          <p class="mt-1 text-xs font-medium text-primary-700">
            {{ item.role }} · {{ item.year }}
          </p>
          <p class="mt-2 text-sm leading-relaxed text-secondary">
            {{ item.summary }}
          </p>
          <span class="sr-only">(membuka tab baru)</span>
        </div>
      </a>
    </div>

    <div v-else class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50">
      <OrganismEmptyState
        title="Portofolio masih kosong"
        description="Karya yang kamu bagikan akan muncul di bagian ini."
        icon="folder"
      />
    </div>
  </section>
</template>
