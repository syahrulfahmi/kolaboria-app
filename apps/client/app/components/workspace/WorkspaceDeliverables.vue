<script setup lang="ts">
import type { DeliverablePayload, DeliverableType, ProjectDeliverable, UpdateDeliverablePayload } from '~/types/workspace'

const props = withDefaults(defineProps<{
  deliverables: ProjectDeliverable[]
  readOnly?: boolean
  canManage?: boolean
  isOwner?: boolean
  currentUserId?: string | null
  saving?: boolean
}>(), { readOnly: false, canManage: false, isOwner: false, currentUserId: null, saving: false })

const emit = defineEmits<{
  create: [payload: DeliverablePayload]
  update: [id: string, payload: UpdateDeliverablePayload]
  remove: [id: string]
}>()

const types: Array<{ value: DeliverableType; label: string }> = [
  { value: 'repository', label: 'Repository' },
  { value: 'live_demo', label: 'Live demo' },
  { value: 'design', label: 'Design' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'application', label: 'Application' },
  { value: 'video', label: 'Video' },
  { value: 'other', label: 'Lainnya' }
]
const typeLabel = (type: DeliverableType) => types.find((item) => item.value === type)?.label || 'Lainnya'
const canEdit = (item: ProjectDeliverable) => props.isOwner || item.added_by === props.currentUserId
const form = reactive<DeliverablePayload>({ title: '', description: '', type: 'repository', url: '' })
const editingId = ref<string | null>(null)

const submit = () => {
  if (!form.title.trim() || !form.url.trim()) return
  emit('create', { ...form, title: form.title.trim(), url: form.url.trim() })
  form.title = ''; form.description = ''; form.type = 'repository'; form.url = ''
}
const startEdit = (item: ProjectDeliverable) => {
  editingId.value = item.id
  form.title = item.title; form.description = item.description || ''; form.type = item.type; form.url = item.url
}
const saveEdit = () => {
  if (!editingId.value || !form.title.trim() || !form.url.trim()) return
  emit('update', editingId.value, { ...form, title: form.title.trim(), url: form.url.trim() })
  editingId.value = null; form.title = ''; form.description = ''; form.type = 'repository'; form.url = ''
}
</script>

<template>
  <section class="space-y-4" aria-labelledby="deliverables-title">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="font-label-1 uppercase tracking-wide text-neutral-500">Evidence</p>
        <h3 id="deliverables-title" class="mt-1 font-title-3 text-secondary-900">Deliverables</h3>
      </div>
      <span class="rounded-full bg-neutral-100 px-2.5 py-1 font-label-2 text-neutral-600">{{ deliverables.length }}</span>
    </div>

    <form v-if="canManage && !readOnly" class="space-y-2 rounded-xl border border-primary-100 bg-primary-50/40 p-3" @submit.prevent="editingId ? saveEdit() : submit()">
      <input v-model="form.title" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body-3" placeholder="Judul deliverable" maxlength="160">
      <input v-model="form.url" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body-3" placeholder="https://..." type="url">
      <div class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <select v-model="form.type" class="rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body-3">
          <option v-for="item in types" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
        <input v-model="form.description" class="rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body-3" placeholder="Deskripsi (opsional)">
        <button type="submit" class="rounded-lg bg-primary-600 px-3 py-2 font-label-2 text-white disabled:opacity-50" :disabled="saving || !form.title.trim() || !form.url.trim()">{{ editingId ? 'Simpan' : 'Tambah' }}</button>
      </div>
      <button v-if="editingId" type="button" class="font-label-2 text-neutral-500" @click="editingId = null">Batal edit</button>
    </form>

    <div v-if="!deliverables.length" class="rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-center font-body-3 text-neutral-500">Belum ada deliverable. Project tetap dapat diselesaikan.</div>
    <ul v-else class="space-y-3">
      <li v-for="item in deliverables" :key="item.id" class="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-label-1 text-secondary-900">{{ item.title }}</p>
            <p class="mt-1 font-body-3 text-neutral-500">{{ typeLabel(item.type) }}<span v-if="item.description"> · {{ item.description }}</span></p>
            <a class="mt-2 block break-all font-body-3 text-primary-700 underline" :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.url }}</a>
          </div>
          <div v-if="canManage && !readOnly && canEdit(item)" class="flex shrink-0 gap-2">
            <button type="button" class="font-label-2 text-primary-700" @click="startEdit(item)">Edit</button>
            <button type="button" class="font-label-2 text-danger-700" @click="emit('remove', item.id)">Hapus</button>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
