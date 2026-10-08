<script setup lang="ts">
import { computed } from 'vue'
import { getProjectEditorCapacity } from '~/data/project-editor-validation'
import type {
  ProjectEditorDraft,
  ProjectEditorErrors,
  ProjectEditorReferences
} from '~/types/project-editor'

const props = defineProps<{
  references: ProjectEditorReferences
  errors: ProjectEditorErrors
  disabled: boolean
}>()
const emit = defineEmits<{
  (event: 'add-role'): void
  (event: 'remove-role', clientKey: string): void
}>()
const draft = defineModel<ProjectEditorDraft>('form', { required: true })
const ownerRole = computed(
  () =>
    draft.value.owner_contribution_role_id ||
    (draft.value.owner_custom_role_title !== undefined ? 'custom-role' : null)
)
const ownerRoleOptions = computed(() => [
  ...props.references.contribution_roles.map((role) => ({
    label: role.name,
    value: role.id
  })),
  { label: 'Lainnya', value: 'custom-role' }
])
const toolOptions = computed(() =>
  props.references.tools.map((tool) => ({ label: tool.name, value: tool.id }))
)
const totalCapacity = computed(() =>
  getProjectEditorCapacity(draft.value.roles)
)
const selectOwnerRole = (
  value: string | number | (string | number)[] | null
) => {
  if (value === 'custom-role') {
    draft.value.owner_contribution_role_id = undefined
    draft.value.owner_custom_role_title ??= ''
  } else if (typeof value === 'string') {
    draft.value.owner_contribution_role_id = value
    draft.value.owner_custom_role_title = undefined
  } else {
    draft.value.owner_contribution_role_id = undefined
    draft.value.owner_custom_role_title = undefined
  }
}
</script>

<template>
  <section aria-labelledby="project-team-title" class="space-y-6 p-4 lg:p-5">
    <header>
      <span class="font-label-2 text-brand">Langkah 2 dari 5</span>
      <h2 id="project-team-title" class="mt-2 font-title-1 text-primary">
        Kebutuhan Tim
      </h2>
      <p class="mt-2 font-paragraph-3 text-secondary">
        Tentukan siapa yang dibutuhkan, tanggung jawabnya, dan kemampuan yang
        membantu mereka berkontribusi.
      </p>
    </header>

    <MoleculeTicker
      variant="info"
      title="Jelaskan kebutuhan per peran"
      message="Jumlah kontributor dihitung otomatis dari kapasitas tiap peran. Keahlian dan tools proyek memiliki tujuan yang berbeda."
      :closable="false"
    />

    <div class="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="font-label-1 text-primary-900">
            Tim yang sedang kamu susun
          </h3>
          <p class="mt-1 font-body-2 text-secondary">
            {{ draft.roles.length }} peran untuk {{ totalCapacity }} kontributor
          </p>
        </div>
        <span class="rounded-xl bg-white px-4 py-2 text-center">
          <strong class="font-title-2 text-primary">{{ totalCapacity }}</strong>
          <span class="ml-2 font-body-3 text-secondary">posisi</span>
        </span>
      </div>
      <p
        v-if="errors.capacity"
        class="mt-3 font-body-3 text-danger-700"
        role="alert"
      >
        {{ errors.capacity }}
      </p>
    </div>

    <div
      v-if="errors.roles"
      class="rounded-xl border border-danger-200 bg-danger-50 p-4"
      role="alert"
    >
      <p class="font-body-2 text-danger-700">{{ errors.roles }}</p>
    </div>

    <div class="space-y-4">
      <ProjectEditorRoleCard
        v-for="(role, index) in draft.roles"
        :key="role.client_key"
        v-model:form="draft"
        :role="role"
        :index="index"
        :total-roles="draft.roles.length"
        :contribution-roles="references.contribution_roles"
        :references="references"
        :errors="errors"
        :disabled="disabled"
        @remove="(clientKey) => emit('remove-role', clientKey)"
      />
    </div>

    <button
      type="button"
      class="flex min-h-9 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-primary-200 bg-white px-4 py-2 font-label-2 text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled || totalCapacity >= 20"
      @click="emit('add-role')"
    >
      <Icon name="lucide:plus" class="h-4 w-4" aria-hidden="true" />
      Tambah Role
    </button>

    <section
      class="space-y-4 border-t border-neutral-200 pt-6"
      aria-labelledby="project-tools-title"
    >
      <div>
        <h3 id="project-tools-title" class="font-title-3 text-primary">
          Tech stack proyek
        </h3>
        <p class="mt-1 font-paragraph-3 text-secondary">
          Teknologi yang dipakai bersama oleh tim. Kebutuhan khusus tiap peran
          diatur pada kartu peran.
        </p>
      </div>
      <MoleculeDropdown
        v-model="draft.tool_ids"
        label="Tools proyek"
        placeholder="Cari dan pilih teknologi atau tools"
        :options="toolOptions"
        :error="errors.tool_ids"
        :disabled="disabled"
        searchable
        multiple
        :max="12"
      />
    </section>

    <section
      v-if="draft.creation_mode === 'personal'"
      class="space-y-4 border-t border-neutral-200 pt-6"
      aria-labelledby="owner-role-title"
    >
      <div>
        <h3 id="owner-role-title" class="font-title-3 text-primary">
          Peran profesionalmu sebagai Project Lead
          <span class="font-body-3 text-secondary">(opsional)</span>
        </h3>
        <p class="mt-1 font-paragraph-3 text-secondary">
          Ini menjelaskan kontribusimu sendiri dan tidak menambah jumlah posisi
          kontributor.
        </p>
      </div>
      <MoleculeDropdown
        :model-value="ownerRole"
        label="Peranmu di proyek"
        placeholder="Pilih peran jika relevan"
        :options="ownerRoleOptions"
        :error="errors.owner_contribution_role_id"
        :disabled="disabled"
        @update:model-value="selectOwnerRole"
      />
      <MoleculeInputField
        v-if="draft.owner_custom_role_title !== undefined"
        v-model="draft.owner_custom_role_title"
        label="Nama peran khususmu"
        placeholder="Contoh: Product Lead"
        :disabled="disabled"
      />
    </section>
  </section>
</template>
