<script setup lang="ts">
import type { NuxtError } from '#app'
import { useRouter } from 'vue-router'
import LandingFooter from './components/landing/LandingFooter.vue'

defineProps({
  error: Object as () => NuxtError
})

const router = useRouter()
const handleError = () => clearError({ redirect: '/' })
const handleBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    handleError()
  }
}

// Page metadata
useHead({
  title: 'Halaman Tidak Ditemukan - Kolaboria',
  meta: [
    {
      name: 'description',
      content: 'Halaman yang kamu cari tidak ditemukan atau telah dipindahkan.'
    }
  ]
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col font-sans bg-white selection:bg-primary-100 selection:text-primary-600 relative overflow-hidden"
  >
    <!-- Background Texture -->
    <div
      class="absolute inset-0 opacity-[.025]"
      style="
        background-image:
          repeating-linear-gradient(
            0deg,
            #1c2e4a 0px,
            #1c2e4a 1px,
            transparent 1px,
            transparent 32px
          ),
          repeating-linear-gradient(
            90deg,
            #1c2e4a 0px,
            #1c2e4a 1px,
            transparent 1px,
            transparent 32px
          );
      "
      aria-hidden="true"
    ></div>

    <!-- Navigation -->
    <LandingNavbar />

    <!-- Main Content -->
    <main
      class="flex-1 flex flex-col items-center justify-center relative px-6 py-20 z-10 w-full max-w-lg mx-auto text-center"
    >
      <h1
        class="text-display font-black text-gray-900 leading-none mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-500 select-none"
      >
        404
      </h1>

      <!-- Error Message -->
      <h2
        class="text-3xl md:text-4xl font-black text-secondary-500 mb-4 tracking-tight"
      >
        Halaman tidak ditemukan.
      </h2>
      <p class="text-base text-secondary-400/80 mb-10 leading-relaxed">
        Mungkin URL-nya salah ketik, atau halamannya sudah dipindahkan. Yuk,
        kembali ke tempat yang lebih ramai!
      </p>

      <!-- Actions -->
      <div
        class="flex flex-col sm:flex-row gap-3 justify-center items-center w-full"
      >
        <AtomicButton
          variant="primary"
          class="w-full sm:w-auto min-w-[180px]"
          @click="handleError"
        >
          Kembali ke Beranda
        </AtomicButton>
        <AtomicButton
          variant="outline"
          class="w-full sm:w-auto min-w-[180px]"
          @click="handleBack"
        >
          Halaman Sebelumnya
        </AtomicButton>
      </div>
    </main>

    <!-- Footer -->
    <LandingFooter class="relative z-10" />
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce-float 3s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

@keyframes bounce-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
