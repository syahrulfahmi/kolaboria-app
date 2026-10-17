<script setup lang="ts">
import { ShieldCheck } from '@lucide/vue'
import type { ApiPaginationMeta } from '~/types/api'
import type { WorkspaceTeamMember } from '~/types/workspace-team'

defineProps<{
  projectTitle: string
  projectStatus: string | null
  members: WorkspaceTeamMember[]
  loading: boolean
  savingMemberId: string | null
  membersError: string | null
  infoError: string | null
  canManageWorkspace: boolean
  canGrantTaskAccess: boolean
  currentUserId: string | null
  pagination: ApiPaginationMeta
  page: number
  canGoPrevious: boolean
  canGoNext: boolean
}>()

const emit = defineEmits<{
  'member-tasks': [membershipId: string]
  'task-access-change': [membershipId: string, enabled: boolean]
  'page-change': [page: number]
  retry: []
}>()

const statusLabel = (status: string | null) => ({ open: 'Terbuka', awaiting_owner: 'Menunggu owner', in_progress: 'Berjalan', completed: 'Selesai', archived: 'Diarsipkan', draft: 'Draft' }[status ?? ''] ?? status ?? '')
</script>

<template>
  <section class="space-y-4">
    <div class="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="min-w-0">
          <h2 class="font-title-3 text-secondary-900">Anggota proyek</h2>
          <p v-if="projectTitle" class="mt-1 truncate font-body-3 text-neutral-500">{{ projectTitle }}<span v-if="projectStatus"> · {{ statusLabel(projectStatus) }}</span></p>
          <p v-if="infoError" class="mt-1 font-body-3 text-warning-800" role="status">Status dan izin workspace belum dapat dimuat.</p>
        </div>
        <AtomicTag>{{ pagination.total }} anggota aktif</AtomicTag>
      </div>
      <MoleculeLoading v-if="loading && !members.length" label="Memuat anggota proyek…" />
      <div v-else-if="membersError" class="rounded-lg bg-danger-50 p-4 font-body-2 text-danger-800" role="alert">{{ membersError }} <button type="button" class="underline" @click="emit('retry')">Coba lagi</button></div>
      <div v-else-if="!members.length" class="py-10 text-center font-body-2 text-neutral-500">Belum ada anggota aktif di proyek ini.</div>
      <div v-else class="divide-y divide-neutral-100">
        <div v-for="member in members" :key="member.membershipId" class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 py-4 first:pt-1 last:pb-1 sm:flex">
          <AtomicAvatar :name="member.name" :src="member.avatar ?? undefined" :is-verified="member.isVerified" :size="'md'" />
          <div class="min-w-0 sm:flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate font-label-2 text-secondary-900">{{ member.name }}</p>
              <AtomicTag v-if="member.membershipRole === 'owner'" variant="success">Owner</AtomicTag>
              <AtomicTag v-else-if="member.userId === currentUserId" variant="primary">Kamu</AtomicTag>
            </div>
            <p class="mt-1 truncate font-body-3 text-neutral-500">{{ member.roleLabel }}<span v-if="member.headline"> · {{ member.headline }}</span></p>
            <p class="mt-1 font-body-3 text-neutral-500">{{ member.activeTaskCount }} task aktif</p>
          </div>
          <div class="col-span-2 flex w-full flex-col gap-2 border-t border-neutral-100 pt-3 sm:ml-auto sm:w-auto sm:min-w-52 sm:shrink-0 sm:border-0 sm:pt-0">
            <AtomicButton variant="outline" size="sm" @click="emit('member-tasks', member.membershipId)">Lihat tugas anggota</AtomicButton>
            <AtomicButton v-if="canGrantTaskAccess && member.membershipRole === 'contributor'" :variant="member.taskManagementGranted ? 'primary' : 'outline'" size="sm" :loading="savingMemberId === member.membershipId" :disabled="savingMemberId === member.membershipId" :aria-pressed="member.taskManagementGranted" @click="emit('task-access-change', member.membershipId, !member.taskManagementGranted)">
              {{ member.taskManagementGranted ? 'Cabut izin pengelolaan task' : 'Izinkan membuat dan menghapus task' }}
            </AtomicButton>
          </div>
        </div>
      </div>
      <div v-if="!membersError && pagination.total_pages > 1" class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
        <p class="font-body-3 text-neutral-500">Halaman {{ page }} dari {{ pagination.total_pages }}</p>
        <div class="flex gap-2">
          <AtomicButton variant="outline" size="sm" :disabled="!canGoPrevious || loading" @click="emit('page-change', page - 1)">Sebelumnya</AtomicButton>
          <AtomicButton variant="outline" size="sm" :disabled="!canGoNext || loading" @click="emit('page-change', page + 1)">Berikutnya</AtomicButton>
        </div>
      </div>
    </div>
    <div class="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
      <div class="flex gap-3">
        <ShieldCheck class="mt-0.5 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
        <div>
          <p class="font-label-2 text-primary-900">Peran dan tanggung jawab</p>
          <p class="mt-1 font-body-3 text-primary-900/80">Identitas, keanggotaan, jumlah task aktif, navigasi tugas, dan izin task berasal dari backend. Izin ini memberi akses membuat dan menghapus task aktif; pengelolaan lainnya tetap mengikuti peran workspace.</p>
          <p v-if="canManageWorkspace && !canGrantTaskAccess" class="mt-2 font-body-3 text-primary-900/80">Izin task hanya dapat diubah owner proyek saat proyek berjalan.</p>
        </div>
      </div>
    </div>
  </section>
</template>
