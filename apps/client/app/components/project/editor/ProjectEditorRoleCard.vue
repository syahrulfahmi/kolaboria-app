<script setup lang="ts">
import { computed } from 'vue'
import type {
  ProjectEditorCatalogKey,
  ProjectEditorCatalogStates,
  ProjectEditorErrors,
  ProjectEditorReferences,
  ProjectEditorRole
} from '~/types/project-editor'

const props = defineProps<{
  role: ProjectEditorRole
  index: number
  totalRoles: number
  catalogStates: ProjectEditorCatalogStates
  references: ProjectEditorReferences
  errors: ProjectEditorErrors
  disabled: boolean
}>()
const emit = defineEmits<{
  (event: 'remove', clientKey: string): void
  (event: 'load-catalog', catalog: ProjectEditorCatalogKey): void
}>()

const toolOptions = computed(() =>
  props.references.tools.map((tool) => ({ label: tool.name, value: tool.id }))
)
const skillOptions = computed(() =>
  props.references.skills.map((skill) => ({
    label: skill.name,
    value: skill.id
  }))
)
const roleName = computed(
  () =>
    props.references.contribution_roles.find(
      (item) => item.id === props.role.contribution_role_id
    )?.name ?? ''
)
const roleOptions = computed(() => props.references.contribution_roles.map((item) => ({
  label: item.name,
  value: item.id
})))
const capacityOptions = computed(() => {
  const minimumCapacity = Math.min(20, Math.max(1, props.role.filled_capacity))
  return Array.from({ length: 21 - minimumCapacity }, (_, index) => ({
    label: String(minimumCapacity + index),
    value: minimumCapacity + index
  }))
})
const errorFor = (field: string) =>
  props.errors['roles.' + props.role.client_key + '.' + field]

const selectRole = (value: string | number | (string | number)[] | null) => {
  if (
    typeof value === 'string' &&
    props.references.contribution_roles.some((item) => item.id === value)
  ) {
    props.role.contribution_role_id = value
  } else {
    props.role.contribution_role_id = undefined
  }
}

const updateCapacity = (
  value: string | number | (string | number)[] | null
) => {
  if (typeof value === 'string' || typeof value === 'number') {
    props.role.capacity = Number(value)
  }
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
            (references.contribution_roles.find(
                (item) => item.id === role.contribution_role_id
              )?.name ||
              index + 1)
          "
          :aria-label="
            'Hapus peran ' +
            (references.contribution_roles.find(
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
        <div class="space-y-4">
          <MoleculeDropdown
            :model-value="role.contribution_role_id ?? null"
            @update:model-value="selectRole"
            @open="emit('load-catalog', 'contribution_roles')"
            label="Nama Role"
            searchable
            placeholder="Pilih nama role"
            :options="roleOptions"
            :error="errorFor('contribution_role_id')"
            :disabled="disabled || role.filled_capacity > 0"
            hint="Gunakan nama posisi yang mudah dipahami talent."
            required
          />
        </div>
        <MoleculeDropdown
          :model-value="role.capacity"
          @update:model-value="updateCapacity"
          label="Jumlah"
          :options="capacityOptions"
          :error="errorFor('capacity')"
          :disabled="disabled"
          searchable
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
        hint="Jelaskan tanggung jawab role ini. Untuk daftar, tulis tiap poin di baris baru dengan - atau 1."
        required
      />

      <MoleculeDropdown
        v-model="role.skill_ids"
        label="Skill yang Dibutuhkan"
        placeholder="Cari dan pilih skill yang relevan"
        :options="skillOptions"
        :error="errorFor('skill_ids')"
        :disabled="disabled"
        searchable
        multiple
        required
        hint="Pilih skill yang relevan bagi calon kontributor."
        @open="emit('load-catalog', 'skills')"
      />

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
        @open="emit('load-catalog', 'tools')"
      />
    </div>
  </article>
</template>
