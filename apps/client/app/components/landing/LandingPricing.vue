<template>
  <section
    id="pricing"
    class="py-24 relative overflow-hidden bg-gradient-to-b from-neutral-100/80 via-primary-50/45 to-white border-y border-primary-100/70"
  >
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/70 to-transparent" aria-hidden="true"></div>
    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-200/60 to-transparent" aria-hidden="true"></div>

    <!-- Seamless Atmospheric Background Effects -->
    <div
      class="k-dot-texture absolute inset-0 opacity-[.035] pointer-events-none"
      aria-hidden="true"
    ></div>

    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-400/10 blur-[130px] rounded-full pointer-events-none"
      aria-hidden="true"
    ></div>

    <div
      class="absolute bottom-0 right-10 w-[500px] h-[300px] bg-accent-400/8 blur-[120px] rounded-full pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="k-container relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-12 max-w-2xl mx-auto">
        <p
          :ref="(el) => revealItems(el, 0)"
          class="reveal k-eyebrow text-primary-500"
        >
          Paket & Transparansi Biaya
        </p>
        <h2
          :ref="(el) => revealItems(el, 1)"
          class="reveal k-section-title text-secondary-500 mt-3"
          style="--delay: 100ms"
        >
          Satu Paket untuk<br />
          <span class="text-primary-500">Dua Peran Kolaboria</span>
        </h2>
        <p
          :ref="(el) => revealItems(el, 2)"
          class="reveal text-secondary-600 mt-4 font-paragraph-2 leading-relaxed"
          style="--delay: 200ms"
        >
          Setiap paket mencakup manfaat untuk talenta dan inisiator. Pilih masa langganan yang cocok, lalu tingkatkan kapasitas kolaborasimu kapan saja.
        </p>
      </div>

      <!-- Billing Cycle Toggle -->
      <div
        :ref="(el) => revealItems(el, 3)"
        class="reveal flex justify-center mb-10"
        style="--delay: 250ms"
      >
        <div class="inline-flex w-full max-w-sm items-center gap-1 rounded-full border border-neutral-200 bg-white/80 p-1 shadow-xs">
          <button
            type="button"
            @click="isYearly = false"
            :aria-pressed="!isYearly"
            :class="[
              'flex-1 rounded-full px-4 py-2 font-label-3 transition-all duration-200',
              !isYearly
                ? 'bg-secondary-500 text-white shadow-xs'
                : 'text-secondary-400 hover:text-secondary-600'
            ]"
          >
            Bulanan
          </button>
          <button
            type="button"
            @click="isYearly = true"
            :aria-pressed="isYearly"
            :class="[
              'flex-1 rounded-full px-3 py-2 font-label-3 transition-all duration-200 flex items-center justify-center gap-1.5',
              isYearly
                ? 'bg-secondary-500 text-white shadow-xs'
                : 'text-secondary-400 hover:text-secondary-600'
            ]"
          >
            Tahunan
            <span class="rounded-full bg-accent-400 px-1.5 py-0.5 font-label-3 text-secondary-900">Hemat 25%</span>
          </button>
        </div>
      </div>

      <!-- Three Packages for Both Roles -->
      <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-5">
        <article
          v-for="(plan, index) in plans"
          :key="plan.id"
          :ref="(el) => revealItems(el, 4 + index)"
          :class="[
            'reveal relative flex h-full flex-col rounded-3xl border p-6 sm:p-7 transition-all duration-300',
            plan.bestOffer
              ? 'border-primary-400 bg-white shadow-xl shadow-primary-900/10 ring-2 ring-primary-300/70 lg:-translate-y-2'
              : 'border-neutral-200 bg-white/90 shadow-sm hover:border-primary-200 hover:shadow-lg'
          ]"
          :style="{ '--delay': `${300 + index * 100}ms` }"
        >
          <span
            v-if="plan.bestOffer"
            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-400 px-4 py-1 font-label-3 uppercase tracking-wider text-secondary-900 shadow-sm"
          >
            Best offer
          </span>

          <div class="flex-1">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="font-title-2 text-secondary-900">{{ plan.name }}</h3>
              <span
                v-if="plan.bestOffer"
                class="rounded-full bg-primary-50 px-2.5 py-1 font-label-3 text-primary-600"
              >
                Paling seimbang
              </span>
            </div>
            <p class="min-h-10 font-paragraph-4 leading-relaxed text-secondary-600">{{ plan.description }}</p>

            <div class="mt-5 border-b border-neutral-200 pb-5">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black tracking-tight text-secondary-900">
                  {{ isYearly ? plan.annualPrice : plan.monthlyPrice }}
                </span>
                <span class="font-body-3 text-secondary-500">
                  {{ isYearly ? plan.annualPeriod : plan.monthlyPeriod }}
                </span>
              </div>
              <p class="mt-1 min-h-8 font-body-3 text-secondary-500">
                {{ isYearly ? plan.annualNote : plan.monthlyNote }}
              </p>
            </div>

            <div class="mt-5">
              <h4 class="mb-3 font-label-3 uppercase tracking-wide text-secondary-700">Untuk talenta</h4>
              <ul class="space-y-2.5">
                <li
                  v-for="feature in plan.talentFeatures"
                  :key="feature"
                  class="flex items-start gap-2.5 font-body-3 text-secondary-700"
                >
                  <span class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700" aria-hidden="true">
                    <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span class="leading-relaxed">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <div class="mt-5 border-t border-neutral-200 pt-5">
              <h4 class="mb-3 font-label-3 uppercase tracking-wide text-secondary-700">Untuk inisiator</h4>
              <ul class="space-y-2.5">
                <li
                  v-for="feature in plan.initiatorFeatures"
                  :key="feature"
                  class="flex items-start gap-2.5 font-body-3 text-secondary-700"
                >
                  <span class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600" aria-hidden="true">
                    <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span class="leading-relaxed">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <NuxtLink to="/register" class="mt-7 inline-block w-full">
            <AtomicButton :variant="plan.bestOffer ? 'primary' : 'outline'" size="md" class="w-full">
              {{ plan.cta }}
            </AtomicButton>
          </NuxtLink>
        </article>
      </div>
      <!-- Trust Guarantees -->
      <div class="mt-10 pt-6 flex flex-wrap justify-center items-center gap-6 sm:gap-12 font-body-3 text-secondary-600 text-center">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Tanpa kartu kredit saat mendaftar</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Ubah atau batalkan paket kapan saja</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Data dan portofolio tetap tersimpan aman</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

const { revealItems } = useScrollReveal()

const isYearly = ref(false)

const plans = [
  {
    id: 'community',
    name: 'Komunitas',
    description: 'Mulai berkolaborasi dan bangun reputasi di Kolaboria.',
    monthlyPrice: 'Rp 0',
    annualPrice: 'Rp 0',
    monthlyPeriod: '/ bulan',
    annualPeriod: '/ tahun',
    monthlyNote: 'Gratis untuk talenta dan fitur dasar inisiator.',
    annualNote: 'Tetap gratis, tanpa komitmen tahunan.',
    cta: 'Mulai Gratis',
    bestOffer: false,
    talentFeatures: [
      'Jelajahi dan lamar proyek tanpa biaya',
      'Ikuti 1 proyek aktif secara bersamaan',
      'Profil, portofolio, dan ulasan dasar'
    ],
    initiatorFeatures: [
      'Publikasikan hingga 2 proyek aktif',
      'Maksimal 5 kontributor per proyek',
      'Workspace, kanban, dan seleksi tim dasar'
    ]
  },
  {
    id: 'plus',
    name: 'Kolaboria Plus',
    description: 'Tambah kapasitas dan temukan kolaborator yang lebih sesuai.',
    monthlyPrice: 'Rp 39.000',
    annualPrice: 'Rp 29.000',
    monthlyPeriod: '/ bulan',
    annualPeriod: '/ bulan',
    monthlyNote: 'Ditagih bulanan · ubah atau batalkan kapan saja.',
    annualNote: 'Ditagih Rp 348.000 / tahun · hemat Rp 120.000.',
    cta: 'Pilih Plus',
    bestOffer: true,
    talentFeatures: [
      'Ikuti hingga 3 proyek aktif bersamaan',
      'Profil lebih mudah ditemukan inisiator',
      'Portofolio dan reputasi yang lebih lengkap'
    ],
    initiatorFeatures: [
      'Kelola hingga 5 proyek aktif',
      'Maksimal 10 kontributor per proyek',
      'Smart matching berdasarkan keahlian'
    ]
  },
  {
    id: 'pro',
    name: 'Kolaboria Pro',
    description: 'Kapasitas penuh untuk kolaborasi dan pertumbuhan proyek.',
    monthlyPrice: 'Rp 79.000',
    annualPrice: 'Rp 59.000',
    monthlyPeriod: '/ bulan',
    annualPeriod: '/ bulan',
    monthlyNote: 'Ditagih bulanan · ubah atau batalkan kapan saja.',
    annualNote: 'Ditagih Rp 708.000 / tahun · hemat Rp 240.000.',
    cta: 'Pilih Pro',
    bestOffer: false,
    talentFeatures: [
      'Ikuti proyek aktif tanpa batas bersamaan',
      'Prioritas tampil di direktori talenta',
      'Portofolio unggulan dan riwayat kontribusi lengkap'
    ],
    initiatorFeatures: [
      'Proyek aktif dan slot kontributor tanpa batas',
      'Prioritas tampil dan smart matching lanjutan',
      'Lencana Verified Project dan analitik sprint'
    ]
  }
]</script>
