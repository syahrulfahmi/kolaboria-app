<script setup lang="ts">
defineProps<{
  careerJourneys?: any[]
  isOwner: boolean
  username: string
}>()
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200 shadow-sm transition-shadow hover:shadow-md">
    <h3 class="text-heading text-secondary-900 mb-8 flex items-center gap-2">
      <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
      Perjalanan Karier
    </h3>

    <div class="relative px-2 space-y-8">
      <!-- Empty State -->
      <div v-if="!careerJourneys || careerJourneys.length === 0">
        <div v-if="isOwner" class="flex flex-col items-center justify-center py-6 text-center">
          <p class="text-caption text-neutral-500 mb-3">Belum ada perjalanan karier yang ditambahkan.</p>
          <AtomicButton :to="`/profile/${username}/edit`" variant="ghost-primary">
            Tambah Riwayat Karier
          </AtomicButton>
        </div>
        <div v-else class="text-caption text-neutral-500 font-medium">
          User ini belum menambahkan perjalanan kariernya.
        </div>
      </div>

      <template v-else>
        <!-- Timeline Line -->
        <div class="absolute top-2 bottom-2 left-[15px] w-0.5 bg-neutral-200"></div>

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
                : 'bg-neutral-300 ring-neutral-50 group-hover:bg-neutral-400 group-hover:scale-125',
            ]"
          ></div>

          <!-- Career Content Card -->
          <div
            :class="[
              'bg-white border rounded-xl p-5 md:p-6 flex-1 transition-all duration-300 hover:-translate-y-0.5',
              idx === 0
                ? 'border-neutral-200 hover:border-primary-200 hover:shadow-md'
                : 'border-neutral-100 hover:border-neutral-300 hover:shadow-md',
            ]"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <h4
                :class="[
                  'text-title transition-colors',
                  idx === 0
                    ? 'text-secondary-900 group-hover:text-primary-600'
                    : 'text-secondary-900',
                ]"
              >
                {{ career.title }}
              </h4>
              <span class="inline-flex text-caption font-semibold text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-100">
                {{ career.startYear }} - {{ career.endYear || 'Sekarang' }}
              </span>
            </div>
            <p class="text-body font-semibold text-neutral-700 mb-3">
              {{ career.company }}
            </p>
            <p class="text-body text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {{ career.description }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
