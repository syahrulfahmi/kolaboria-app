<script setup lang="ts">
import type { ProjectRole } from '~/types/project'
import type {
  ActivityLog,
  ContributionSnapshot,
  DeliverablePayload,
  FinalizationStatus,
  MemberProfile,
  ProjectDeliverable,
  UpdateDeliverablePayload,
  WorkspaceOverview
} from '~/types/workspace'

const props = withDefaults(defineProps<{
  members: MemberProfile[]
  activities: ActivityLog[]
  overview: WorkspaceOverview | null
  projectCreatorId: string
  currentUserId?: string | null
  isOwner?: boolean
  projectRoles?: ProjectRole[]
  deliverables?: ProjectDeliverable[]
  snapshots?: ContributionSnapshot[]
  finalizationStatus?: FinalizationStatus | null
  loading?: boolean
  readOnly?: boolean
  modelValue?: boolean
}>(), {
  currentUserId: null,
  isOwner: false,
  projectRoles: () => [],
  deliverables: () => [],
  snapshots: () => [],
  finalizationStatus: null,
  loading: false,
  readOnly: false,
  modelValue: true
})

const emit = defineEmits<{
  leave: []
  remove: [memberId: string]
  changeRole: [memberId: string, roleId: string]
  createDeliverable: [payload: DeliverablePayload]
  updateDeliverable: [id: string, payload: UpdateDeliverablePayload]
  removeDeliverable: [id: string]
  refreshFinalization: []
  'update:modelValue': [value: boolean]
}>()

const activeTab = ref<'summary' | 'activity' | 'members' | 'deliverables'>('summary')
const tabs: Array<{ id: typeof activeTab.value; label: string }> = [
  { id: 'summary', label: 'Ringkasan' },
  { id: 'activity', label: 'Aktivitas' },
  { id: 'members', label: 'Anggota' },
  { id: 'deliverables', label: 'Evidence' }
]

const setActiveTab = (tabId: typeof activeTab.value) => {
  activeTab.value = tabId
}

const roleOptions = computed(() =>
  props.projectRoles
    .filter((role) => role.status !== 'archived')
    .map((role) => ({
      label: role.custom_title || role.contribution_role?.name || 'Project Role',
      value: role.id
    }))
)

const activeMembers = computed(() =>
  props.members.filter((member) => member.membership_status !== 'removed')
)

const roleLabel = (member: MemberProfile) =>
  member.custom_role_title ||
  member.contribution_role_name ||
  (member.membership_role === 'owner' ? 'Owner' : 'Kontributor')

const memberStatusLabel = (member: MemberProfile) => {
  if (member.membership_status === 'left') return 'Left'
  if (member.membership_status === 'removed') return 'Removed'
  return 'Active'
}

const closeMobileRail = () => emit('update:modelValue', false)

const confirmRoleChange = (memberId: string, roleId: string) => {
  if (!roleId || props.readOnly) return
  const member = props.members.find((item) => item.id === memberId)
  if (!member || member.project_role_id === roleId) return
  if (!window.confirm('Ubah role anggota ini? Perubahan dapat memengaruhi tanggung jawabnya di project.')) return
  emit('changeRole', memberId, roleId)
}

const requestRemove = (memberId: string) => {
  if (!props.isOwner || props.readOnly) return
  emit('remove', memberId)
}
</script>

<template>
  <div class="contents">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-40 bg-neutral-950/40 lg:hidden"
      aria-hidden="true"
      @click="closeMobileRail"
    />

    <aside
      :class="[
        'flex flex-col border-neutral-200 bg-white',
        modelValue
          ? 'fixed inset-y-0 right-0 z-50 w-[min(100%,24rem)] shadow-2xl lg:static lg:z-auto lg:h-auto lg:w-80 lg:shrink-0 lg:border-l lg:shadow-none'
          : 'hidden lg:static lg:flex lg:h-auto lg:w-80 lg:shrink-0 lg:border-l'
      ]"
      role="complementary"
      aria-label="Konteks kolaborasi workspace"
    >
      <div class="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4 lg:px-5">
        <div>
          <p class="font-label-1 uppercase tracking-wide text-neutral-500">Kolaborasi</p>
          <h2 class="mt-1 font-title-3 text-secondary-900">Context workspace</h2>
        </div>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 lg:hidden"
          aria-label="Tutup panel kolaborasi"
          @click="closeMobileRail"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex gap-1 overflow-x-auto border-b border-neutral-200 px-3 py-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="min-w-max flex-1 rounded-md px-2 py-2 font-label-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          :class="activeTab === tab.id ? 'bg-primary-50 text-primary-800' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'"
          :aria-selected="activeTab === tab.id"
          role="tab"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div v-if="activeTab === 'summary'" role="tabpanel">
          <WorkspaceOverview :overview="overview" compact />
        </div>

        <div v-else-if="activeTab === 'activity'" role="tabpanel">
          <ActivityFeed :logs="activities" :loading="loading" compact />
        </div>

        <div v-else-if="activeTab === 'deliverables'" role="tabpanel" class="space-y-6">
          <WorkspaceDeliverables
            :deliverables="deliverables"
            :read-only="readOnly"
            :can-manage="Boolean(isOwner || currentUserId) && !readOnly"
            :is-owner="isOwner"
            :current-user-id="currentUserId"
            :saving="loading"
            @create="emit('createDeliverable', $event)"
            @update="(id, payload) => emit('updateDeliverable', id, payload)"
            @remove="emit('removeDeliverable', $event)"
          />
          <WorkspaceContributionSummary :snapshots="snapshots" :members="members" :status="finalizationStatus" @refresh="emit('refreshFinalization')" />
        </div>

        <div v-else role="tabpanel" class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="font-label-1 uppercase tracking-wide text-neutral-500">Anggota aktif</p>
              <p class="mt-1 font-body-2 text-neutral-600">{{ activeMembers.length }} orang di workspace.</p>
            </div>
            <span class="rounded-full bg-neutral-100 px-2 py-0.5 font-label-2 text-neutral-600">{{ activeMembers.length }}</span>
          </div>

          <MoleculeLoading v-if="loading" label="Memuat anggota..." class="py-6" />
          <OrganismEmptyState v-else-if="activeMembers.length === 0" title="Belum ada anggota" description="Anggota yang aktif akan muncul di sini." icon="users" />

          <ul v-else class="space-y-3" aria-label="Daftar anggota aktif">
            <li v-for="member in activeMembers" :key="member.id" class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3">
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-50 font-label-1 text-secondary-700 ring-1 ring-secondary-100">
                  {{ (member.full_name || member.username).slice(0, 1).toUpperCase() }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate font-label-1 text-secondary-900" :title="member.full_name || member.username">
                      {{ member.full_name || member.username }}
                    </p>
                    <AtomicTag v-if="member.id === projectCreatorId" variant="success">Owner</AtomicTag>
                  </div>
                  <div class="mt-1 flex flex-wrap items-center gap-1.5">
                    <AtomicTag v-if="member.id !== projectCreatorId" variant="default">{{ roleLabel(member) }}</AtomicTag>
                    <span class="font-body-3 text-neutral-500">{{ memberStatusLabel(member) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="member.id !== projectCreatorId && member.membership_status === 'active'" class="mt-3 space-y-2 border-t border-neutral-200 pt-3">
                <label v-if="isOwner && roleOptions.length" class="block font-label-2 text-neutral-600">
                  Project role
                  <select
                    :value="member.project_role_id || ''"
                    class="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body-3 text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    :disabled="readOnly"
                    @change="confirmRoleChange(member.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </label>
                <div class="flex items-center justify-between gap-2">
                  <button v-if="isOwner && !readOnly" type="button" class="font-label-2 text-danger-700 hover:text-danger-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-400" @click="requestRemove(member.id)">
                    Hapus anggota
                  </button>
                  <button v-if="currentUserId === member.id && !readOnly" type="button" class="ml-auto font-label-2 text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" @click="emit('leave')">
                    Keluar dari project
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>
