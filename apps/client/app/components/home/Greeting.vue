<script setup lang="ts">
defineProps<{
  name: string
  isVerified: boolean
  headline?: string | null
  completionScore?: number
  primarySkillName?: string | null
}>()
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-r from-primary-50 via-white to-white p-6 shadow-sm sm:p-8"
  >
    <!-- Decorative blur circle -->
    <div
      class="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary-100/60 blur-3xl"
    ></div>

    <div
      class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div class="max-w-2xl">
        <AtomicTag :variant="isVerified ? 'success' : 'warning'" class="mb-4">
          {{ isVerified ? 'Verified talent' : 'Menunggu verifikasi email' }}
        </AtomicTag>

        <div class="flex items-center gap-4 fade-in-up">
          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-title font-bold text-primary-700 shadow-sm"
          >
            {{ name.charAt(0).toUpperCase() }}
          </div>
          <h1 class="text-heading text-secondary-900">Halo, {{ name }}</h1>
        </div>

        <p class="mt-4 text-body text-neutral-600">
          {{
            isVerified
              ? 'Profilmu sudah bisa dipakai untuk mulai mencari kolaborasi yang relevan.'
              : 'Lengkapi fondasi portfolio sambil menyelesaikan verifikasi email.'
          }}
        </p>
      </div>

      <div class="grid min-w-full grid-cols-2 gap-3 sm:min-w-[320px]">
        <div
          class="rounded-xl border border-primary-100 bg-white/80 p-4 backdrop-blur-sm"
        >
          <p class="text-caption font-semibold uppercase text-primary-700">
            Readiness
          </p>
          <p class="mt-1 text-title text-primary-900">
            {{ completionScore ?? 0 }}%
          </p>
        </div>
        <div
          class="rounded-xl border border-neutral-200 bg-white/80 p-4 backdrop-blur-sm"
        >
          <p class="text-caption font-semibold uppercase text-neutral-600">
            Fokus
          </p>
          <p class="mt-1 truncate text-title text-secondary-900">
            {{ primarySkillName || headline || 'Belum diatur' }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out both;
}
</style>
