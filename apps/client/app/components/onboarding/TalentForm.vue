<script setup lang="ts">
import { getApiErrorMessage } from '../../utils/error'
import { z } from 'zod'

// ── Constants and validation ────────────────────────────────────────────────
const EXPERIENCE_LEVEL_VALUES = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
] as const

const EXPERIENCE_LEVELS = [
  { value: EXPERIENCE_LEVEL_VALUES[0], desc: '0–1 tahun' },
  { value: EXPERIENCE_LEVEL_VALUES[1], desc: '1–3 tahun' },
  { value: EXPERIENCE_LEVEL_VALUES[2], desc: '3–5 tahun' },
  { value: EXPERIENCE_LEVEL_VALUES[3], desc: '5+ tahun' }
]

const MAX_TOOLS = 3

const onboardingFieldsSchema = z.object({
  primarySkillId: z.string().uuid('Pilih keahlian utama dari daftar'),
  experienceLevel: z.enum(EXPERIENCE_LEVEL_VALUES, {
    error: 'Pilih level pengalaman kamu'
  }),
  toolIds: z
    .array(z.string().uuid('Pilihan tools tidak valid'))
    .max(MAX_TOOLS, `Maksimal ${MAX_TOOLS} tools`)
    .refine((toolIds) => new Set(toolIds).size === toolIds.length, {
      message: 'Tools yang sama tidak boleh dipilih lebih dari sekali'
    }),
  externalLink: z
    .union([z.literal(''), z.string().url('Format URL tidak valid')]),
  bio: z.string().trim().max(300, 'Bio maksimal 300 karakter'),
  goal: z.string().trim().max(200, 'Goal maksimal 200 karakter')
})

type OnboardingForm = z.infer<typeof onboardingFieldsSchema>
type OnboardingField = keyof OnboardingForm
type FieldErrors = Partial<Record<OnboardingField, string>>

const ONBOARDING_FIELDS = [
  'primarySkillId',
  'experienceLevel',
  'toolIds',
  'externalLink',
  'bio',
  'goal'
] as const satisfies readonly OnboardingField[]

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
  primarySkillId: '',
  experienceLevel: '' as OnboardingForm['experienceLevel'] | '',
  toolIds: [] as string[],
  externalLink: '',
  bio: '',
  goal: ''
})

const fieldErrors = ref<FieldErrors>({})
const submitError = ref('')
const isLoading = ref(false)
const isLoadingMasterData = computed(
  () => isLoadingSkills.value || isLoadingTools.value
)

// ── Methods ───────────────────────────────────────────────────────────────────
const skillOptions = computed(() => {
  return skills.value.map(({ id, name }) => ({ label: name, value: id }))
})

const toolOptions = computed(() => {
  return tools.value.map(({ id, name }) => ({ label: name, value: id }))
})

const toFieldErrors = (error: z.ZodError<OnboardingForm>): FieldErrors => {
  const flattenedErrors = z.flattenError(error).fieldErrors
  const errors: FieldErrors = {}

  for (const field of ONBOARDING_FIELDS) {
    const message = flattenedErrors[field]?.[0]
    if (message) errors[field] = message
  }

  return errors
}

const validateSelections = (values: OnboardingForm): FieldErrors => {
  const errors: FieldErrors = {}
  const availableSkillIds = new Set(skills.value.map(({ id }) => id))
  const availableToolIds = new Set(tools.value.map(({ id }) => id))

  if (!availableSkillIds.has(values.primarySkillId)) {
    errors.primarySkillId = 'Pilih keahlian utama dari daftar yang tersedia'
  }

  if (values.toolIds.some((toolId) => !availableToolIds.has(toolId))) {
    errors.toolIds = 'Pilih tools dari daftar yang tersedia'
  }

  return errors
}

const handleSubmit = async (): Promise<void> => {
  fieldErrors.value = {}
  submitError.value = ''

  if (isLoadingMasterData.value) return

  const result = onboardingFieldsSchema.safeParse(form.value)

  if (!result.success) {
    fieldErrors.value = toFieldErrors(result.error)
    return
  }

  const selectionErrors = validateSelections(result.data)
  if (Object.keys(selectionErrors).length > 0) {
    fieldErrors.value = selectionErrors
    return
  }

  isLoading.value = true
  try {
    await submitOnboarding({
      primarySkillId: result.data.primarySkillId,
      experienceLevel: result.data.experienceLevel,
      toolIds: result.data.toolIds,
      goal: result.data.goal,
      bio: result.data.bio,
      externalLink: result.data.externalLink
    })

    addToast({
      variant: 'success',
      title: 'Profil Tersimpan!',
      message: 'Selamat bergabung di Kolaboria. Mari mulai berkolaborasi!'
    })

    await router.replace('/home')
  } catch (error: unknown) {
    submitError.value = getApiErrorMessage(error, 'Gagal menyimpan profil. Silakan coba lagi.')
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
        label="Keahlian Utama"
        placeholder="Pilih keahlian utama kamu"
        :options="skillOptions"
        required
        :error="fieldErrors.primarySkillId"
        :loading="isLoadingSkills"
        @open="loadSkills"
      />

      <!-- Experience Level -->
      <div class="flex flex-col gap-1.5">
        <label class="font-label-1">
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
            <span class="font-body-2 text-primary">{{ level.value }}</span>
            <span class="font-body-3 text-secondary mt-1">{{
              level.desc
            }}</span>
          </button>
        </div>
        <span
          v-if="fieldErrors.experienceLevel"
          class="font-body-3 text-red-500 flex items-center gap-1"
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
        label="Tools yang kamu kuasai"
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
      <MoleculeTextarea
        v-model="form.bio"
        label="Bio (opsional)"
        placeholder="Ceritakan sedikit tentang dirimu"
        :rows="3"
        max-length="300"
        show-counter
        :error="fieldErrors.bio"
      />

      <!-- Submit -->
      <AtomicButton
        type="submit"
        variant="primary"
        :loading="isLoading || isLoadingMasterData"
        block
        class="mt-2"
      >
        Mulai Berkolaborasi
      </AtomicButton>
    </form>
  </div>
</template>
