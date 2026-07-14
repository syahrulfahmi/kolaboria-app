<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Verifikasi Email Anda - Kolaboria'
})

const route = useRoute()
const { resendVerification } = useAuth()
const { add: addToast } = useToast()

const email = computed(() => (route.query.email as string) || '')
const isResending = ref(false)
const cooldown = ref(0)
let timer: any = null

const startCooldown = () => {
  cooldown.value = 60
  timer = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const handleResend = async () => {
  if (isResending.value || cooldown.value > 0) return
  isResending.value = true

  try {
    await resendVerification(email.value)
    addToast({
      variant: 'success',
      title: 'Email Terkirim',
      message: 'Link verifikasi baru telah dikirim ke email kamu.',
      duration: 6000
    })
    startCooldown()
  } catch (err: unknown) {
    addToast({
      variant: 'danger',
      title: 'Gagal Mengirim',
      message: 'Gagal mengirim ulang email verifikasi. Silakan coba lagi.'
    })
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <div class="text-center py-6">
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mx-auto mb-6"
    >
      <svg
        class="h-8 w-8 text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h2 class="text-heading font-black text-secondary-500 mb-2">
      Verifikasi Email Kamu
    </h2>
    <p class="text-body text-neutral-500 mb-6">
      Kami telah mengirimkan link verifikasi email ke
      <span class="text-body text-neutral-900">{{ email }}</span
      >. Silakan periksa inbox atau folder spam kamu.
    </p>

    <div class="space-y-4">
      <AtomicButton
        variant="primary"
        block
        :loading="isResending"
        :disabled="cooldown > 0"
        @click="handleResend"
      >
        {{
          cooldown > 0
            ? `Kirim Ulang (${cooldown}s)`
            : 'Kirim Ulang Email Verifikasi'
        }}
      </AtomicButton>

      <NuxtLink
        to="/login"
        class="block text-sm text-body text-primary-600 hover:text-primary-700"
      >
        Kembali ke Halaman Masuk
      </NuxtLink>
    </div>
  </div>
</template>
