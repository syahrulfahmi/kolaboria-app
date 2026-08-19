<script setup lang="ts">
import { computed } from 'vue'
import type { CreateProjectPayload, ProjectRoleInput } from '~/types/project'

const form = defineModel<CreateProjectPayload>('form', { required: true })

const props = defineProps<{
  skillTags: { id: string; name: string }[]
  contributionRoles: {
    id: string
    name: string
    slug: string
    category?: string | null
  }[]
}>()

if (!form.value.roles) form.value.roles = []

const roleOptions = computed(() => [
  ...props.contributionRoles
    .filter((role) => role.slug !== 'other')
    .map((role) => ({ label: role.name, value: role.id })),
  { label: 'Other (custom role)', value: '__custom__' }
])

const skillOptions = computed(() =>
  props.skillTags.map((skill) => ({ label: skill.name, value: skill.id }))
)

const isCustom = (role: ProjectRoleInput) => !role.contribution_role_id

const addRole = () => {
  form.value.roles?.push({ capacity: 1, skill_ids: [] })
}

const removeRole = (index: number) => {
  form.value.roles?.splice(index, 1)
}

const handleRoleSelect = (role: ProjectRoleInput) => {
  if (role.contribution_role_id === '__custom__') {
    role.contribution_role_id = undefined
    role.custom_title = ''
  } else {
    role.custom_title = undefined
  }
}

const handleOwnerSelect = () => {
  if (form.value.owner_contribution_role_id === '__custom__') {
    form.value.owner_contribution_role_id = undefined
    form.value.owner_custom_role_title = ''
  } else {
    form.value.owner_custom_role_title = undefined
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h4 class="font-body-1">Peran yang Dibutuhkan</h4>
        <p class="mt-1 font-paragraph-2 text-secondary">
          Tentukan tanggung jawab, kapasitas, dan skill untuk setiap peran.
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
        v-model="role.contribution_role_id"
        label="Contribution Role"
        placeholder="Pilih role..."
        :options="roleOptions"
        @update:model-value="handleRoleSelect(role)"
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
        v-model="role.skill_ids"
        label="Required Skills"
        placeholder="Pilih skill yang dibutuhkan..."
        :options="skillOptions"
        searchable
        multiple
        :max="8"
      />
    </div>

    <div class="rounded-2xl border border-neutral-200 p-5">
      <h4 class="font-body-1">Contribution Role Owner (Opsional)</h4>
      <p class="mt-1 mb-4 font-paragraph-2 text-secondary">
        Kosongkan jika cukup ditampilkan sebagai Project Owner.
      </p>
      <MoleculeDropdown
        v-model="form.owner_contribution_role_id"
        label="Role Profesional Owner"
        placeholder="Pilih role owner..."
        :options="roleOptions"
        @update:model-value="handleOwnerSelect"
      />
      <MoleculeInputField
        v-if="!form.owner_contribution_role_id"
        v-model="form.owner_custom_role_title"
        class="mt-4"
        label="Custom Role Owner"
        placeholder="Kosongkan untuk Project Owner"
      />
    </div>

    <MoleculeInputField
      v-model.number="form.max_slots"
      type="number"
      label="Ringkasan Slot Lama"
      hint="Nilai ini dipertahankan untuk kompatibilitas; capacity role adalah sumber utama."
      min="1"
      max="20"
    />
  </div>
</template>
