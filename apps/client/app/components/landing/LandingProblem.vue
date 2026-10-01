<template>
  <section id="problem" class="py-24 bg-white">
    <div class="k-container">
      <div
        class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-start"
      >
        <div>
          <p
            :ref="(el) => revealItems(el, 0)"
            class="reveal-left k-eyebrow text-secondary-400"
          >
            Kenali Problemnya
          </p>
          <h2
            :ref="(el) => revealItems(el, 1)"
            class="reveal-left k-section-title text-secondary-500 mt-3 mb-5"
            style="--delay: 100ms"
          >
            Kolaborasi itu mudah diucapkan,<br />
            <span class="text-primary-500">sulit dijalankan.</span>
          </h2>
          <p
            :ref="(el) => revealItems(el, 2)"
            class="reveal-left text-secondary-400/80 font-paragraph-sm mb-8"
            style="--delay: 200ms"
          >
            Banyak ide brilian gagal bukan karena kekurangan talenta tapi karena
            tidak ada ruang yang tepat untuk menemukan orang yang tepat.
            Freelance platform terlalu transaksional. LinkedIn terlalu pasif.
            Komunitas Discord terlalu berisik.
          </p>

          <ul class="space-y-4">
            <li
              v-for="(p, i) in problems"
              :key="p.title"
              :ref="(el) => revealItems(el, 3 + i)"
              class="reveal-left flex gap-4 pb-4 border-b border-black/[.06] last:border-0 last:pb-0"
              :style="`--delay: ${300 + i * 100}ms`"
            >
              <span
                class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-50 border border-red-100 text-red-500 shadow-xs"
              >
                <svg
                  v-if="p.iconType === 'search'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <svg
                  v-else-if="p.iconType === 'draft'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <svg
                  v-else-if="p.iconType === 'time'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div>
                <p class="text-secondary-500 text-body text-sm">
                  {{ p.title }}
                </p>
                <p class="text-secondary-400/70 font-body-sm mt-0.5">
                  {{ p.desc }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div class="lg:pt-12">
          <div
            :ref="(el) => revealItems(el, 10)"
            class="reveal-right bg-primary-500/5 border border-primary-500/15 rounded-2xl p-7"
            style="--delay: 400ms"
          >
            <p class="k-eyebrow text-primary-500 mb-4">Kolaboria Menjawab</p>
            <ul class="space-y-5">
              <li
                v-for="s in solutions"
                :key="s.title"
                class="flex gap-3 items-start"
              >
                <span
                  class="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-primary-500/30"
                >
                  <svg
                    class="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <p class="text-secondary-500 text-body text-sm">
                    {{ s.title }}
                  </p>
                  <p class="text-secondary-400/70 font-body-sm mt-0.5">
                    {{ s.desc }}
                  </p>
                </div>
              </li>
            </ul>

            <div class="k-rule my-6"></div>

            <NuxtLink
              to="/register"
              class="w-full flex items-center justify-center gap-2"
            >
              <AtomicButton variant="primary" class="w-full">
                Coba Sekarang, Gratis
              </AtomicButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const { revealItems } = useScrollReveal()

const problems = [
  {
    iconType: 'search',
    title: 'Susah Nemuin Kolaborator yang Tepat',
    desc: 'Platform freelance terlalu transaksional tidak didesain untuk kolaborasi jangka panjang yang bermakna.'
  },
  {
    iconType: 'draft',
    title: 'Ide Bagus Mati di Draft',
    desc: 'Banyak inisiator proyek yang menyerah bukan karena idenya buruk, tapi karena tidak tahu cara menemukan tim yang pas.'
  },
  {
    iconType: 'time',
    title: 'Waktu Terbuang di Koordinasi',
    desc: 'Tanpa tools yang tepat, koordinasi proyek jadi boros energi dan membunuh momentum kolaborasi.'
  }
]

const solutions = [
  {
    title: 'Smart Project Matching',
    desc: 'Sistem kami mencocokkan proyek dengan kontributor berdasarkan skill dan ketersediaan secara otomatis.'
  },
  {
    title: 'Struktur Kolaborasi yang Jelas',
    desc: 'Setiap proyek punya role terdefinisi, slot kontributor, dan roadmap yang terstruktur.'
  },
  {
    title: 'Workspace Kolaborasi Terpadu',
    desc: 'Lacak progres tugas, milestone proyek, dan komunikasi tim dalam satu platform tanpa hambatan.'
  }
]
</script>
