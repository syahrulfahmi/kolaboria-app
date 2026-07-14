<script setup lang="ts">
import { watch } from 'vue'

const { user } = useAuth()
const router = useRouter()

// Watch Go backend user session
watch(
  user,
  (currentUser) => {
    if (currentUser) {
      // Periksa apakah user sudah melakukan onboarding (memiliki accountType)
      // Tipe User dari Go memiliki properti profile?.accountType
      // @ts-ignore
      if (currentUser.profile?.accountType) {
        return router.push('/home')
      } else {
        return router.push('/after-register')
      }
    }
  },
  { immediate: true }
)

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Memproses Sesi... - Kolaboria'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <MoleculeLoading type="section" label="Memproses Sesi Anda..." />
    <p class="text-sm text-neutral-500 mt-4">Sedang memverifikasi data Anda.</p>
  </div>
</template>
