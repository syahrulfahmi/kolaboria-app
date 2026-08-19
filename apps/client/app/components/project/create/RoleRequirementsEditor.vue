<script setup lang="ts">
import { computed } from 'vue'
import type { CreateProjectPayload, ProjectRoleInput } from '~/types/project'
import type { Tool } from '~/types/skill'

const form = defineModel<CreateProjectPayload>('form', { required: true })

const CUSTOM_ROLE_VALUE = 'custom_role'
type DropdownValue = string | number | (string | number)[] | null

const props = defineProps<{
  contributionRoles: {
    id: string
    name: string
    slug: string
    category?: string | null
  }[]
  tools: Tool[]
}>()

if (!form.value.roles) form.value.roles = []

const roleOptions = computed(() => [
  ...props.contributionRoles
    .filter((role) => role.slug !== 'other')
    .map((role) => ({ label: role.name, value: role.id })),
  { label: 'Lainnya', value: CUSTOM_ROLE_VALUE }
])

const toolOptions = computed(() =>
  props.tools.map((tool) => ({ label: tool.name, value: tool.id }))
)

const totalCapacity = computed(
  () =>
    form.value.roles?.reduce(
      (total, role) => total + Number(role.capacity || 0),
      0
    ) || 0
)

const isCustom = (role: ProjectRoleInput) => role.custom_title !== undefined

const selectedRoleValue = (role: ProjectRoleInput) =>
  role.contribution_role_id ??
  (role.custom_title !== undefined ? CUSTOM_ROLE_VALUE : undefined)

const selectedOwnerValue = () =>
  form.value.owner_contribution_role_id ??
  (form.value.owner_custom_role_title !== undefined
    ? CUSTOM_ROLE_VALUE
    : undefined)

const addRole = () => {
  form.value.roles?.push({ capacity: 1, tool_ids: [] })
}

const removeRole = (index: number) => {
  form.value.roles?.splice(index, 1)
}

const handleRoleSelect = (role: ProjectRoleInput, value: DropdownValue) => {
  if (value === CUSTOM_ROLE_VALUE) {
    role.contribution_role_id = undefined
    role.custom_title ??= ''
    return
  }

  if (typeof value === 'string') {
    role.contribution_role_id = value
    role.custom_title = undefined
    return
  }

  role.contribution_role_id = undefined
  role.custom_title = undefined
}

const handleOwnerSelect = (value: DropdownValue) => {
  if (value === CUSTOM_ROLE_VALUE) {
    form.value.owner_contribution_role_id = undefined
    form.value.owner_custom_role_title ??= ''
    return
  }

  if (typeof value === 'string') {
    form.value.owner_contribution_role_id = value
    form.value.owner_custom_role_title = undefined
    return
  }

  form.value.owner_contribution_role_id = undefined
  form.value.owner_custom_role_title = undefined
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h4 class="font-body-1">Peran yang Dibutuhkan</h4>
        <p class="mt-1 font-paragraph-2 text-secondary">
          Tentukan tanggung jawab, kapasitas, dan tools yang relevan untuk setiap peran.
        </p>
      </div>
      <AtomicButton type="button" variant="outline" @click="addRole">
        Tambah Role
      </AtomicButton>
    </div>

    <div
      v-for="(role, index) in form.roles"
      :key="role.id || `new-${index}`"
      class="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5"
    >
      <div class="flex items-center justify-between gap-3">
        <span class="font-label-1">Role {{ index + 1 }}</span>
        <AtomicButton
          v-if="form.roles.length > 1"
          type="button"
          variant="ghost-danger"
          class="text-danger-600"
          @click="removeRole(index)"
        >
          Hapus
        </AtomicButton>
      </div>

      <MoleculeDropdown
        :model-value="selectedRoleValue(role)"
        label="Role yang Dibutuhkan"
        placeholder="Pilih role..."
        :options="roleOptions"
        @update:model-value="(value) => handleRoleSelect(role, value)"
      />

      <MoleculeInputField
        v-if="isCustom(role)"
        v-model="role.custom_title"
        label="Nama Custom Role"
        placeholder="Contoh: Growth Hacker"
      />

      <MoleculeTextarea
        v-model="role.description"
        label="Deskripsi Tanggung Jawab"
        placeholder="Jelaskan scope dan kontribusi yang diharapkan."
        :rows="3"
      />

      <MoleculeInputField
        v-model.number="role.capacity"
        type="number"
        label="Jumlah Orang"
        min="1"
        max="20"
      />

      <MoleculeDropdown
        v-model="role.tool_ids"
        label="Tools untuk Role Ini (Opsional)"
        placeholder="Pilih tools yang relevan..."
        :options="toolOptions"
        searchable
        multiple
        :max="8"
        hint="Berbeda dari toolchain project: pilih tools yang relevan untuk kandidat pada role ini."
      />
    </div>

    <div class="rounded-2xl border border-neutral-200 p-5">
      <h4 class="font-body-1">Contribution Role Owner (Opsional)</h4>
      <p class="mt-1 mb-4 font-paragraph-2 text-secondary">
        Kosongkan jika cukup ditampilkan sebagai Project Owner.
      </p>
      <MoleculeDropdown
        :model-value="selectedOwnerValue()"
        label="Role Profesional Owner"
        placeholder="Pilih role owner..."
        :options="roleOptions"
        @update:model-value="handleOwnerSelect"
      />
      <MoleculeInputField
        v-if="form.owner_custom_role_title !== undefined"
        v-model="form.owner_custom_role_title"
        class="mt-4"
        label="Custom Role Owner"
        placeholder="Kosongkan untuk Project Owner"
      />
    </div>

    <div class="rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
      <p class="font-label-1 text-primary-800">Total Kebutuhan Kontributor</p>
      <p class="mt-1 font-title-3 text-primary-900">
        {{ totalCapacity }} orang
      </p>
      <p class="mt-1 font-paragraph-2 text-primary-700">
        Total dihitung otomatis dari jumlah orang pada setiap role.
      </p>
    </div>
  </div>
</template>
