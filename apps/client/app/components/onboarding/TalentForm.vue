<script setup lang="ts">
import { z } from 'zod'

// ── Constants ─────────────────────────────────────────────────────────────────
const EXPERIENCE_LEVELS = [
  { label: 'Beginner', value: 'Beginner', desc: '0–1 tahun' },
  { label: 'Intermediate', value: 'Intermediate', desc: '1–3 tahun' },
  { label: 'Advanced', value: 'Advanced', desc: '3–5 tahun' },
  { label: 'Expert', value: 'Expert', desc: '5+ tahun' }
]

const MAX_TOOLS = 3

// ── Zod Schema ──────────────────────────────────────────────────────────────
const onboardingSchema = z.object({
  primarySkillId: z.string().min(1, 'Pilih skill utama kamu'),
  experienceLevel: z.string().min(1, 'Pilih level pengalaman kamu'),
  toolIds: z.array(z.string()).max(MAX_TOOLS, `Maksimal ${MAX_TOOLS} tools`),
  externalLink: z
    .string()
    .url('Format URL tidak valid')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(300, 'Bio maksimal 300 karakter').optional(),
  goal: z.string().max(200, 'Goal maksimal 200 karakter').optional()
})

type FieldErrors = Partial<
  Record<keyof z.infer<typeof onboardingSchema>, string>
>

// ── State ─────────────────────────────────────────────────────────────────────
const router = useRouter()
const { submitOnboarding } = useProfile()
const {
  skills,
  tools,
  isLoadingSkills,
  isLoadingTools,
  loadSkills,
  loadTools
} = useSkill()
const { add: addToast } = useToast()

const form = ref({
  primarySkillId: '' as string | number | null,
  experienceLevel: '',
  toolIds: [] as string[],
  externalLink: '',
  bio: '',
  goal: ''
})

const fieldErrors = ref<FieldErrors>({})
const submitError = ref('')
const isLoading = ref(false)

// ── Methods ───────────────────────────────────────────────────────────────────
const skillOptions = computed(() => {
  return skills.value.map((skill) => ({
    label: skill.name,
    value: skill.id
  }))
})

const toolOptions = computed(() => {
  return tools.value.map((tool) => ({
    label: tool.name,
    value: tool.id
  }))
})

const handleSubmit = async () => {
  fieldErrors.value = {}
  submitError.value = ''

  const result = onboardingSchema.safeParse({
    primarySkillId: form.value.primarySkillId,
    experienceLevel: form.value.experienceLevel,
    toolIds: form.value.toolIds,
    externalLink: form.value.externalLink || '',
    bio: form.value.bio,
    goal: form.value.goal
  })

  if (!result.success) {
    const flat = z.flattenError(result.error).fieldErrors
    fieldErrors.value = {
      primarySkillId: flat.primarySkillId?.[0],
      experienceLevel: flat.experienceLevel?.[0],
      toolIds: flat.toolIds?.[0],
      externalLink: flat.externalLink?.[0],
      bio: flat.bio?.[0],
      goal: flat.goal?.[0]
    }
    return
  }

  isLoading.value = true
  try {
    await submitOnboarding({
      primarySkillId: result.data.primarySkillId,
      experienceLevel: result.data.experienceLevel,
      toolIds: result.data.toolIds,
      goal: result.data.goal ?? '',
      bio: result.data.bio ?? '',
      externalLink: result.data.externalLink ?? ''
    })

    addToast({
      variant: 'success',
      title: 'Profil Tersimpan!',
      message: 'Selamat bergabung di Kolaboria. Mari mulai berkolaborasi!'
    })

    router.push('/home')
  } catch (err: any) {
    submitError.value =
      err?.message || 'Gagal menyimpan profil. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
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
        v-if="submitError"
        variant="danger"
        title="Gagal Menyimpan"
        :message="submitError"
        class="mb-5"
        @close="submitError = ''"
      />
    </Transition>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Primary Skill -->
      <MoleculeDropdown
        v-model="form.primarySkillId"
        label="Skill Utama"
        placeholder="Pilih skill utama kamu"
        :options="skillOptions"
        required
        :error="fieldErrors.primarySkillId"
        :loading="isLoadingSkills"
        @open="loadSkills"
      />

      <!-- Experience Level -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-semibold tracking-wide uppercase text-neutral-500"
        >
          Level Pengalaman
          <span class="text-primary-400 text-base leading-none">*</span>
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="level in EXPERIENCE_LEVELS"
            :key="level.value"
            type="button"
            @click="form.experienceLevel = level.value"
            class="flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all duration-150 cursor-pointer"
            :class="
              form.experienceLevel === level.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-primary-50/50'
            "
          >
            <span class="text-sm font-semibold">{{ level.label }}</span>
            <span class="text-[10px] text-current opacity-70 mt-0.5">{{
              level.desc
            }}</span>
          </button>
        </div>
        <span
          v-if="fieldErrors.experienceLevel"
          class="text-caption text-red-500 flex items-center gap-1"
        >
          <svg
            class="h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
          {{ fieldErrors.experienceLevel }}
        </span>
      </div>

      <!-- Tools Multi-select -->
      <MoleculeDropdown
        v-model="form.toolIds"
        label="Tools"
        placeholder="Cari tools yang kamu gunakan..."
        multiple
        searchable
        :options="toolOptions"
        :max="MAX_TOOLS"
        :error="fieldErrors.toolIds"
        :loading="isLoadingTools"
        @open="loadTools"
      />

      <!-- Goal -->
      <MoleculeInputField
        v-model="form.goal"
        label="Goal (opsional)"
        type="text"
        placeholder="Apa yang ingin kamu capai di Kolaboria?"
        :error="fieldErrors.goal"
        hint="Cth: Mendapatkan pengalaman proyek nyata dan membangun portofolio"
      />

      <!-- External Link -->
      <MoleculeInputField
        v-model="form.externalLink"
        label="Tautan Eksternal (opsional)"
        type="url"
        placeholder="https://github.com/username"
        :error="fieldErrors.externalLink"
        hint="LinkedIn, GitHub, portofolio, dsb."
      />

      <!-- Bio -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-semibold tracking-wide uppercase text-neutral-500"
        >
          Bio
          <span class="normal-case font-normal text-neutral-400 ml-1"
            >(opsional)</span
          >
        </label>
        <div class="relative">
          <textarea
            v-model="form.bio"
            rows="3"
            maxlength="300"
            placeholder="Ceritakan sedikit tentang dirimu..."
            class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-body text-neutral-900 transition-all duration-150 focus:outline-none focus:border-primary-500 resize-none"
            :class="
              fieldErrors.bio ? 'border-red-300 focus:border-red-500' : ''
            "
          />
          <span
            class="absolute bottom-2.5 right-3 text-[10px] text-neutral-400"
          >
            {{ form.bio.length }}/300
          </span>
        </div>
        <span v-if="fieldErrors.bio" class="text-caption text-red-500">{{
          fieldErrors.bio
        }}</span>
      </div>

      <!-- Submit -->
      <AtomicButton
        type="submit"
        variant="primary"
        :loading="isLoading"
        block
        class="mt-2"
      >
        Mulai Berkolaborasi 🚀
      </AtomicButton>
    </form>
  </div>
</template>
