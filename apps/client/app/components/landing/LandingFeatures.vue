<template>
  <section id="features" class="py-24 bg-neutral-50">
    <div class="k-container">
      <div class="text-center mb-14 max-w-xl mx-auto">
        <p
          :ref="(el) => revealItems(el, 0)"
          class="reveal k-eyebrow text-primary-500"
        >
          Fitur Unggulan
        </p>
        <h2
          :ref="(el) => revealItems(el, 1)"
          class="reveal k-section-title text-secondary-500 mt-3"
          style="--delay: 100ms"
        >
          Dibangun untuk Kolaborasi<br />yang Manusiawi
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(feat, i) in features"
          :key="feat.title"
          :ref="(el) => revealItems(el, 2 + i)"
          class="reveal h-full"
          :style="`--delay: ${200 + i * 100}ms`"
        >
          <div
            class="group h-full bg-white rounded-2xl p-6 border border-neutral-200 hover:border-primary-400/40 shadow-sm hover:shadow-xl hover:shadow-black/[.06] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:-translate-y-1 cursor-default"
          >
            <div
              :class="[
                'w-11 h-11 rounded-xl flex items-center justify-center mb-5',
                'transition-transform duration-300 group-hover:-translate-y-0.5',
                feat.iconBg
              ]"
            >
              <svg
                v-if="feat.iconType === 'matching'"
                class="w-5 h-5"
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
                v-else-if="feat.iconType === 'management'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <svg
                v-else-if="feat.iconType === 'verified'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <svg
                v-else-if="feat.iconType === 'chat'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <svg
                v-else-if="feat.iconType === 'milestone'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <svg
                v-else-if="feat.iconType === 'portfolio'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <div class="k-rule mb-4"></div>
            <h3 class="text-secondary-900 font-label-1 mb-1.5">
              {{ feat.title }}
            </h3>
            <p class="text-secondary-600 font-body-2 leading-relaxed">
              {{ feat.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const { revealItems } = useScrollReveal()

const features = [
  {
    iconType: 'matching',
    iconBg: 'bg-primary-50 border border-primary-100 text-primary-500',
    title: 'Smart Matching',
    desc: 'Sistem kami menyarankan proyek dan kolaborator berdasarkan skill dan minatmu secara otomatis tanpa pencarian manual.'
  },
  {
    iconType: 'management',
    iconBg: 'bg-secondary-50 border border-secondary-100 text-secondary-500',
    title: 'Manajemen Proyek Terintegrasi',
    desc: 'Update progres, atur role, dan lacak kontribusi anggota langsung dari satu dashboard tanpa alat tambahan.'
  },
  {
    iconType: 'verified',
    iconBg: 'bg-success-50 border border-success-100 text-success-700',
    title: 'Profil Terverifikasi',
    desc: 'Setiap anggota melewati proses verifikasi dasar sehingga kamu tahu kamu berkolaborasi dengan talenta terpercaya.'
  },
  {
    iconType: 'chat',
    iconBg: 'bg-primary-50 border border-primary-100 text-primary-500',
    title: 'Komunikasi Real-time',
    desc: 'Diskusi dan notifikasi proyek terintegrasi langsung untuk koordinasi tim yang cepat tanpa hambatan.'
  },
  {
    iconType: 'milestone',
    iconBg: 'bg-accent-50 border border-accent-100 text-accent-700',
    title: 'Milestone & Workspace',
    desc: 'Bagi proyek ke dalam sprint dan target terukur. Pastikan deliverables selesai tepat waktu dengan koordinasi transparan.'
  },
  {
    iconType: 'portfolio',
    iconBg: 'bg-secondary-50 border border-secondary-100 text-secondary-500',
    title: 'Portofolio Otomatis',
    desc: 'Setiap kontribusi yang kamu selesaikan terekam otomatis dan menjadi bagian dari portofolio publik profilmu.'
  }
]
</script>
