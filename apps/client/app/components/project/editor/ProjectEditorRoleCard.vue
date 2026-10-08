<script setup lang="ts">
import { computed, ref } from 'vue'
import { addProjectEditorTag } from '~/data/project-editor-validation'
import type {
  ProjectEditorDraft,
  ProjectEditorErrors,
  ProjectEditorReferences,
  ProjectEditorRole,
  ProjectEditorRoleOption
} from '~/types/project-editor'

const props = defineProps<{
  role: ProjectEditorRole
  index: number
  totalRoles: number
  contributionRoles: ProjectEditorRoleOption[]
  references: ProjectEditorReferences
  errors: ProjectEditorErrors
  disabled: boolean
}>()
const emit = defineEmits<{
  (event: 'remove', clientKey: string): void
}>()
const skillEntry = ref('')
const owner = defineModel<ProjectEditorDraft>('form', { required: true })
const customValue = 'custom-role'

const toolOptions = computed(() =>
  props.references.tools.map((tool) => ({ label: tool.name, value: tool.id }))
)
const roleName = computed(
  () =>
    props.role.custom_title ??
    props.contributionRoles.find(
      (item) => item.id === props.role.contribution_role_id
    )?.name ??
    ''
)
const capacityOptions = computed(() => {
  const minimumCapacity = Math.min(20, Math.max(1, props.role.filled_capacity))
  return Array.from({ length: 21 - minimumCapacity }, (_, index) => ({
    label: String(minimumCapacity + index),
    value: minimumCapacity + index
  }))
})
const errorFor = (field: string) =>
  props.errors['roles.' + props.role.client_key + '.' + field]

const updateRoleName = (value: string) => {
  const normalizedValue = value.trim().toLocaleLowerCase('id-ID')
  const matchedRole = props.contributionRoles.find(
    (item) => item.name.toLocaleLowerCase('id-ID') === normalizedValue
  )
  props.role.contribution_role_id = matchedRole?.id
  props.role.custom_title = matchedRole ? undefined : value
}

const updateCapacity = (
  value: string | number | (string | number)[] | null
) => {
  if (typeof value === 'string' || typeof value === 'number') {
    props.role.capacity = Number(value)
  }
}

const selectOwnerRole = (
  value: string | number | (string | number)[] | null
) => {
  if (value === customValue) {
    owner.value.owner_contribution_role_id = undefined
    owner.value.owner_custom_role_title ??= ''
  } else if (typeof value === 'string') {
    owner.value.owner_contribution_role_id = value
    owner.value.owner_custom_role_title = undefined
  } else {
    owner.value.owner_contribution_role_id = undefined
    owner.value.owner_custom_role_title = undefined
  }
}

const addSkill = () => {
  const next = addProjectEditorTag(props.role.skill_tags, skillEntry.value)
  if (next.length !== props.role.skill_tags.length) props.role.skill_tags = next
  skillEntry.value = ''
}
</script>

<template>
  <article
    class="overflow-hidden rounded-xl border border-neutral-200 bg-white"
    :aria-labelledby="'editor-role-title-' + role.client_key"
  >
    <header
      class="flex min-h-[4rem] items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:px-5"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div class="min-w-0">
          <h3
            :id="'editor-role-title-' + role.client_key"
            class="truncate font-label-1 text-primary"
          >
            {{ roleName || 'Role ' + (index + 1) }}
          </h3>
          <p class="mt-1 font-body-3 text-secondary">
            Kebutuhan role #{{ index + 1 }}
          </p>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2 sm:gap-3">
        <span
          class="whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-1 font-label-3 text-primary-700"
        >
          {{ role.capacity }} posisi
          <span v-if="role.filled_capacity > 0" class="text-secondary">
            · {{ role.filled_capacity }} terisi
          </span>
        </span>
        <AtomicIconButton
          type="button"
          variant="outline"
          size="sm"
          shape="square"
          class="focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          :title="
            'Hapus peran ' +
            (role.custom_title ||
              contributionRoles.find(
                (item) => item.id === role.contribution_role_id
              )?.name ||
              index + 1)
          "
          :aria-label="
            'Hapus peran ' +
            (role.custom_title ||
              contributionRoles.find(
                (item) => item.id === role.contribution_role_id
              )?.name ||
              index + 1)
          "
          :disabled="disabled || totalRoles <= 1 || role.filled_capacity > 0"
          @click="emit('remove', role.client_key)"
        >
          <Icon name="lucide:x" aria-hidden="true" />
        </AtomicIconButton>
      </div>
    </header>

    <div class="space-y-5 p-4 sm:p-5">
      <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_6.25rem]">
        <MoleculeInputField
          :id="'role-name-' + role.client_key"
          :model-value="roleName"
          @update:model-value="updateRoleName"
          label="Nama Role"
          placeholder="Contoh: Frontend Developer"
          :error="errorFor('contribution_role_id')"
          :disabled="disabled || role.filled_capacity > 0"
          hint="Gunakan nama posisi yang mudah dipahami talent."
          required
        />
        <MoleculeDropdown
          :model-value="role.capacity"
          @update:model-value="updateCapacity"
          label="Jumlah"
          :options="capacityOptions"
          :error="errorFor('capacity')"
          :disabled="disabled"
          required
        />
      </div>

      <MoleculeTextarea
        :id="'role-description-' + role.client_key"
        v-model="role.description"
        label="Peran & Kontribusi"
        placeholder="Contoh: Merancang REST API, business logic, struktur database, dan integrasi autentikasi..."
        :rows="4"
        :error="errorFor('description')"
        :disabled="disabled"
        hint="Jelaskan apa yang akan dikerjakan dan area tanggung jawab role ini selama proyek."
        required
      />

      <div class="space-y-2">
        <MoleculeInputField
          :id="'role-skill-' + role.client_key"
          v-model="skillEntry"
          label="Skill yang Dibutuhkan"
          placeholder="Contoh: Go, PostgreSQL, REST API..."
          hint="Tekan Enter untuk menambahkan skill."
          :error="errorFor('skill_tags')"
          :disabled="disabled"
          required
          @keydown.enter.prevent="addSkill"
        />
        <div
          v-if="role.skill_tags.length"
          class="flex flex-wrap gap-2"
          aria-label="Keahlian terpilih"
        >
          <AtomicTag
            v-for="skill in role.skill_tags"
            :key="skill.toLocaleLowerCase('id-ID')"
            variant="primary"
            :label="skill"
            closable
            :close-label="'Hapus keahlian ' + skill"
            @close="
              role.skill_tags = role.skill_tags.filter((item) => item !== skill)
            "
          />
        </div>
      </div>

      <MoleculeDropdown
        v-model="role.tool_ids"
        label="Tools untuk role ini"
        placeholder="Cari tools yang relevan"
        :options="toolOptions"
        :error="errorFor('tool_ids')"
        :disabled="disabled"
        searchable
        multiple
        :max="8"
        hint="Pilih tools yang relevan bagi calon kontributor."
      />
    </div>
  </article>
</template>
