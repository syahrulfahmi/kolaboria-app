<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  createProjectEditorFixture,
  createProjectEditorReferences
} from '~/data/project-editor-fixtures'
import { useProjectEditor } from '~/composables/useProjectEditor'
import { validateProjectEditorStep } from '~/data/project-editor-validation'
import type { ProjectCreationMode, ProjectEditorMode, ProjectEditorCreationContext, ProjectEditorEligibility } from '~/types/project-editor'

const props = defineProps<{
  mode: ProjectEditorMode; slug?: string; accountId?: string
  creationContext?: ProjectEditorCreationContext; eligibility?: ProjectEditorEligibility
  contextAvailable?: boolean
}>()
const emit = defineEmits<{
  (event: 'dirty-change', dirty: boolean): void
  (event: 'submitting-change', submitting: boolean): void
}>()
const route = useRoute()
const router = useRouter()
const { currentUserId } = useAuth()
const references = createProjectEditorReferences()
const creationContext = computed<ProjectEditorCreationContext>(() => props.creationContext ?? { system_role: 'user', initiable_organizations: [] })
const stepLabels = [
  'Informasi Dasar',
  'Kebutuhan Tim',
  'Konteks Kolaborasi',
  'Waktu & Komitmen',
  'Review'
]
const fixture = computed(() =>
  props.mode === 'edit' ? createProjectEditorFixture(props.slug || '') : null
)
const editor = useProjectEditor({
  mode: props.mode,
  slug: props.slug,
  currentUserId: props.accountId || currentUserId.value || 'preview-user',
  references,
  initialRecord: fixture.value,
  get eligibility() { return props.eligibility ?? {
    email_verified: props.mode === 'edit', onboarding_completed: props.mode === 'edit'
  } },
  get creationContext() { return creationContext.value },
  contextAvailable: () => props.contextAvailable ?? props.mode === 'edit',
  storageScope: props.mode === 'create' ? 'account-context' : undefined
})
watch(editor.isDirty, value => emit('dirty-change', value), { immediate: true })
watch(editor.isSubmitting, value => emit('submitting-change', value), { immediate: true })
const isOrganization = computed(() => editor.draft.value.creation_mode === 'organization_initiated')
const completedSteps = computed(() =>
  [0, 1, 2, 3, 4].map(
    (step) =>
      Object.keys(
        validateProjectEditorStep(
          step as 0 | 1 | 2 | 3 | 4,
          editor.draft.value,
          references
        )
      ).length === 0
  )
)
const missingFixture = computed(
  () => props.mode === 'edit' && !fixture.value && !editor.record.value
)
const canContinue = computed(() => !editor.isSubmitting.value)
const { show: showPopup } = usePopup()
const { triggerCancel } = useFormGuard(() => editor.isDirty.value)
const changeCreationMode = (mode: ProjectCreationMode) => {
  if (mode === editor.draft.value.creation_mode || editor.isSubmitting.value) return
  const apply = () => { editor.setCreationMode(mode) }
  if (!editor.isDirty.value) return apply()
  showPopup({
    title: 'Ganti atas nama siapa proyek dibuat?',
    description: 'Setiap pilihan memiliki draft terpisah. Isian saat ini tetap tersedia jika kamu kembali ke pilihan ini selama halaman masih terbuka. Simpan draft sebelum meninggalkan halaman.',
    type: 'warning', positiveLabel: 'Ganti pilihan', negativeLabel: 'Kembali', onPositive: apply
  })
}

const changeOrganization = (id: string) => {
  if (id === editor.draft.value.initiator_organization_id || editor.isSubmitting.value) return
  if (!creationContext.value.initiable_organizations.some(organization => organization.id === id)) return
  const apply = () => { editor.selectOrganization(id) }
  if (!editor.isDirty.value) return apply()
  showPopup({
    title: 'Ganti organisasi?',
    description: 'Setiap organisasi memiliki draft terpisah. Isian saat ini tetap tersedia jika kamu kembali selama halaman masih terbuka. Simpan draft sebelum meninggalkan halaman.',
    type: 'warning', positiveLabel: 'Ganti organisasi', negativeLabel: 'Kembali', onPositive: apply
  })
}

const cancel = () =>
  triggerCancel(props.mode === 'edit' ? `/projects/${props.slug}` : '/projects')
const next = () => editor.next()
const saveDraft = () => editor.saveDraft()
const saveChanges = async () => {
  if (!(await editor.saveChanges())) return
  if (editor.record.value?.slug && editor.record.value.slug !== props.slug) {
    await router.replace({
      path: `/projects/${editor.record.value.slug}/edit`,
      query: route.query
    })
  }
}
const publish = () => {
  showPopup({
    title: isOrganization.value ? 'Simulasikan pencarian Project Lead?' : 'Simulasikan publikasi?',
    description:
      isOrganization.value
        ? 'Proyek akan berstatus Mencari Project Lead dan belum bisa menerima kontributor. Ini hanya simulasi di perangkatmu; proses claim belum tersedia.'
        : 'Kamu akan menjadi Project Lead. Pratinjau ini hanya menyimpan status simulasi di perangkatmu. Tidak ada proyek yang dikirim ke server.',
    type: 'info',
    positiveLabel: 'Ya, simulasikan',
    negativeLabel: 'Kembali',
    onPositive: async () => {
      await editor.publish()
    }
  })
}
</script>

<template>
  <main
    class="project-editor-shell mx-auto flex w-full flex-col lg:px-4 pt-8 pb-0 sm:px-6 lg:px-8"
    :class="
      props.mode === 'create'
        ? 'min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-6rem)]'
        : 'min-h-[calc(100dvh-6rem)]'
    "
  >
    <div
      v-if="missingFixture"
      class="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8"
    >
      <h1 class="font-title-2 text-primary">Fixture edit tidak ditemukan</h1>
      <p class="mt-2 font-paragraph-3 text-secondary">
        Gunakan project demo
        <code>platform-portofolio-talenta-digital</code> untuk mencoba mode
        edit.
      </p>
      <NuxtLink to="/projects" class="mt-5 inline-flex">
        <AtomicButton variant="outline">Kembali ke project</AtomicButton>
      </NuxtLink>
    </div>

    <template v-else>
      <ProjectEditorMobileHeader
        class="sticky top-16 z-40 -mt-8 bg-white sm:static sm:z-auto sm:hidden"
        :current-step="editor.currentStep.value"
        :step-label="stepLabels[editor.currentStep.value] ?? 'Informasi Dasar'"
      />
      <header class="mb-8 hidden sm:block">
        <h1 class="font-title-1 text-primary">
          {{ props.mode === 'edit' ? 'Edit Proyek' : 'Buat Proyek' }}
        </h1>
        <p class="mt-2 max-w-3xl font-paragraph-2 text-secondary">
          {{
            props.mode === 'edit'
              ? `Perbarui detail ${editor.draft.value.title} dan tinjau kembali kebutuhan tim.`
              : 'Bagikan proyek nyata dan jelaskan kebutuhan setiap peran secara spesifik agar talenta memahami posisi, tanggung jawab, dan kontribusi yang diharapkan.'
          }}
        </p>
      </header>
      <slot name="preview-controls" />

      <div v-if="isOrganization && !editor.selectedOrganization.value" class="mb-5 rounded-xl border border-accent-200 bg-accent-50 p-4" role="alert">
        <p class="font-body-3 text-accent-800">Akses ke organisasi ini sudah tidak tersedia. Isian draftmu tetap ada, tetapi proyek organisasi ini belum bisa disimpan atau dipublikasikan.</p>
        <AtomicButton class="mt-3" variant="outline" :disabled="editor.isSubmitting.value || contextAvailable === false" @click="changeCreationMode('personal')">Buat atas nama pribadi</AtomicButton>
      </div>

      <div
        v-if="editor.storageWarning.value"
        class="mb-5 rounded-xl border border-accent-200 bg-accent-50 p-4 font-body-3 text-accent-800"
        role="status"
      >
        {{ editor.storageWarning.value }}
      </div>

      <div class="project-editor-grid min-h-0 flex-1 gap-5">
        <ProjectEditorNavigation
          class="self-start"
          :mode="props.mode"
          :current-step="editor.currentStep.value"
          :completed-steps="completedSteps"
          @navigate="editor.goToStep"
        />
        <div class="flex min-h-0 min-w-0 flex-col gap-0 sm:gap-5">
          <section
            class="flex min-w-0 flex-col self-stretch rounded-lg border-0 bg-white p-0 sm:rounded-xl sm:border sm:border-neutral-200 sm:bg-white"
          >
            <ProjectEditorInfo
              v-if="editor.currentStep.value === 0"
              v-model:form="editor.draft.value"
              :mode="props.mode"
              :creation-context="creationContext"
              :errors="editor.errors.value"
              :disabled="editor.isSubmitting.value"
              @change-creation-mode="changeCreationMode"
              @change-organization="changeOrganization"
            />
            <ProjectEditorTeam
              v-else-if="editor.currentStep.value === 1"
              v-model:form="editor.draft.value"
              :references="references"
              :errors="editor.errors.value"
              :disabled="editor.isSubmitting.value"
              @add-role="editor.addRole"
              @remove-role="editor.removeRole"
            />
            <ProjectEditorContext
              v-else-if="editor.currentStep.value === 2"
              v-model:form="editor.draft.value"
              :errors="editor.errors.value"
              :disabled="editor.isSubmitting.value"
              @set-origin="editor.setOrigin"
            />
            <ProjectEditorTimeline
              v-else-if="editor.currentStep.value === 3"
              v-model:form="editor.draft.value"
              :errors="editor.errors.value"
              :disabled="editor.isSubmitting.value"
            />
            <ProjectEditorReview
              v-else
              v-model:form="editor.draft.value"
              :mode="props.mode"
              :organization-name="editor.selectedOrganization.value?.name"
              :references="references"
              :errors="editor.errors.value"
              :disabled="editor.isSubmitting.value"
            />

            <div
              v-if="editor.submitError.value"
              class="mt-5 rounded-xl border border-danger-200 bg-danger-50 p-4 font-body-3 text-danger-700"
              role="alert"
            >
              {{ editor.submitError.value }}
            </div>
            <div
              v-if="editor.saveResult.value"
              class="mt-5 rounded-xl border border-success-200 bg-success-50 p-4"
              role="status"
            >
              <p class="font-label-1 text-success-800">
                {{ editor.saveResult.value.message }}
              </p>
              <p
                v-if="editor.record.value"
                class="mt-1 break-all font-body-3 text-success-700"
              >
                Status demo: {{ editor.record.value.status === 'awaiting_owner' ? 'Mencari Project Lead' : editor.record.value.status }} ·
                {{ editor.record.value.saved_at }}
              </p>
            </div>

            <p
              v-if="props.mode === 'create' && !editor.canPublish.value"
              class="mb-3 text-right font-body-3 text-secondary"
            >
              Simulasi publikasi membutuhkan email terverifikasi dan onboarding selesai.
            </p>
          </section>
          <ProjectEditorActions
            :mode="props.mode"
            :current-step="editor.currentStep.value"
            :is-submitting="editor.isSubmitting.value"
            :can-publish="editor.canPublish.value"
            :can-save="contextAvailable !== false && (!isOrganization || Boolean(editor.selectedOrganization.value))"
            :creation-mode="editor.draft.value.creation_mode"
            @back="editor.back"
            @next="next"
            @cancel="cancel"
            @save-draft="saveDraft"
            @save-changes="saveChanges"
            @publish="publish"
          />
          <p v-if="!canContinue" class="sr-only" role="status">
            Sedang menyimpan data pratinjau.
          </p>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.project-editor-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 64rem) {
  .project-editor-grid {
    grid-template-columns: 16rem minmax(0, 1fr);
  }
}
</style>
