<script setup lang="ts">
import { z } from 'zod'

// ── Zod Schema ──────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Nama lengkap minimal 2 karakter')
      .max(100, 'Nama lengkap maksimal 100 karakter'),
    email: z
      .email('Format email tidak valid')
      .refine((value) => value.trim().length > 0, 'Email harus diisi'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword']
  })

type FieldErrors = Partial<Record<keyof z.infer<typeof registerSchema>, string>>

// ── State ────────────────────────────────────────────────────────────────────
const router = useRouter()
const { register } = useAuth()
const { add: addToast } = useToast()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const fieldErrors = ref<FieldErrors>({})
const authError = ref('')
const isLoading = ref(false)

// ── Handlers ─────────────────────────────────────────────────────────────────
const handleRegister = async () => {
  // Reset errors
  fieldErrors.value = {}
  authError.value = ''

  // Validate with Zod
  const result = registerSchema.safeParse({
    fullName: form.value.fullName,
    email: form.value.email,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword
  })

  if (!result.success) {
    const flat = z.flattenError(result.error).fieldErrors
    fieldErrors.value = {
      fullName: flat.fullName?.[0],
      email: flat.email?.[0],
      password: flat.password?.[0],
      confirmPassword: flat.confirmPassword?.[0]
    }
    return
  }

  // Submit
  isLoading.value = true
  try {
    const data = await register(
      result.data.email,
      result.data.password,
      result.data.fullName
    )
    
    if (data?.session) {
      addToast({
        variant: 'success',
        title: 'Pendaftaran Berhasil',
        message: 'Selamat datang! Silakan lengkapi profil Anda.'
      })
      router.push('/after-register')
    } else {
      addToast({
        variant: 'info',
        title: 'Verifikasi Email',
        message: 'Silakan cek kotak masuk email Anda untuk verifikasi akun sebelum login.',
        duration: 8000
      })
      router.push('/login')
    }
  } catch (err: any) {
    authError.value = err?.message || 'Gagal mendaftar. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
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
        title="Gagal Mendaftar"
        :message="authError"
        class="mb-5"
        @close="authError = ''"
      />
    </Transition>

    <!-- ── Register Form ───────────────────────────────────────────────────── -->
    <form class="space-y-4" @submit.prevent="handleRegister">
      <!-- Full Name -->
      <MoleculeInputField
        v-model="form.fullName"
        label="Nama Lengkap"
        type="text"
        placeholder="Masukkan nama lengkap kamu"
        :error="fieldErrors.fullName"
        autocomplete="name"
      />

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
        placeholder="Minimal 8 karakter"
        :error="fieldErrors.password"
        autocomplete="new-password"
      />

      <!-- Confirm Password -->
      <MoleculeInputField
        v-model="form.confirmPassword"
        label="Konfirmasi Password"
        type="password"
        placeholder="Ulangi password kamu"
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
        Daftar
      </AtomicButton>
    </form>
  </div>
</template>
