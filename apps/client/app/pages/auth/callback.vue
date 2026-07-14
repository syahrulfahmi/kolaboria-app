<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getApiErrorMessage } from '../../utils/error'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Menghubungkan Akun... - Kolaboria'
})

const route = useRoute()
const router = useRouter()
const { loginWithGoogleCallback } = useAuth()
const errorMsg = ref('')

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    errorMsg.value = 'Kode otorisasi dari Google tidak ditemukan.'
    return
  }

  try {
    await loginWithGoogleCallback(code)
    router.push('/home')
  } catch (err: unknown) {
    errorMsg.value = getApiErrorMessage(
      err,
      'Gagal masuk dengan akun Google. Silakan coba lagi.'
    )
  }
})
</script>

<template>
  <div>
    <!-- State: Menghubungkan (Loading) -->
    <div
      v-if="!errorMsg"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <MoleculeLoading type="section" label="Menghubungkan dengan Google..." />
    </div>

    <!-- State: Gagal (Error) -->
    <div v-else class="py-4">
      <MoleculeTicker
        variant="danger"
        :message="errorMsg"
        class="mb-6"
        :closable="false"
      />
      <div class="text-center">
        <NuxtLink
          to="/login"
          class="text-primary-600 hover:text-primary-700 text-body text-sm transition-colors duration-150"
        >
          Kembali ke Halaman Masuk
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
