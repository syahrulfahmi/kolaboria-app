<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import WorkspaceTasksLiveView from '~/components/workspace/views/WorkspaceTasksLiveView.vue'
import { useWorkspaceTasks } from '~/composables/useWorkspaceTasks'

const route = useRoute()
const router = useRouter()
const initialFilter = computed(() => {
  const value = Array.isArray(route.query.filter) ? route.query.filter[0] : route.query.filter
  return value === 'mine' || value === 'review' ? value : 'all'
})
const initialAssignee = computed(() => {
  const value = Array.isArray(route.query.assignee) ? route.query.assignee[0] : route.query.assignee
  return initialFilter.value === 'mine' || typeof value !== 'string' || !value.trim() ? null : value.trim()
})
const slug = computed(() => String(route.params.slug ?? ''))
const tasks = useWorkspaceTasks(slug, initialFilter, initialAssignee)
watch(() => route.query.filter, (filter) => {
  const value = Array.isArray(filter) ? filter[0] : filter
  const next = value === 'mine' || value === 'review' ? value : 'all'
  if (tasks.filter.value !== next) tasks.changeFilter(next)
}, { immediate: true })
watch([slug, () => route.query.assignee], ([, memberId]) => {
  if (initialFilter.value === 'mine') return
  const value = Array.isArray(memberId) ? memberId[0] : memberId
  tasks.filterByAssignee(typeof value === 'string' && value.trim() ? value.trim() : null)
}, { immediate: true })

const handledIntent = ref('')
const clearIntent = async () => {
  const query = { ...route.query }
  delete query.task_id
  delete query.action
  await router.replace({ query })
}
watch([tasks.boardLoaded, () => route.query.task_id, () => route.query.action], async ([loaded, taskId, action]) => {
  if (!loaded) return
  const selectedTaskId = Array.isArray(taskId) ? taskId[0] : taskId
  const selectedAction = Array.isArray(action) ? action[0] : action
  const intent = typeof selectedTaskId === 'string' && selectedTaskId.trim()
    ? `task:${selectedTaskId.trim()}`
    : selectedAction === 'create' ? 'create' : ''
  if (!intent) { handledIntent.value = ''; return }
  const scopedIntent = `${slug.value}::${intent}`
  if (handledIntent.value === scopedIntent) return
  handledIntent.value = scopedIntent
  if (intent.startsWith('task:')) await tasks.openTask(intent.slice(5))
  else if (tasks.canCreate.value) await tasks.openCreate()
  await clearIntent()
}, { immediate: true })
</script>

<template>
  <WorkspaceTasksLiveView :controller="tasks" />
</template>
