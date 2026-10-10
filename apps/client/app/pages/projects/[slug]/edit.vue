<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { getApiErrorMessage } from '~/utils/error'
import { toProjectEditorRecord } from '~/utils/project-editor-api'
import { isProjectDefinitionEditableBy } from '~/utils/project-presentation'
import { useProjectEditorApi } from '~/composables/useProjectEditorApi'
import type {
  ProjectDetailResponse,
  ProjectEditorCreationContext,
  ProjectEditorEligibility,
  ProjectEditorRecord
} from '~/types/project-editor'

const route = useRoute()
const { user, fetchCurrentUser } = useAuth()
const { checkOnboardingStatus } = useProfile()
const persistence = useProjectEditorApi()
const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? (value[0] ?? '') : String(value ?? '')
})
const loading = ref(true)
const failed = ref(false)
const errorMessage = ref('')
const accountId = ref('')
const detail = shallowRef<ProjectDetailResponse | null>(null)
const record = shallowRef<ProjectEditorRecord | null>(null)
const creationContext = shallowRef<ProjectEditorCreationContext | null>(null)
const eligibility = shallowRef<ProjectEditorEligibility | null>(null)
const contextAvailable = computed(
  () =>
    !loading.value &&
    !failed.value &&
    accountId.value !== '' &&
    accountId.value === user.value?.id
)
let loadSequence = 0
let mounted = false

const loadProject = async () => {
  const sequence = ++loadSequence
  loading.value = true
  failed.value = false
  errorMessage.value = ''
  detail.value = null
  record.value = null
  try {
    const account = await fetchCurrentUser({ preserveSessionOnError: true })
    if (!account) throw new Error('account context unavailable')
    const onboarded = await checkOnboardingStatus(true, { throwOnError: true })
    const serverDetail = await persistence.loadBySlug(slug.value)
    if (sequence !== loadSequence) return
    const latestAccount = user.value
    if (!latestAccount || latestAccount.id !== account.id)
      throw new Error('account context changed')
    if (!isProjectDefinitionEditableBy({
      status: serverDetail.status,
      creation_mode: serverDetail.creation_mode,
      owner_id: serverDetail.ownership.owner_id,
      creator_id: serverDetail.ownership.created_by_user_id,
      initiator_organization_id: serverDetail.ownership.initiator_organization_id
    }, latestAccount))
      throw Object.assign(new Error('forbidden'), { statusCode: 403 })

    accountId.value = latestAccount.id
    creationContext.value = {
      system_role: latestAccount.systemRole ?? 'user',
      initiable_organizations:
        latestAccount.systemRole === 'admin'
          ? (latestAccount.initiableOrganizations ?? []).map(
              ({ id, name }) => ({ id, name })
            )
          : []
    }
    eligibility.value = {
      email_verified: Boolean(latestAccount.emailVerifiedAt),
      onboarding_completed: onboarded
    }
    detail.value = serverDetail
    record.value = toProjectEditorRecord(serverDetail)
  } catch (error: unknown) {
    if (sequence !== loadSequence) return
    failed.value = true
    errorMessage.value = getApiErrorMessage(
      error,
      'Proyek belum dapat dimuat untuk diedit.'
    )
  } finally {
    if (sequence === loadSequence) loading.value = false
  }
}

watch(slug, () => {
  if (mounted) void loadProject()
})
watch(
  () => user.value?.id,
  (currentId) => {
    if (accountId.value && currentId !== accountId.value) {
      loadSequence += 1
      failed.value = true
      loading.value = false
      detail.value = null
      record.value = null
      errorMessage.value =
        'Akun berubah. Muat ulang halaman dengan akun yang sesuai.'
    }
  }
)
onMounted(() => {
  mounted = true
  void loadProject()
})

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard'],
  homeNavbar: {
    variant: 'back-path',
    title: 'Edit Proyek',
    mainHorizontalPadding: 'none',
    mainWidth: 'default'
  }
})
useHead({ title: 'Edit Proyek — Kolaboria' })
</script>

<template>
  <OrganismAsyncContent :pending="loading" label="Memuat proyek dari server…">
  <main
    v-if="failed"
    class="m-4 rounded-xl border border-neutral-200 bg-white p-6 sm:m-6"
    role="alert"
  >
    <h1 class="font-title-2 text-primary">Proyek belum dapat diedit</h1>
    <p class="mt-2 font-body-3 text-secondary">{{ errorMessage }}</p>
    <div class="mt-5 flex gap-3">
      <AtomicButton variant="outline" @click="loadProject"
        >Coba lagi</AtomicButton
      >
      <NuxtLink to="/projects/my-projects">
        <AtomicButton variant="ghost">Kembali ke proyekku</AtomicButton>
      </NuxtLink>
    </div>
  </main>
  <ProjectEditor
    v-else-if="detail && record && creationContext && eligibility"
    :key="accountId + ':' + detail.id"
    mode="edit"
    :slug="detail.slug"
    :account-id="accountId"
    :initial-record="record"
    :initial-detail="detail"
    :creation-context="creationContext"
    :eligibility="eligibility"
    :context-available="contextAvailable"
    :persistence="persistence"
  />
  </OrganismAsyncContent>
</template>
