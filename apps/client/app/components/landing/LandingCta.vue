<template>
  <section class="relative py-28 bg-secondary-500 overflow-hidden">
    <div
      class="k-dot-texture absolute inset-0 opacity-[.05]"
      aria-hidden="true"
    ></div>

    <div
      class="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-primary-500/15 blur-3xl rounded-full pointer-events-none"
    ></div>

    <div
      :ref="(el) => revealItems(el, 0)"
      class="reveal-scale relative z-10 k-container max-w-3xl mx-auto text-center"
    >
      <p class="k-eyebrow text-primary-400 mb-5">Saatnya Bergerak</p>
      <h2
        class="text-3xl md:text-5xl font-black text-white leading-[1.08] tracking-tight mb-6"
      >
        Bergabunglah & mulai<br />
        <span class="text-primary-400">berkolaborasi hari ini.</span>
      </h2>
      <p
        class="text-white/55 text-[0.95rem] leading-relaxed mb-10 max-w-xl mx-auto"
      >
        Lebih dari 2.000 talenta, 500 mentor, dan ratusan proyek aktif
        menunggumu. Tidak perlu kartu kredit. Cukup daftar dan mulai.
      </p>

      <div class="k-rule-light max-w-xs mx-auto mb-10"></div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink to="/register">
          <AtomicButton variant="secondary">
            Buat Akun Gratis Sekarang</AtomicButton
          >
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const { revealItems } = useScrollReveal()
</script>
