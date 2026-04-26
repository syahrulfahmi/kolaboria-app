<template>
  <section id="paths" class="py-24 bg-white">
    <div class="k-container">
      <div class="text-center mb-14 max-w-xl mx-auto">
        <p
          :ref="(el) => revealItems(el, 0)"
          class="reveal k-eyebrow text-primary-500"
        >
          Untuk Siapa
        </p>
        <h2
          :ref="(el) => revealItems(el, 1)"
          class="reveal k-section-title text-secondary-500 mt-3"
          style="--delay: 100ms"
        >
          Kamu di Sisi yang Mana?
        </h2>
        <p
          :ref="(el) => revealItems(el, 2)"
          class="reveal text-secondary-400/70 text-sm leading-relaxed mt-4"
          style="--delay: 200ms"
        >
          Dua jalur berbeda, satu tujuan: kolaborasi yang menghasilkan.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          :ref="(el) => revealItems(el, 3)"
          class="reveal-left relative bg-secondary-500 rounded-2xl p-8 md:p-10 overflow-hidden group hover:shadow-2xl hover:shadow-secondary-700/25 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
          style="--delay: 300ms"
        >
          <div
            class="k-dot-texture absolute inset-0 opacity-[.06]"
            aria-hidden="true"
          ></div>

          <div
            class="absolute top-0 right-0 w-40 h-40 opacity-[.04]"
            style="
              background: repeating-linear-gradient(
                45deg,
                white 0px,
                white 1px,
                transparent 1px,
                transparent 12px
              );
            "
            aria-hidden="true"
          ></div>

          <div class="relative z-10">
            <div
              class="w-12 h-12 rounded-xl bg-accent-400/20 border border-accent-400/25 flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span
              class="inline-block px-2.5 py-0.5 bg-accent-400/15 text-accent-300 text-[0.65rem] font-bold rounded uppercase tracking-widest mb-3"
              >Inisiator Proyek</span
            >
            <h3 class="text-2xl font-black text-white mb-3 tracking-tight">
              Punya Ide? Wujudkan.
            </h3>
            <p class="text-white/55 text-[0.9rem] leading-relaxed mb-8">
              Post proyekmu, definisikan role, dan temukan kontributor yang pas
              dari developer sampai desainer, semuanya siap bergerak.
            </p>
            <ul class="space-y-3 mb-10">
              <li
                v-for="p in initiatorPerks"
                :key="p"
                class="flex items-start gap-3"
              >
                <span
                  class="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-px"
                >
                  <svg
                    class="w-3 h-3 text-primary-400"
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
                <span class="text-white/70 text-sm">{{ p }}</span>
              </li>
            </ul>

            <div class="k-rule-light mb-6"></div>
            <NuxtLink to="/register">
              <AtomicButton variant="secondary">
                Mulai Posting Proyek
              </AtomicButton>
            </NuxtLink>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div
            :ref="(el) => revealItems(el, 4)"
            class="reveal-right flex-1 bg-white rounded-2xl p-7 border border-black/[.07] hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-500/8 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] group relative overflow-hidden"
            style="--delay: 400ms"
          >
            <div
              class="absolute inset-0 opacity-[.025]"
              style="
                background-image: repeating-linear-gradient(
                  0deg,
                  #1c2e4a 0px,
                  #1c2e4a 1px,
                  transparent 1px,
                  transparent 28px
                );
              "
              aria-hidden="true"
            ></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3.5 mb-4">
                <div
                  class="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <span
                    class="text-primary-500 text-[0.65rem] font-bold uppercase tracking-widest"
                    >Kontributor / Talenta</span
                  >
                  <h3
                    class="text-secondary-500 font-black text-[1.1rem] leading-tight"
                  >
                    Kerjakan Proyek Nyata
                  </h3>
                </div>
              </div>
              <p class="text-secondary-400/70 text-sm leading-relaxed mb-5">
                Bangun portofolio yang bisa dibuktikan. Kontribusi ke proyek
                sungguhan dan terhubung langsung dengan pemiliknya.
              </p>
              <div class="flex flex-wrap gap-x-5 gap-y-2 mb-5">
                <span
                  v-for="p in talentPerks"
                  :key="p"
                  class="k-perk-item text-secondary-400"
                >
                  <svg
                    class="w-3.5 h-3.5 text-primary-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ p }}
                </span>
              </div>
              <NuxtLink
                to="/register"
                class="text-sm font-bold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1 transition-colors duration-200 underline-offset-2"
              >
                Gabung sebagai Talenta
              </NuxtLink>
            </div>
          </div>

          <div
            :ref="(el) => revealItems(el, 5)"
            class="reveal-right flex-1 bg-white rounded-2xl p-7 border border-black/[.07] hover:border-accent-400/50 hover:shadow-lg hover:shadow-accent-500/8 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] group relative overflow-hidden"
            style="--delay: 500ms"
          >
            <div
              class="absolute inset-0 opacity-[.025]"
              style="
                background-image: repeating-linear-gradient(
                  0deg,
                  #1c2e4a 0px,
                  #1c2e4a 1px,
                  transparent 1px,
                  transparent 28px
                );
              "
              aria-hidden="true"
            ></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3.5 mb-4">
                <div
                  class="w-10 h-10 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-accent-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.748 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <span
                    class="text-accent-600 text-[0.65rem] font-bold uppercase tracking-widest"
                    >Mentor</span
                  >
                  <h3
                    class="text-secondary-500 font-black text-[1.1rem] leading-tight"
                  >
                    Bagikan Keahlianmu
                  </h3>
                </div>
              </div>
              <p class="text-secondary-400/70 text-sm leading-relaxed mb-5">
                Bimbing talenta dalam proyek nyata. Berikan feedback bermakna
                dan perluas jaringan profesionalmu.
              </p>
              <div class="flex flex-wrap gap-x-5 gap-y-2 mb-5">
                <span
                  v-for="p in mentorPerks"
                  :key="p"
                  class="k-perk-item text-secondary-400"
                >
                  <svg
                    class="w-3.5 h-3.5 text-accent-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ p }}
                </span>
              </div>
              <NuxtLink
                to="/register"
                class="text-sm font-bold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1 transition-colors duration-200 underline-offset-2"
              >
                Gabung sebagai Mentor
              </NuxtLink>
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

const initiatorPerks = [
  'Post proyek dengan detail role yang kamu butuhkan',
  'Pilih langsung dari daftar kandidat yang relevan',
  'Pantau progress tim dari satu dashboard',
  'Tambahkan mentor untuk mengawasi kualitas proyek'
]

const talentPerks = [
  'Portofolio nyata & terverifikasi',
  'Feedback dari mentor senior',
  'Koneksi langsung ke inisiator'
]

const mentorPerks = [
  'Bangun reputasi mentor',
  'Jadwal fleksibel',
  'Dampak nyata pada talenta'
]
</script>
