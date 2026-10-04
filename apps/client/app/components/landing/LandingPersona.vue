<template>
  <section id="paths" class="py-24 bg-white">
    <div class="k-container">
      <div class="text-center mb-16 max-w-xl mx-auto">
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
          class="reveal text-secondary-600 font-paragraph-3 mt-4"
          style="--delay: 200ms"
        >
          Dua jalur berbeda, satu tujuan: kolaborasi yang menghasilkan dampak nyata.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <!-- Card 1: Inisiator Proyek -->
        <div
          :ref="(el) => revealItems(el, 3)"
          class="reveal-left relative bg-secondary-500 rounded-3xl p-8 md:p-10 overflow-hidden group hover:shadow-2xl hover:shadow-secondary-700/30 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] flex flex-col justify-between"
          style="--delay: 300ms"
        >
          <div
            class="k-dot-texture absolute inset-0 opacity-[.06] pointer-events-none"
            aria-hidden="true"
          ></div>

          <div
            class="absolute top-0 right-0 w-48 h-48 opacity-[.05] pointer-events-none"
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
              class="w-14 h-14 rounded-2xl bg-accent-400/20 border border-accent-400/30 flex items-center justify-center mb-6 shadow-sm"
            >
              <svg
                class="w-7 h-7 text-accent-400"
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
              class="inline-block px-3 py-1 bg-accent-400/15 text-accent-300 font-label-3 rounded-full uppercase tracking-wider mb-4"
              >Inisiator Proyek</span
            >

            <h3 class="font-title-1 text-white mb-3 tracking-tight">
              Punya Ide? Wujudkan Bersama Tim.
            </h3>

            <p class="text-white/75 font-paragraph-3 md:font-paragraph-2 mb-8">
              Post proyekmu, definisikan kebutuhan role secara spesifik, dan temukan
              kontributor bertalenta yang siap mengeksekusi ide brilianmu menjadi produk nyata.
            </p>

            <ul class="space-y-3.5 mb-8">
              <li
                v-for="p in initiatorPerks"
                :key="p"
                class="flex items-start gap-3.5"
              >
                <span
                  class="w-5 h-5 rounded-full bg-accent-400/20 border border-accent-400/30 flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <svg
                    class="w-3 h-3 text-accent-300"
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
                <span class="text-white/90 font-body-2">{{ p }}</span>
              </li>
            </ul>
          </div>

          <div class="relative z-10 pt-4">
            <div class="k-rule-light mb-6"></div>
            <NuxtLink to="/register" class="inline-block w-full sm:w-auto">
              <AtomicButton variant="secondary" size="md" class="w-full sm:w-auto">
                Mulai Posting Proyek
              </AtomicButton>
            </NuxtLink>
          </div>
        </div>

        <!-- Card 2: Kontributor / Talenta -->
        <div
          :ref="(el) => revealItems(el, 4)"
          class="reveal-right relative bg-white border border-neutral-200 rounded-3xl p-8 md:p-10 overflow-hidden group hover:border-primary-400/60 shadow-lg shadow-black/[0.03] hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] flex flex-col justify-between"
          style="--delay: 400ms"
        >
          <div
            class="absolute top-0 right-0 w-48 h-48 opacity-[.03] pointer-events-none"
            style="
              background: repeating-linear-gradient(
                45deg,
                var(--color-secondary-500) 0px,
                var(--color-secondary-500) 1px,
                transparent 1px,
                transparent 12px
              );
            "
            aria-hidden="true"
          ></div>

          <div class="relative z-10">
            <div
              class="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mb-6 shadow-sm"
            >
              <svg
                class="w-7 h-7 text-primary-500"
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

            <span
              class="inline-block px-3 py-1 bg-primary-50 text-primary-600 border border-primary-100 font-label-3 rounded-full uppercase tracking-wider mb-4"
              >Kontributor / Talenta</span
            >

            <h3 class="font-title-1 text-secondary-900 mb-3 tracking-tight">
              Punya Skill? Kerjakan Proyek Nyata.
            </h3>

            <p class="text-secondary-600 font-paragraph-3 md:font-paragraph-2 mb-8">
              Bangun portofolio yang terverifikasi dan diakui. Kontribusi ke proyek sungguhan,
              kembangkan kompetensi kerja nyata, dan terhubung langsung dengan inisiator proyek.
            </p>

            <ul class="space-y-3.5 mb-8">
              <li
                v-for="p in talentPerks"
                :key="p"
                class="flex items-start gap-3.5"
              >
                <span
                  class="w-5 h-5 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <svg
                    class="w-3 h-3 text-primary-500"
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
                <span class="text-secondary-700 font-body-2">{{ p }}</span>
              </li>
            </ul>
          </div>

          <div class="relative z-10 pt-4">
            <div class="k-rule mb-6"></div>
            <NuxtLink to="/register" class="inline-block w-full sm:w-auto">
              <AtomicButton variant="primary" size="md" class="w-full sm:w-auto">
                Gabung sebagai Talenta
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

const initiatorPerks = [
  'Post proyek dengan detail role dan kebutuhan tim secara jelas',
  'Pilih langsung dari daftar talenta yang telah dikurasi',
  'Pantau progres sprint dan milestone dari satu dashboard',
  'Validasi hasil kerja tim untuk kesuksesan peluncuran produk'
]

const talentPerks = [
  'Bangun portofolio kredibel dengan proyek digital aktif',
  'Kerjakan tantangan nyata bersama tim kolaborasi lintas bidang',
  'Koneksi langsung dengan founder dan inisiator proyek',
  'Tingkatkan kesiapan karir dengan bukti kontribusi yang terverifikasi'
]
</script>
