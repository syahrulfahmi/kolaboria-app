<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Reset Password - Kolaboria',
  meta: [
    {
      name: 'description',
      content: 'Buat password baru untuk akun Kolaboria kamu.'
    }
  ]
})

const route = useRoute()
const router = useRouter()
const { add: addToast } = useToast()

const status = ref<'ready' | 'error'>('ready')

onMounted(() => {
  const token = route.query.token as string | undefined

  if (!token) {
    status.value = 'error'
    addToast({
      variant: 'danger',
      title: 'Link Tidak Valid',
      message: 'Link reset password tidak valid atau tidak lengkap.',
      duration: 6000
    })
    return router.replace('/login')
  }
})
</script>

<template>
  <div>
    <!-- Header Text -->
    <p class="text-title text-primary-500 mb-2 uppercase tracking-wide">
      Keamanan Akun
    </p>
    <h2 class="text-heading font-black text-secondary-500 mb-2 tracking-tight">
      Buat Password Baru
    </h2>
    <p class="text-body text-secondary-300 mb-8">
      Masukkan password baru yang kuat untuk mengamankan akun Kolaboria kamu.
    </p>

    <!-- State: Ready (Show Form) -->
    <div v-if="status === 'ready'">
      <AuthResetPasswordForm />
    </div>

    <!-- State: Error -->
    <div v-else-if="status === 'error'" class="py-4">
      <MoleculeTicker
        variant="danger"
        title="Link Tidak Valid"
        message="Link reset password tidak valid atau sudah kedaluwarsa."
        class="mb-6"
        :closable="false"
      />
      <div class="text-center">
        <NuxtLink
          to="/login"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          Kembali ke Halaman Masuk
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
