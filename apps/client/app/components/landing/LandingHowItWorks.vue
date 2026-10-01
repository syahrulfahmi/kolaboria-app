<template>
  <section id="how" class="py-24 bg-neutral-50 relative overflow-hidden">
    <div
      class="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary-50/50 to-transparent pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="k-container relative z-10">
      <div class="max-w-xl mb-16">
        <p
          :ref="(el) => revealItems(el, 0)"
          class="reveal k-eyebrow text-primary-500"
        >
          Cara Kerjanya
        </p>
        <h2
          :ref="(el) => revealItems(el, 1)"
          class="reveal k-section-title text-secondary-500 mt-3"
          style="--delay: 100ms"
        >
          Tiga Langkah Menuju Kolaborasi
        </h2>
        <p
          :ref="(el) => revealItems(el, 2)"
          class="reveal text-secondary-400/80 mt-4 font-paragraph-base"
          style="--delay: 200ms"
        >
          Sistem cerdas Kolaboria mempertemukan ide brilianmu dengan eksekutor
          yang tepat secara transparan dan terukur.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          :ref="(el) => revealItems(el, 3 + i)"
          class="reveal h-full"
          :style="`--delay: ${300 + i * 120}ms`"
        >
          <div
            class="group relative h-full bg-white p-8 rounded-3xl border border-black/[0.04] shadow-sm hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            <span
              class="absolute -bottom-8 -right-4 text-[10rem] font-black text-neutral-100/60 group-hover:text-primary-50 transition-colors duration-500 pointer-events-none select-none leading-none"
            >
              {{ i + 1 }}
            </span>

            <div
              class="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/80 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
            ></div>

            <div class="relative z-10">
              <div
                class="w-14 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-secondary-500 shadow-sm mb-8 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all duration-500"
              >
                <svg
                  v-if="step.iconType === 'profile'"
                  class="w-7 h-7 text-primary-500 group-hover:text-white transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <svg
                  v-else-if="step.iconType === 'match'"
                  class="w-7 h-7 text-primary-500 group-hover:text-white transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3"
                  />
                </svg>
                <svg
                  v-else-if="step.iconType === 'launch'"
                  class="w-7 h-7 text-primary-500 group-hover:text-white transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>

              <h3
                class="text-xl font-bold text-secondary-500 mb-3 group-hover:text-primary-600 transition-colors duration-300"
              >
                {{ step.title }}
              </h3>

              <p class="text-secondary-400/80 font-paragraph-sm">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const { revealItems } = useScrollReveal()

const steps = [
  {
    iconType: 'profile',
    title: 'Buat Profil atau Posting Proyek',
    desc: 'Daftar dalam hitungan menit. Inisiator posting proyek dengan detail role dan kebutuhan. Kontributor isi portofolio dan skill.'
  },
  {
    iconType: 'match',
    title: 'Temukan Match yang Tepat',
    desc: 'Sistem kami mencarikan kandidat atau proyek yang sesuai. Kamu tinggal pilih dan konfirmasi.'
  },
  {
    iconType: 'launch',
    title: 'Mulai Berkolaborasi',
    desc: 'Proyek berjalan terarah, milestone terpantau transparan, dan hasil nyata siap menjadi portofolio unggulan.'
  }
]
</script>
