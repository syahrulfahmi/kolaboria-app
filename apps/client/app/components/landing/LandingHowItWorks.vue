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
                class="w-14 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-3xl shadow-sm mb-8 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all duration-500"
              >
                <span class="transition-all duration-500">{{ step.icon }}</span>
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
    icon: '📝',
    title: 'Buat Profil atau Posting Proyek',
    desc: 'Daftar dalam hitungan menit. Inisiator posting proyek dengan detail role dan kebutuhan. Kontributor isi portofolio dan skill.'
  },
  {
    icon: '🎯',
    title: 'Temukan Match yang Tepat',
    desc: 'Sistem kami mencarikan kandidat atau proyek yang sesuai. Kamu tinggal pilih dan konfirmasi.'
  },
  {
    icon: '🚀',
    title: 'Mulai Berkolaborasi',
    desc: 'Proyek berjalan, progress terpantau, dan hasilnya nyata dengan bimbingan mentor yang relevan.'
  }
]
</script>
