<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Verifikasi Email Anda - Kolaboria'
})

const route = useRoute()
const { user, resendVerification } = useAuth()
const { add: addToast } = useToast()

const email = computed(() => {
  const q = route.query.email
  if (typeof q === 'string' && q.trim()) return q.trim()
  return user.value?.email || ''
})

const { remainingSeconds, isCoolingDown, setAvailableAt } =
  useVerificationCooldown(email)

const isResending = ref(false)

const handleResend = async () => {
  if (isResending.value || isCoolingDown.value || !email.value) return
  isResending.value = true

  try {
    const res = await resendVerification(email.value)
    if (res?.data?.verificationResendAvailableAt) {
      setAvailableAt(res.data.verificationResendAvailableAt)
    }

    addToast({
      variant: 'success',
      title: 'Email Terkirim',
      message: 'Link verifikasi baru telah dikirim ke email kamu.',
      duration: 6000
    })
  } catch (err: any) {
    const errorData = err?.data?.errors
    if (errorData?.verificationResendAvailableAt) {
      setAvailableAt(errorData.verificationResendAvailableAt)
    }

    const msg =
      err?.data?.message ||
      err?.message ||
      'Gagal mengirim ulang email verifikasi. Silakan coba lagi.'
    addToast({
      variant: 'danger',
      title: 'Gagal Mengirim',
      message: msg
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
    <h2 class="font-title-2 mb-2">Verifikasi Email Kamu</h2>
    <p class="font-paragraph-3 mb-6">
      Kami telah mengirimkan link verifikasi email ke
      <span class="font-label-1">{{ email || 'email Anda' }}</span
      >. Silakan periksa inbox atau folder spam kamu.
    </p>

    <div class="space-y-4">
      <AtomicButton
        variant="primary"
        block
        :loading="isResending"
        :disabled="isCoolingDown || !email"
        @click="handleResend"
      >
        {{
          isCoolingDown
            ? `Kirim Ulang (${remainingSeconds}s)`
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
