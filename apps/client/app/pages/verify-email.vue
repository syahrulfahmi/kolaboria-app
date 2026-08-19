<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Verifikasi Email - Kolaboria'
})

type VerificationStatus = 'loading' | 'success' | 'error'

const route = useRoute()
const router = useRouter()
const { verifyEmail } = useAuth()

const status = ref<VerificationStatus>('loading')
const message = ref('Sedang memverifikasi email kamu...')
const hasStarted = ref(false)

onMounted(async () => {
  if (hasStarted.value) return
  hasStarted.value = true

  const token = route.query.token

  if (typeof token !== 'string' || !token.trim()) {
    status.value = 'error'
    message.value = 'Link verifikasi tidak valid, sudah digunakan, atau sudah kedaluwarsa.'
    return
  }

  try {
    await verifyEmail(token)
    status.value = 'success'
    message.value = 'Email berhasil diverifikasi! Mengalihkan ke halaman login...'
    router.replace({ path: '/login', query: { verified: '1' } })
  } catch (err: unknown) {
    status.value = 'error'
    message.value = 'Link verifikasi tidak valid, sudah digunakan, atau sudah kedaluwarsa.'
  }
})
</script>

<template>
  <div class="text-center py-6">
    <!-- Loading State -->
    <template v-if="status === 'loading'">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mx-auto mb-6">
        <svg
          class="animate-spin h-8 w-8 text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <h2 class="font-title-2 mb-2">Memverifikasi Email</h2>
      <p class="font-paragraph-3 text-secondary mb-6">
        {{ message }}
      </p>
    </template>

    <!-- Success State -->
    <template v-else-if="status === 'success'">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 mx-auto mb-6">
        <svg
          class="h-8 w-8 text-success-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 class="font-title-2 mb-2">Verifikasi Berhasil</h2>
      <p class="font-paragraph-3 text-secondary mb-6">
        {{ message }}
      </p>
    </template>

    <!-- Error State -->
    <template v-else-if="status === 'error'">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 mx-auto mb-6">
        <svg
          class="h-8 w-8 text-danger-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 class="font-title-2 mb-2">Verifikasi Gagal</h2>
      <p class="font-paragraph-3 text-secondary mb-6">
        {{ message }}
      </p>
      <div class="space-y-4">
        <NuxtLink
          to="/login"
          class="inline-block w-full py-2.5 px-4 text-center font-label-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Kembali ke Halaman Masuk
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
