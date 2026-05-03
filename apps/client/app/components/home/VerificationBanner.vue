<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isVerified: boolean
}>()

const emit = defineEmits<{
  resend: []
}>()
</script>

<template>
  <MoleculeTicker
    v-if="!isVerified"
    variant="warning"
    :closable="false"
    title="Email belum diverifikasi"
    message="Verifikasi email untuk membuka akses join project dan menjaga profilmu dipercaya oleh calon kolaborator."
    action-label="Kirim ulang email"
    @action="emit('resend')"
  />
</template>
