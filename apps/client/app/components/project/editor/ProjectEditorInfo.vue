<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { PROJECT_CATEGORY_OPTIONS } from '~/constants/projectCategory'
import type {
  ProjectEditorDraft,
  ProjectCreationMode,
  ProjectEditorCreationContext,
  ProjectEditorErrors,
  ProjectEditorMode
} from '~/types/project-editor'
import { sanitizeSlug } from '~/utils/slug'

const props = defineProps<{
  mode: ProjectEditorMode
  errors: ProjectEditorErrors
  disabled: boolean
  creationContext?: ProjectEditorCreationContext
}>()
const emit = defineEmits<{
  (event: 'change-creation-mode', mode: ProjectCreationMode): void
  (event: 'change-organization', id: string): void
}>()
const eligibleOrganizations = computed(() =>
  props.creationContext?.system_role === 'admin'
    ? props.creationContext.initiable_organizations
    : []
)
const organizationOptions = computed(() =>
  eligibleOrganizations.value.map(({ id, name }) => ({
    value: id,
    label: name
  }))
)
const canChooseOrganization = computed(
  () =>
    props.mode === 'create' &&
    props.creationContext?.system_role === 'admin' &&
    organizationOptions.value.length > 0
)
const selectedOrganization = computed(() =>
  eligibleOrganizations.value.find(
    (organization) => organization.id === draft.value.initiator_organization_id
  )
)
const changeOrganization = (
  value: string | number | (string | number)[] | null
) => {
  if (
    !props.disabled &&
    canChooseOrganization.value &&
    typeof value === 'string' &&
    eligibleOrganizations.value.some(
      (organization) => organization.id === value
    )
  )
    emit('change-organization', value)
}
const isOrganization = computed(
  () => draft.value.creation_mode === 'organization_initiated'
)
const changeCreationMode = (value: string | number | boolean) => {
  if (
    props.mode !== 'create' ||
    (value === 'organization_initiated' && !canChooseOrganization.value)
  )
    return
  if (
    !props.disabled &&
    (value === 'personal' || value === 'organization_initiated')
  )
    emit('change-creation-mode', value)
}
const draft = defineModel<ProjectEditorDraft>('form', { required: true })
const isSlugCustomized = ref(false)

const categories = [...PROJECT_CATEGORY_OPTIONS]

watch(
  () => draft.value.title,
  (title) => {
    if (!isSlugCustomized.value) {
      draft.value.slug = sanitizeSlug(title)
    }
  }
)

const onSlugInput = (value: string) => {
  isSlugCustomized.value = true
  draft.value.slug = sanitizeSlug(value)
}
</script>

<template>
  <section aria-labelledby="project-info-title" class="space-y-6 p-4 lg:p-5">
    <header>
      <span class="font-label-2 text-brand">Langkah 1 dari 5</span>
      <h2 id="project-info-title" class="mt-2 font-title-1 text-primary">
        Informasi Dasar
      </h2>
      <p class="mt-2 font-paragraph-3 text-secondary">
        Ceritakan proyek yang ingin kamu bangun dan masalah yang ingin
        diselesaikan bersama.
      </p>
    </header>

    <fieldset v-if="canChooseOrganization" class="space-y-3">
      <legend class="font-label-1 text-primary">
        Proyek ini dibuat atas nama siapa?
      </legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <AtomicRadio
          name="project-creation-mode"
          value="personal"
          :model-value="draft.creation_mode"
          label="Pribadi"
          description="Kamu menjadi owner dan memimpin proyek sebagai Project Lead."
          :disabled="disabled"
          @update:model-value="changeCreationMode"
        />
        <AtomicRadio
          name="project-creation-mode"
          value="organization_initiated"
          :model-value="draft.creation_mode"
          label="Organisasi"
          description="Inisiasi proyek untuk mencari Project Lead, tanpa menjadi owner."
          :disabled="disabled"
          @update:model-value="changeCreationMode"
        />
      </div>
      <MoleculeDropdown
        v-if="isOrganization"
        label="Organisasi yang menginisiasi"
        :model-value="draft.initiator_organization_id"
        :options="organizationOptions"
        :disabled="disabled"
        :error="errors.initiator_organization_id"
        searchable
        required
        @update:model-value="changeOrganization"
      />
      <p class="font-body-3 text-secondary">
        {{
          isOrganization
            ? `Diinisiasi oleh ${selectedOrganization?.name ?? 'organisasi yang dipilih'}. Proyek belum memiliki Project Lead dan belum menerima kontributor.`
            : 'Proyek personalmu mengikuti flow biasa. Kamu langsung menjadi Project Lead.'
        }}
      </p>
      <p
        v-if="errors.creation_mode"
        class="font-body-3 text-danger-700"
        role="alert"
      >
        {{ errors.creation_mode }}
      </p>
    </fieldset>

    <MoleculeTicker
      variant="info"
      title="Ceritakan proyek, bukan lowongan"
      message="Fokus pada masalah, tujuan, dan hasil yang ingin dibangun bersama."
      :closable="false"
    />

    <div class="space-y-5 bg-white rounded-lg">
      <MoleculeInputField
        id="project-editor-title"
        v-model="draft.title"
        label="Judul proyek"
        placeholder="Contoh: Platform Portofolio untuk Talenta Digital"
        :maxlength="80"
        :error="errors.title"
        :disabled="disabled"
        required
      />

      <div v-if="mode === 'edit'" class="flex flex-col gap-1.5">
        <MoleculeInputField
          id="project-editor-slug"
          :model-value="draft.slug"
          @update:model-value="onSlugInput"
          label="Slug URL Proyek"
          placeholder="platform-edukasi-daerah"
          hint="Hanya huruf kecil, angka, dan tanda hubung (-)."
          :error="errors.slug"
          :disabled="disabled"
          required
        />
        <span class="font-label-2 text-secondary">
          URL proyek:
          <span class="break-all text-primary"
            >kolaboria.com/projects/{{ draft.slug || sanitizeSlug(draft.title) || 'slug-proyek' }}</span
          >
        </span>
      </div>

      <MoleculeTextarea
        id="project-editor-summary"
        v-model="draft.summary"
        label="Ringkasan"
        placeholder="Jelaskan secara singkat apa yang ingin dibangun."
        :max-length="180"
        :error="errors.summary"
        :disabled="disabled"
        :rows="3"
        required
      />

      <MoleculeTextarea
        id="project-editor-description"
        v-model="draft.description"
        label="Deskripsi proyek"
        placeholder="Ceritakan latar belakang, masalah, target pengguna, dan hasil yang ingin dicapai..."
        :error="errors.description"
        :disabled="disabled"
        :rows="4"
        required
      />

      <MoleculeDropdown
        v-model="draft.project_category"
        label="Tipe Proyek"
        :options="categories"
        :error="errors.project_category"
        :disabled="disabled"
        searchable
        required
      />
    </div>
  </section>
</template>
