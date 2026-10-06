<script setup lang="ts">
import { getApiErrorMessage } from '../../../../utils/error'
import { ref, computed } from 'vue'
import type { UserSkill, UserTool } from '~/types/profile'

definePageMeta({
  homeNavbar: {
    variant: 'back-path',
    title: 'Skills & Tools',
    mainHorizontalPadding: 'none'
  }
})

const props = defineProps<{
  userSkills: UserSkill[]
  userTools: UserTool[]
  isLoadingData: boolean
  errorMessage: string | null
}>()

const emit = defineEmits<{
  refresh: []
  retryLoad: []
  'update:userSkills': [skills: UserSkill[]]
  'update:userTools': [tools: UserTool[]]
}>()

const router = useRouter()

const {
  skills: availableSkills,
  tools: availableTools,
  loadSkills,
  loadTools,
  isLoadingSkills,
  isLoadingTools,
  addSkill,
  removeSkill,
  setPrimarySkill,
  addUserTool,
  removeUserTool,
  getUserSkills,
  getUserTools
} = useSkill()
const { add: addToast } = useToast()
const { show: showPopup } = usePopup()

const isLoading = ref(false)
const skillCatalogError = ref<string | null>(null)
const toolCatalogError = ref<string | null>(null)
const selectedSkillId = ref<string | null>(null)
const selectedToolId = ref<string | null>(null)
const maxTools = 5

const loadSkillCatalog = async () => {
  skillCatalogError.value = null
  try {
    await loadSkills({ throwOnError: true })
  } catch (err: unknown) {
    skillCatalogError.value = getApiErrorMessage(
      err,
      'Daftar keahlian belum berhasil dimuat. Coba lagi.'
    )
  }
}

const loadToolCatalog = async () => {
  toolCatalogError.value = null
  try {
    await loadTools({ throwOnError: true })
  } catch (err: unknown) {
    toolCatalogError.value = getApiErrorMessage(
      err,
      'Daftar tools belum berhasil dimuat. Coba lagi.'
    )
  }
}

const skillOptions = computed(() =>
  availableSkills.value.map((skill) => {
    const isAlreadySelected = props.userSkills.some(
      (userSkill) => userSkill.skill_id === skill.id
    )
    return {
      label: skill.category
        ? `${skill.name} - ${skill.category}${isAlreadySelected ? ' (Dipilih)' : ''}`
        : `${skill.name}${isAlreadySelected ? ' (Dipilih)' : ''}`,
      value: skill.id
    }
  })
)

const toolOptions = computed(() =>
  availableTools.value.map((tool) => {
    const isAlreadySelected = props.userTools.some(
      (userTool) => userTool.tool_id === tool.id
    )
    return {
      label: tool.category
        ? `${tool.name} - ${tool.category}${isAlreadySelected ? ' (Dipilih)' : ''}`
        : `${tool.name}${isAlreadySelected ? ' (Dipilih)' : ''}`,
      value: tool.id
    }
  })
)

const runAction = async (
  successMessage: string,
  action: () => Promise<void>,
  type: 'skills' | 'tools'
) => {
  isLoading.value = true
  try {
    await action()

    // Ambil data yang berubah saja dan emit ke parent
    if (type === 'skills') {
      const updatedSkills = await getUserSkills()
      emit('update:userSkills', updatedSkills)
    } else {
      const updatedTools = await getUserTools()
      emit('update:userTools', updatedTools)
    }

    addToast({
      variant: 'success',
      title: 'Perubahan disimpan',
      message: successMessage
    })
  } catch (err: unknown) {
    addToast({
      variant: 'danger',
      title: 'Gagal menyimpan',
      message: getApiErrorMessage(
        err,
        'Terjadi kesalahan saat menyimpan perubahan.'
      )
    })
  } finally {
    isLoading.value = false
  }
}

const handleAddSkill = async () => {
  if (!selectedSkillId.value) return
  const skillId = selectedSkillId.value

  const isAlreadySelected = props.userSkills.some(
    (us) => us.skill_id === skillId
  )
  if (isAlreadySelected) {
    addToast({
      variant: 'warning',
      title: 'Skill sudah dipilih',
      message: 'Skill ini sudah ditambahkan sebelumnya.'
    })
    selectedSkillId.value = null
    return
  }

  await runAction(
    'Skill berhasil ditambahkan.',
    async () => {
      await addSkill(skillId, props.userSkills.length === 0)
    },
    'skills'
  )
  selectedSkillId.value = null
}

const handleRemoveSkill = async (userSkillId: string) => {
  await runAction(
    'Skill berhasil dihapus.',
    async () => {
      await removeSkill(userSkillId)
    },
    'skills'
  )
}

const confirmRemoveSkill = (skill: UserSkill) => {
  const skillName = skill.skills?.name
  const skillLabel = skillName ? `"${skillName}"` : 'ini'

  showPopup({
    title: 'Hapus keahlian?',
    description: `Keahlian <b>${skillLabel}</b> akan dihapus dari profilmu.`,
    type: 'danger',
    positiveLabel: 'Ya, hapus',
    negativeLabel: 'Batalkan',
    onPositive: () => handleRemoveSkill(skill.id)
  })
}

const handleSetPrimarySkill = async (userSkillId: string) => {
  await runAction(
    'Primary skill berhasil diperbarui.',
    async () => {
      await setPrimarySkill(userSkillId)
    },
    'skills'
  )
}

const handleAddTool = async () => {
  if (!selectedToolId.value || props.userTools.length >= maxTools) return
  const toolId = selectedToolId.value

  const isAlreadySelected = props.userTools.some((ut) => ut.tool_id === toolId)
  if (isAlreadySelected) {
    addToast({
      variant: 'warning',
      title: 'Tool sudah dipilih',
      message: 'Tool ini sudah ditambahkan sebelumnya.'
    })
    selectedToolId.value = null
    return
  }

  await runAction(
    'Tool berhasil ditambahkan.',
    async () => {
      await addUserTool(toolId)
    },
    'tools'
  )
  selectedToolId.value = null
}

const handleRemoveTool = async (userToolId: string) => {
  await runAction(
    'Tool berhasil dihapus.',
    async () => {
      await removeUserTool(userToolId)
    },
    'tools'
  )
}

const handleCancel = () => {
  router.push('/profile/me')
}

const handleDone = () => {
  router.push('/profile/me')
}

const isDirty = computed(() => false)
const isSaving = computed(() => isLoading.value)

defineExpose({
  isDirty,
  isSaving,
  handleSave: handleDone,
  handleCancel
})
</script>

<template>
  <div
    class="divide-y divide-neutral-200 rounded-lg lg:border lg:border-neutral-200 bg-white px-4"
  >
    <header class="hidden border-b border-neutral-200 py-6 lg:block">
      <h1 class="font-title-1">Skills &amp; Tools</h1>
      <p class="mt-2 max-w-3xl font-body-2 text-secondary">
        Tunjukkan kemampuan dan teknologi yang kamu kuasai agar project owner
        memahami kontribusi yang bisa kamu berikan.
      </p>
    </header>

    <section v-if="isLoadingData" class="py-6">
      <MoleculeLoading label="Memuat skills dan tools..." />
    </section>

    <section v-else-if="errorMessage" class="py-6" role="alert">
      <OrganismEmptyState
        title="Skills dan tools belum bisa dimuat"
        :description="errorMessage"
        icon="document"
        action="Coba lagi"
        @action="emit('retryLoad')"
      />
    </section>

    <template v-else>
    <section class="py-6">
      <header class="mb-5">
        <h2 class="font-title-3">Keahlian</h2>
        <p class="mt-1.5 font-body-3 text-secondary">
          Pilih kemampuan yang paling menggambarkan peranmu dan tentukan satu
          sebagai keahlian utama.
        </p>
      </header>

      <div class="flex items-end gap-2 sm:gap-3">
        <div class="min-w-0 flex-2">
          <MoleculeDropdown
            v-model="selectedSkillId"
            placeholder="Pilih keahlian"
            :options="skillOptions"
            :selected-values="userSkills.map((skill) => skill.skill_id)"
            searchable
            :loading="isLoadingSkills"
            :error="skillCatalogError || undefined"
            :disabled="isLoading"
            @open="loadSkillCatalog"
          />
        </div>
        <AtomicButton
          type="button"
          variant="primary"
          size="md"
          class="h-11 shrink-0 whitespace-nowrap"
          aria-label="Tambah keahlian"
          :disabled="!selectedSkillId || isLoading"
          @click="handleAddSkill"
        >
          <template #icon-left>
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </template>
          <span>Tambah</span>
        </AtomicButton>
      </div>

      <div
        v-if="skillCatalogError"
        class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2"
      >
        <button
          type="button"
          class="font-label-2 text-danger-700 underline underline-offset-2 disabled:opacity-60"
          :disabled="isLoadingSkills"
          aria-label="Coba muat ulang daftar keahlian"
          @click="loadSkillCatalog"
        >
          Coba lagi
        </button>
      </div>

      <ul
        v-if="userSkills.length"
        class="mt-4 grid gap-2 md:mt-5 md:block md:divide-y md:divide-neutral-100 md:overflow-hidden md:rounded-xl md:border md:border-neutral-200"
      >
        <li
          v-for="skill in userSkills"
          :key="skill.id"
          class="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-x-3 gap-y-2 rounded-xl border border-neutral-200 p-3.5 transition-colors hover:bg-neutral-50/60 md:grid-cols-[minmax(0,1fr)_7rem_10rem_2.5rem] md:gap-4 md:rounded-none md:border-0 md:px-4 md:py-3.5"
        >
          <div class="min-w-0">
            <p class="truncate font-label-1 text-neutral-900">
              {{ skill.skills?.name }}
            </p>
            <p class="mt-0.5 font-body-3 text-secondary">
              {{ skill.skills?.category || 'Keahlian profesional' }}
            </p>
          </div>

          <AtomicIconButton
            variant="ghost"
            size="md"
            class="col-start-2 row-start-1 justify-self-end text-neutral-400 hover:text-danger-600 hover:bg-danger-50 md:col-start-4"
            :aria-label="`Hapus keahlian ${skill.skills?.name || ''}`"
            title="Hapus keahlian"
            :disabled="isLoading"
            @click="confirmRemoveSkill(skill)"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </AtomicIconButton>

          <div
            class="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:justify-self-center"
          >
            <AtomicTag :variant="skill.is_primary ? 'primary' : 'default'">
              {{ skill.is_primary ? 'Utama' : 'Pendukung' }}
            </AtomicTag>
          </div>

          <div
            class="col-start-1 row-start-3 flex min-h-8 items-center md:col-start-3 md:row-start-1 md:justify-self-end"
          >
            <AtomicButton
              v-if="!skill.is_primary"
              variant="ghost-primary"
              size="sm"
              :disabled="isLoading"
              @click="handleSetPrimarySkill(skill.id)"
            >
              Jadikan utama
            </AtomicButton>
          </div>
        </li>
      </ul>

      <p v-else class="mt-4 font-body-2 text-secondary">
        Belum ada keahlian. Pilih skill untuk menambahkan keahlian utama dan
        pendukung.
      </p>

      <p class="mt-4 flex items-start gap-2 font-body-3 text-secondary">
        <svg
          class="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke-width="1.5" />
          <path
            stroke-linecap="round"
            stroke-width="1.5"
            d="M12 11v5m0-8h.01"
          />
        </svg>
        <span>
          Keahlian utama membantu project owner memahami fokus kontribusimu
          dengan cepat.
        </span>
      </p>
    </section>

    <section class="py-6">
      <header class="mb-5">
        <h2 class="font-title-3">Tools &amp; Teknologi</h2>
        <p class="mt-1.5 font-body-3 text-secondary">
          Teknologi, software, atau platform yang biasa kamu gunakan ketika
          mengerjakan project.
        </p>
      </header>

      <div class="flex items-end gap-2 sm:gap-3">
        <div class="min-w-0 flex-1">
          <MoleculeDropdown
            v-model="selectedToolId"
            placeholder="Pilih tool atau teknologi"
            :options="toolOptions"
            :selected-values="userTools.map((tool) => tool.tool_id)"
            searchable
            :loading="isLoadingTools"
            :error="toolCatalogError || undefined"
            :disabled="isLoading || userTools.length >= maxTools"
            @open="loadToolCatalog"
          />
        </div>
        <AtomicButton
          type="button"
          variant="primary"
          size="md"
          class="h-11 shrink-0 whitespace-nowrap"
          aria-label="Tambah tool"
          :disabled="
            !selectedToolId || isLoading || userTools.length >= maxTools
          "
          @click="handleAddTool"
        >
          <template #icon-left>
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </template>
          <span>Tambah</span>
        </AtomicButton>
      </div>

      <div
        v-if="toolCatalogError"
        class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2"
      >
        <button
          type="button"
          class="font-label-2 text-danger-700 underline underline-offset-2 disabled:opacity-60"
          :disabled="isLoadingTools"
          aria-label="Coba muat ulang daftar tools"
          @click="loadToolCatalog"
        >
          Coba lagi
        </button>
      </div>

      <p
        v-if="userTools.length >= maxTools"
        class="mt-2 font-body-3 text-secondary"
      >
        Maksimal {{ maxTools }} tools. Hapus satu tool untuk menambahkan yang
        lain.
      </p>

      <div v-if="userTools.length" class="mt-4 flex flex-wrap gap-2">
        <AtomicTag
          v-for="tool in userTools"
          :key="tool.id"
          variant="default"
          class="py-1.5 pl-3 pr-2"
          closable
          @close="handleRemoveTool(tool.id)"
        >
          <span class="mr-1">{{ tool.tools?.name }}</span>
        </AtomicTag>
      </div>

      <p v-else class="mt-4 font-body-2 text-secondary">
        Belum ada tools. Tambahkan teknologi yang biasa kamu gunakan.
      </p>
    </section>
    </template>
  </div>
</template>
