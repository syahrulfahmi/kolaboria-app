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
            class="group h-full bg-white rounded-2xl p-6 border border-black/[.07] hover:border-primary-400/40 shadow-sm hover:shadow-xl hover:shadow-black/[.06] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:-translate-y-1 cursor-default"
          >
            <div
              :class="[
                'w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-xl',
                'transition-transform duration-300 group-hover:-translate-y-0.5',
                feat.iconBg
              ]"
            >
              {{ feat.icon }}
            </div>

            <div class="k-rule mb-4"></div>
            <h3 class="text-secondary-500 font-bold text-sm mb-1.5">
              {{ feat.title }}
            </h3>
            <p class="text-secondary-400/65 text-[0.8rem] leading-relaxed">
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
    icon: '🎯',
    iconBg: 'bg-primary-50 border border-primary-100',
    title: 'Smart Matching',
    desc: 'Sistem kami menyarankan proyek dan kolaborator berdasarkan skill dan minatmu secara otomatis tanpa pencarian manual.'
  },
  {
    icon: '📋',
    iconBg: 'bg-secondary-50 border border-secondary-100',
    title: 'Manajemen Proyek Terintegrasi',
    desc: 'Update progres, atur role, dan lacak kontribusi anggota langsung dari satu halaman tanpa alat tambahan.'
  },
  {
    icon: '🔒',
    iconBg: 'bg-gray-50 border border-gray-100',
    title: 'Profil Terverifikasi',
    desc: 'Setiap anggota melewati proses verifikasi dasar sehingga kamu tahu kamu berkolaborasi dengan orang nyata.'
  },
  {
    icon: '💬',
    iconBg: 'bg-primary-50 border border-primary-100',
    title: 'Komunikasi Real-time',
    desc: 'Chat dan notifikasi proyek terintegrasi. Tidak perlu berpindah ke WhatsApp atau Slack untuk koordinasi.'
  },
  {
    icon: '🎓',
    iconBg: 'bg-amber-50 border border-amber-100',
    title: 'Mentor-in-Residence',
    desc: 'Setiap proyek bisa memiliki mentor yang memberikan review dan arah — kolaborasi yang diarahkan menghasilkan lebih baik.'
  },
  {
    icon: '📊',
    iconBg: 'bg-secondary-50 border border-secondary-100',
    title: 'Portfolio Otomatis',
    desc: 'Setiap kontribusi yang kamu berikan terekam dan otomatis menjadi bagian dari portofolio publik profilmu.'
  }
]
</script>
