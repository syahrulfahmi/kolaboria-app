<script setup lang="ts">
import { z } from 'zod'

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword']
  })

type FieldErrors = Partial<Record<'password' | 'confirmPassword', string>>

const router = useRouter()
const { resetPassword } = useAuth()
const { add: addToast } = useToast()

const form = ref({ password: '', confirmPassword: '' })
const fieldErrors = ref<FieldErrors>({})
const authError = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const route = useRoute()
const client = useSupabaseClient()

const handleResetPassword = async () => {
  fieldErrors.value = {}
  authError.value = ''

  const result = resetSchema.safeParse({
    password: form.value.password,
    confirmPassword: form.value.confirmPassword
  })

  if (!result.success) {
    const flat = z.flattenError(result.error).fieldErrors
    fieldErrors.value = {
      password: flat.password?.[0],
      confirmPassword: flat.confirmPassword?.[0]
    }
    return
  }

  const tokenHash = route.query.token_hash as string

  isLoading.value = true
  try {
    // 1. Verifikasi token terlebih dahulu (ini akan meng-consume token dan memberikan sesi login)
    const { error: verifyError } = await client.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery'
    })
    
    if (verifyError) {
      throw new Error('Token tidak valid atau sudah kedaluwarsa. Silakan minta link reset baru.')
    }

    // 2. Jika token valid dan sesi didapat, perbarui password user
    await resetPassword(result.data.password)
    
    isSuccess.value = true
    addToast({
      variant: 'success',
      title: 'Password Berhasil Diubah',
      message: 'Silakan masuk menggunakan password baru Anda.',
      duration: 6000
    })
    setTimeout(() => router.push('/login'), 2000)
  } catch (err: any) {
    authError.value = err?.message || 'Gagal mengubah password. Link mungkin sudah kedaluwarsa.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <!-- ── Success State ──────────────────────────────────────────────── -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
    >
      <div
        v-if="isSuccess"
        class="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-success-100"
        >
          <svg class="h-8 w-8 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="text-title font-bold text-secondary-900">Password Berhasil Diubah!</p>
          <p class="mt-1 text-body text-neutral-500">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    </Transition>

    <!-- ── Form ──────────────────────────────────────────────────────── -->
    <template v-if="!isSuccess">
      <!-- Error Banner -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <MoleculeTicker
          v-if="authError"
          variant="danger"
          title="Gagal Mengubah Password"
          :message="authError"
          class="mb-5"
          @close="authError = ''"
        />
      </Transition>

      <form class="space-y-4" @submit.prevent="handleResetPassword">
        <!-- Password Baru -->
        <MoleculeInputField
          v-model="form.password"
          label="Password Baru"
          type="password"
          placeholder="Minimal 8 karakter"
          :error="fieldErrors.password"
          autocomplete="new-password"
        />

        <!-- Konfirmasi Password -->
        <MoleculeInputField
          v-model="form.confirmPassword"
          label="Konfirmasi Password Baru"
          type="password"
          placeholder="Ulangi password baru kamu"
          :error="fieldErrors.confirmPassword"
          autocomplete="new-password"
        />

        <!-- Submit -->
        <AtomicButton
          type="submit"
          variant="primary"
          :loading="isLoading"
          block
          class="mt-2"
        >
          Perbarui Password
        </AtomicButton>
      </form>

      <div class="mt-6 text-center text-body text-gray-600">
        Kembali ke
        <NuxtLink to="/login" class="text-primary-600 hover:text-primary-700">
          halaman masuk
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
