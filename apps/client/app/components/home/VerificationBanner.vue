<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isVerified: boolean
}>()

const emit = defineEmits<{
  resend: []
}>()

const { resendVerification } = useAuth()
const { success, error: showError } = useToast()
const isResending = ref(false)
const cooldown = ref(0)

const handleResend = async () => {
  if (isResending.value || cooldown.value > 0) return

  isResending.value = true
  try {
    emit('resend')
    await resendVerification()
    success('Email verifikasi telah dikirim ulang. Silakan periksa inbox Anda.')

    // Cooldown 60 detik
    cooldown.value = 60
    const interval = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  } catch (err: any) {
    showError(err.message || 'Gagal mengirim ulang email.')
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <MoleculeTicker
    v-if="!isVerified"
    variant="warning"
    :closable="false"
    title="Email belum diverifikasi"
    :message="cooldown > 0 ? `Verifikasi email untuk membuka akses join project. Silakan tunggu ${cooldown} detik sebelum mengirim ulang.` : 'Verifikasi email untuk membuka akses join project dan menjaga profilmu dipercaya oleh calon kolaborator.'"
    :action-label="isResending ? 'Mengirim...' : cooldown > 0 ? undefined : 'Kirim ulang email'"
    @action="handleResend"
  />
</template>
