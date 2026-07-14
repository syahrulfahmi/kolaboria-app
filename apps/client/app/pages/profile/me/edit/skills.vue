<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserSkill, UserTool } from '~/types/profile'

const props = defineProps<{
  userSkills: UserSkill[]
  userTools: UserTool[]
}>()

const emit = defineEmits<{
  refresh: []
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

const isLoading = ref(false)
const selectedSkillId = ref<string | null>(null)
const selectedToolId = ref<string | null>(null)

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
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Gagal menyimpan',
      message: err.message || 'Terjadi kesalahan saat menyimpan perubahan.'
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
  if (!selectedToolId.value) return
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
  <div class="flex flex-col gap-6">
    <!-- SKILLS SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div class="mb-6">
        <p class="font-title-2 text-primary-700">Keahlian</p>
        <h2 class="mt-1 font-title-3">Keahlian Utama & Pendukung</h2>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div class="w-full">
          <MoleculeDropdown
            v-model="selectedSkillId"
            label="Tambah Keahlian"
            placeholder="Pilih keahlian"
            :options="skillOptions"
            :selected-values="userSkills.map((us) => us.skill_id)"
            searchable
            :loading="isLoadingSkills"
            :disabled="isLoading"
            @open="loadSkills"
          />
        </div>
        <AtomicButton
          type="button"
          variant="primary"
          class="w-full sm:w-auto shrink-0 mb-[2px]"
          :disabled="!selectedSkillId || isLoading"
          @click="handleAddSkill"
        >
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah
          </span>
        </AtomicButton>
      </div>

      <!-- Skills List Table -->
      <div
        v-if="userSkills.length > 0"
        class="mt-8 border border-neutral-200 rounded-2xl overflow-hidden"
      >
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200">
              <th class="px-6 py-4 font-label-1">Skill</th>
              <th class="px-6 py-4 font-label-1">Kategori</th>
              <th class="px-6 py-4 font-label-1">Jenis</th>
              <th class="px-6 py-4 font-label-1 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 bg-white">
            <tr
              v-for="skill in userSkills"
              :key="skill.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-body-1 text-secondary-900">
                {{ skill.skills?.name }}
              </td>
              <td class="px-6 py-4 font-body-1 text-secondary">
                {{ skill.skills?.category || '-' }}
              </td>
              <td class="px-6 py-4">
                <AtomicTag :variant="skill.is_primary ? 'primary' : 'default'">
                  {{ skill.is_primary ? 'Utama' : 'Tambahan' }}
                </AtomicTag>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-1.5">
                  <AtomicButton
                    v-if="!skill.is_primary"
                    variant="ghost-primary"
                    size="sm"
                    :disabled="isLoading"
                    @click="handleSetPrimarySkill(skill.id)"
                  >
                    Set Utama
                  </AtomicButton>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-all"
                    title="Hapus Skill"
                    :disabled="isLoading"
                    @click="handleRemoveSkill(skill.id)"
                  >
                    <svg
                      class="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="mt-8 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6"
      >
        <svg
          class="w-8 h-8 text-neutral-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <p class="font-body-1">Belum ada skill</p>
        <p class="font-paragraph-2 text-secondary mt-1">
          Tambahkan skill utama dan pendukung kamu untuk menarik minat
          kolaborator.
        </p>
      </div>
    </section>

    <!-- TOOLS SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div class="mb-6">
        <p class="font-title-1 text-primary-700">Tools</p>
        <h2 class="mt-1 font-title-3">Teknologi yang Dikuasai</h2>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div class="w-full">
          <MoleculeDropdown
            v-model="selectedToolId"
            label="Tambah Tool"
            placeholder="Pilih tool"
            :options="toolOptions"
            :selected-values="userTools.map((ut) => ut.tool_id)"
            searchable
            :loading="isLoadingTools"
            :disabled="isLoading"
            @open="loadTools"
          />
        </div>
        <AtomicButton
          type="button"
          variant="primary"
          class="w-full sm:w-auto shrink-0 mb-[2px]"
          :disabled="!selectedToolId || isLoading"
          @click="handleAddTool"
        >
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah
          </span>
        </AtomicButton>
      </div>

      <div v-if="userTools.length > 0" class="mt-6 flex flex-wrap gap-2">
        <AtomicTag
          v-for="tool in userTools"
          :key="tool.id"
          variant="default"
          class="pl-3 pr-2 py-1.5"
          closable
          @close="handleRemoveTool(tool.id)"
        >
          <span class="mr-1">{{ tool.tools?.name }}</span>
        </AtomicTag>
      </div>

      <div
        v-else
        class="mt-6 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6"
      >
        <svg
          class="w-8 h-8 text-neutral-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p class="font-body-1">Belum ada tool</p>
        <p class="font-paragraph-2 text-secondary mt-1">
          Tambahkan tools untuk melengkapi profil kamu.
        </p>
      </div>
    </section>
  </div>
</template>
