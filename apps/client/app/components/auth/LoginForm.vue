<script setup lang="ts">
import { z } from 'zod'

// ── Zod Schema ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .email('Format email tidak valid')
    .refine((value) => value.trim().length > 0, 'Email harus diisi'),
  password: z.string().min(8, 'Password minimal 8 karakter')
})

type FieldErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>

// ── State ────────────────────────────────────────────────────────────────────
const router = useRouter()
const { login, forgotPassword } = useAuth()
const { add: addToast } = useToast()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const fieldErrors = ref<FieldErrors>({})
const authError = ref('')
const isLoading = ref(false)

// Forgot Password Modal
const showForgotModal = ref(false)
const forgotEmail = ref('')
const forgotEmailError = ref('')
const isSendingReset = ref(false)

// ── Handlers ─────────────────────────────────────────────────────────────────
const handleLogin = async () => {
  // Reset errors
  fieldErrors.value = {}
  authError.value = ''

  // Validate with Zod
  const result = loginSchema.safeParse({
    email: form.value.email,
    password: form.value.password
  })

  if (!result.success) {
    const flat = z.flattenError(result.error).fieldErrors
    fieldErrors.value = {
      email: flat.email?.[0],
      password: flat.password?.[0]
    }
    return
  }

  // Submit
  isLoading.value = true
  try {
    await login(result.data.email, result.data.password)
    router.push('/home')
  } catch (err: any) {
    authError.value = err?.message || 'Email atau password salah. Coba lagi.'
  } finally {
    isLoading.value = false
  }
}

const forgotPasswordSchema = z.object({
  email: z
    .email('Format email tidak valid')
    .refine((value) => value.trim().length > 0, 'Email harus diisi')
})

const handleForgotPassword = async () => {
  forgotEmailError.value = ''

  const result = forgotPasswordSchema.safeParse({ email: forgotEmail.value })
  if (!result.success) {
    forgotEmailError.value = result.error.flatten().fieldErrors.email?.[0] ?? ''
    return
  }

  isSendingReset.value = true
  try {
    await forgotPassword(result.data.email)
    showForgotModal.value = false
    forgotEmail.value = ''
    addToast({
      variant: 'success',
      title: 'Email Terkirim',
      message: 'Link reset password telah dikirim. Silakan cek kotak masuk email kamu.',
      duration: 6000
    })
  } catch (err: any) {
    forgotEmailError.value = err?.message || 'Gagal mengirim link reset. Coba lagi.'
  } finally {
    isSendingReset.value = false
  }
}

const closeForgotModal = () => {
  showForgotModal.value = false
  forgotEmail.value = ''
  forgotEmailError.value = ''
}
</script>

<template>
  <div>
    <!-- ── Auth Error Banner ───────────────────────────────────────────────── -->
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
        title="Gagal Masuk"
        :message="authError"
        class="mb-5"
        @close="authError = ''"
      />
    </Transition>

    <!-- ── Login Form ──────────────────────────────────────────────────────── -->
    <form class="space-y-4" @submit.prevent="handleLogin">
      <!-- Email -->
      <MoleculeInputField
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="name@example.com"
        :error="fieldErrors.email"
        autocomplete="email"
      />

      <!-- Password -->
      <MoleculeInputField
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Masukkan password kamu"
        :error="fieldErrors.password"
        autocomplete="current-password"
      />

      <!-- Remember Me + Forgot Password -->
      <div class="flex items-center justify-between gap-4 pt-1">
        <AtomicCheckbox v-model="form.rememberMe" label="Ingat saya" />
        <AtomicButton
          variant="ghost-primary"
          class="py-0! px-0! hover:bg-white!"
          @click="showForgotModal = true"
        >
          Lupa password?
        </AtomicButton>
      </div>

      <!-- Submit -->
      <AtomicButton
        type="submit"
        variant="primary"
        :loading="isLoading"
        block
        class="mt-2"
      >
        Masuk
      </AtomicButton>
    </form>

    <!-- ── Forgot Password Modal ───────────────────────────────────────────── -->
    <ClientOnly>
      <OrganismModal
        v-model="showForgotModal"
        title="Reset Password"
        subtitle="Masukkan emailmu, kami akan kirimkan link untuk reset password."
        primary-label="Kirim Link Reset"
        secondary-label="Batal"
        :primary-loading="isSendingReset"
        :primary-disabled="isSendingReset"
        :persistent="isSendingReset"
        :show-close="!isSendingReset"
        @primary="handleForgotPassword"
        @secondary="closeForgotModal"
        @close="closeForgotModal"
      >
        <form
          id="forgot-password-form"
          class="pt-2"
          @submit.prevent="handleForgotPassword"
        >
          <MoleculeInputField
            v-model="forgotEmail"
            label="Alamat Email"
            type="email"
            placeholder="name@example.com"
            :error="forgotEmailError"
            autocomplete="email"
          />
        </form>
      </OrganismModal>
    </ClientOnly>
  </div>
</template>
