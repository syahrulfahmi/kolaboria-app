<script setup lang="ts">
defineProps<{
  careerJourneys?: any[]
  isOwner: boolean
  username: string
}>()
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
    <h3 class="font-label-1 mb-8 flex items-center gap-2">
      <svg
        class="w-6 h-6 text-primary-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
      Perjalanan Karier
    </h3>

    <div class="relative px-2 space-y-8">
      <!-- Empty State -->
      <div v-if="!careerJourneys || careerJourneys.length === 0">
        <div
          v-if="isOwner"
          class="flex flex-col items-center justify-center py-6 text-center"
        >
          <p class="font-paragraph-2 mb-3">
            Belum ada perjalanan karier yang ditambahkan.
          </p>
          <NuxtLink to="/profile/me/edit/career">
            <AtomicButton variant="ghost-primary">
              Tambah Riwayat Karier
            </AtomicButton>
          </NuxtLink>
        </div>
        <div v-else class="font-paragraph-2 text-secondary">
          User ini belum menambahkan perjalanan kariernya.
        </div>
      </div>

      <template v-else>
        <!-- Timeline Line -->
        <div
          class="absolute top-2 bottom-2 left-[15px] w-0.5 bg-neutral-200"
        ></div>

        <!-- Career Items -->
        <div
          v-for="(career, idx) in careerJourneys"
          :key="idx"
          class="relative flex gap-6 items-start group cursor-default"
        >
          <!-- Timeline Dot -->
          <div
            :class="[
              'w-4 h-4 rounded-full ring-4 mt-1.5 z-10 shrink-0 transition-transform duration-300',
              idx === 0
                ? 'bg-primary-600 ring-primary-50 group-hover:scale-125'
                : 'bg-neutral-300 ring-neutral-50 group-hover:bg-neutral-400 group-hover:scale-125'
            ]"
          ></div>

          <!-- Career Content (Flat layout) -->
          <div class="flex-1 min-w-0 pt-0.5">
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1"
            >
              <h4
                :class="['font-body-1 transition-colors', 'text-secondary-900']"
              >
                {{ career.title }}
              </h4>
              <span class="font-label-1 text-neutral-500">
                {{ career.start_year }} - {{ career.end_year || 'Sekarang' }}
              </span>
            </div>
            <p class="font-label-1 text-primary-600 mb-2">
              {{ career.company }}
            </p>
            <p
              class="font-paragraph-2 text-secondary leading-relaxed whitespace-pre-wrap"
            >
              {{ career.description }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
