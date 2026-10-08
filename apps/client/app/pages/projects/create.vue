<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import type { ProjectEditorCreationContext, ProjectEditorEligibility } from '~/types/project-editor'

const { user, fetchCurrentUser } = useAuth()
const { checkOnboardingStatus } = useProfile()
const loading = ref(true)
const failed = ref(false)
const accountId = ref('')
const creationContext = shallowRef<ProjectEditorCreationContext | null>(null)
const eligibility = shallowRef<ProjectEditorEligibility | null>(null)
const contextAvailable = computed(() => !loading.value && !failed.value && accountId.value === user.value?.id)
const organizationsForAccount = () => user.value?.systemRole === 'admin'
  ? (user.value.initiableOrganizations ?? []).map(({ id, name }) => ({ id, name })) : []
watch(() => JSON.stringify([user.value?.id, user.value?.systemRole, user.value?.emailVerifiedAt, user.value?.initiableOrganizations]), () => {
  if (!creationContext.value || loading.value) return
  creationContext.value = {
    system_role: accountId.value === user.value?.id ? user.value?.systemRole ?? 'user' : 'user',
    initiable_organizations: accountId.value === user.value?.id ? organizationsForAccount() : []
  }
  if (eligibility.value) eligibility.value = { ...eligibility.value, email_verified: Boolean(user.value?.emailVerifiedAt) }
  if (accountId.value !== user.value?.id) failed.value = true
})
const loadContext = async () => {
  loading.value = true
  failed.value = false
  try {
    const account = await fetchCurrentUser({ preserveSessionOnError: true })
    if (!account) throw new Error('Account context unavailable')
    const onboarded = await checkOnboardingStatus(true, { throwOnError: true })
    // Account state may change while onboarding is being checked.
    const latestAccount = user.value
    if (!latestAccount || latestAccount.id !== account.id) throw new Error('Account context changed')
    accountId.value = latestAccount.id
    creationContext.value = {
      system_role: latestAccount.systemRole ?? 'user',
      initiable_organizations: latestAccount.systemRole === 'admin'
        ? (latestAccount.initiableOrganizations ?? []).map(({ id, name }) => ({ id, name }))
        : []
    }
    eligibility.value = {
      email_verified: Boolean(latestAccount.emailVerifiedAt),
      onboarding_completed: onboarded
    }
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}
onMounted(loadContext)

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard'],
  homeNavbar: {
    variant: 'back-path', title: 'Buat Proyek',
    mainHorizontalPadding: 'none', mainWidth: 'default'
  }
})
useHead({ title: 'Buat Project — Kolaboria' })
</script>

<template>
  <div v-if="loading && !creationContext" class="px-4 py-10 sm:px-6" role="status" aria-live="polite">
    <p class="font-body-2 text-secondary">Menyiapkan halaman proyekmu…</p>
  </div>
  <div v-if="failed" class="m-4 rounded-xl border border-neutral-200 bg-white p-6 sm:m-6" role="alert">
    <h1 class="font-title-2 text-primary">Halaman proyek belum siap</h1>
    <p class="mt-2 font-body-3 text-secondary">Informasi akunmu belum berhasil dimuat. Coba lagi untuk melanjutkan.</p>
    <AtomicButton class="mt-5" variant="outline" :disabled="loading" @click="loadContext">Coba lagi</AtomicButton>
  </div>
  <ProjectEditorPreview
    v-if="creationContext && eligibility"
    :key="accountId"
    mode="create"
    :account-id="accountId"
    :creation-context="creationContext"
    :eligibility="eligibility"
    :context-available="contextAvailable"
  >
    <template #preview-controls>
      <aside class="mb-5 border-b border-neutral-200 px-4 pb-5 sm:px-0" aria-label="Informasi pratinjau">
        <p class="font-label-1 text-primary">Pratinjau pembuatan proyek</p>
        <p class="mt-1 font-body-3 text-secondary">Draft dan simulasi publikasi masih tersimpan di perangkat ini.</p>
      </aside>
    </template>
  </ProjectEditorPreview>
</template>
