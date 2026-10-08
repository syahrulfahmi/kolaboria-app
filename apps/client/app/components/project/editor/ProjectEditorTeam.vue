<script setup lang="ts">
import { computed } from 'vue'
import { getProjectEditorCapacity } from '~/data/project-editor-validation'
import type {
  ProjectEditorCatalogKey,
  ProjectEditorCatalogStates,
  ProjectEditorDraft,
  ProjectEditorErrors,
  ProjectEditorReferences
} from '~/types/project-editor'

const props = defineProps<{
  references: ProjectEditorReferences
  catalogStates: ProjectEditorCatalogStates
  errors: ProjectEditorErrors
  disabled: boolean
}>()
const emit = defineEmits<{
  (event: 'add-role'): void
  (event: 'remove-role', clientKey: string): void
  (event: 'load-catalog', catalog: ProjectEditorCatalogKey): void
}>()
const draft = defineModel<ProjectEditorDraft>('form', { required: true })
const ownerRole = computed(() => draft.value.owner_contribution_role_id ?? null)
const ownerRoleOptions = computed(() => [
  { label: 'Tanpa peran profesional', value: '' },
  ...props.references.contribution_roles.map((role) => ({
    label: role.name,
    value: role.id
  }))
])
const catalogStatusItems: Array<{
  key: ProjectEditorCatalogKey
  name: string
}> = [
  { key: 'contribution_roles', name: 'nama role' },
  { key: 'skills', name: 'skill' },
  { key: 'tools', name: 'tools' }
]
const totalCapacity = computed(() =>
  getProjectEditorCapacity(draft.value.roles)
)
const selectOwnerRole = (
  value: string | number | (string | number)[] | null
) => {
  if (
    typeof value === 'string' &&
    props.references.contribution_roles.some((role) => role.id === value)
  ) {
    draft.value.owner_contribution_role_id = value
  } else {
    draft.value.owner_contribution_role_id = undefined
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

    <div v-for="catalog in catalogStatusItems" :key="catalog.key">
      <p
        v-if="catalogStates[catalog.key].loading"
        class="font-body-3 text-secondary"
        role="status"
        aria-live="polite"
      >
        Memuat daftar {{ catalog.name }}…
      </p>
      <div
        v-if="catalogStates[catalog.key].error"
        class="flex flex-wrap items-center gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3"
        role="alert"
      >
        <p class="font-body-3 text-danger-700">
          {{ catalogStates[catalog.key].error }}
        </p>
        <AtomicButton
          type="button"
          variant="outline"
          size="sm"
          :disabled="catalogStates[catalog.key].loading"
          @click="emit('load-catalog', catalog.key)"
        >
          Coba lagi
        </AtomicButton>
      </div>
    </div>

    <div class="space-y-4">
      <ProjectEditorRoleCard
        v-for="(role, index) in draft.roles"
        :key="role.client_key"
        v-model:form="draft"
        :role="role"
        :index="index"
        :total-roles="draft.roles.length"
        :catalog-states="catalogStates"
        :references="references"
        :errors="errors"
        :disabled="disabled"
        @remove="(clientKey) => emit('remove-role', clientKey)"
        @load-catalog="(catalog) => emit('load-catalog', catalog)"
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
        searchable
        @open="emit('load-catalog', 'contribution_roles')"
        @update:model-value="selectOwnerRole"
      />
    </section>
  </section>
</template>
