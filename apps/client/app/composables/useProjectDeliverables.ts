import type { Ref } from 'vue'
import type {
  ContributionSnapshot,
  DeliverablePayload,
  FinalizationStatus,
  ProjectDeliverable,
  UpdateDeliverablePayload
} from '../types/workspace'
import { WorkspaceService } from '../services/workspace.service'

export const useProjectDeliverables = (projectId: Ref<string | null | undefined>) => {
  const deliverables = ref<ProjectDeliverable[]>([])
  const snapshots = ref<ContributionSnapshot[]>([])
  const finalizationStatus = ref<FinalizationStatus | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  const requireProjectId = () => {
    if (!projectId.value) throw new Error('Project belum siap.')
    return projectId.value
  }

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const id = requireProjectId()
      const [nextDeliverables, nextSnapshots, nextStatus] = await Promise.all([
        WorkspaceService.getDeliverables(id),
        WorkspaceService.getContributionSnapshots(id),
        WorkspaceService.getFinalizationStatus(id)
      ])
      deliverables.value = nextDeliverables
      snapshots.value = nextSnapshots
      finalizationStatus.value = nextStatus
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat evidence project.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: DeliverablePayload) => {
    saving.value = true
    try {
      const created = await WorkspaceService.createDeliverable(requireProjectId(), payload)
      deliverables.value = [created, ...deliverables.value]
      return created
    } finally {
      saving.value = false
    }
  }

  const update = async (deliverableId: string, payload: UpdateDeliverablePayload) => {
    saving.value = true
    try {
      const updated = await WorkspaceService.updateDeliverable(requireProjectId(), deliverableId, payload)
      const index = deliverables.value.findIndex((item) => item.id === deliverableId)
      if (index >= 0) deliverables.value[index] = updated
      return updated
    } finally {
      saving.value = false
    }
  }

  const remove = async (deliverableId: string) => {
    saving.value = true
    try {
      await WorkspaceService.deleteDeliverable(requireProjectId(), deliverableId)
      deliverables.value = deliverables.value.filter((item) => item.id !== deliverableId)
    } finally {
      saving.value = false
    }
  }

  const refreshFinalization = async () => {
    finalizationStatus.value = await WorkspaceService.getFinalizationStatus(requireProjectId())
    snapshots.value = await WorkspaceService.getContributionSnapshots(requireProjectId())
    return finalizationStatus.value
  }

  return { deliverables, snapshots, finalizationStatus, loading, saving, error, load, create, update, remove, refreshFinalization }
}
