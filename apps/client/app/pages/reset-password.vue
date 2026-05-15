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
const client = useSupabaseClient()

const status = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')

const router = useRouter()
const { add: addToast } = useToast()

onMounted(async () => {
  // Use token_hash flow instead of PKCE code to avoid "PKCE code verifier not found"
  // error when opening the link in a different browser/device.
  const tokenHash = route.query.token_hash as string | undefined
  const type = route.query.type as string | undefined

  if (!tokenHash || type !== 'recovery') {
    addToast({
      variant: 'danger',
      title: 'Link Tidak Valid',
      message: 'Link reset password tidak valid atau tidak lengkap.',
      duration: 6000
    })
    return router.replace('/login')
  }

  try {
    const { error } = await client.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery'
    })
    if (error) throw error
    status.value = 'ready'
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Link Kedaluwarsa',
      message:
        err?.message ||
        'Gagal memverifikasi link. Link mungkin sudah kedaluwarsa atau sudah digunakan.',
      duration: 6000
    })
    console.log('error:', err?.message)
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

    <!-- State: Loading -->
    <div
      v-if="status === 'loading'"
      class="flex flex-col items-center justify-center py-8"
    >
      <MoleculeLoading type="section" label="Memverifikasi link reset..." />
    </div>

    <!-- State: Ready (Show Form) -->
    <div v-else-if="status === 'ready'">
      <AuthResetPasswordForm />
    </div>

    <!-- State: Error -->
    <div v-else-if="status === 'error'" class="py-4">
      <MoleculeTicker
        variant="danger"
        title="Link Tidak Valid"
        :message="errorMessage"
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
