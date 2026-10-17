<script setup lang="ts">
import { computed, watch } from 'vue'
import WorkspaceOverviewView from '~/components/workspace/views/WorkspaceOverviewView.vue'
import { useAuth } from '~/composables/useAuth'
import { useWorkspaceLiveContext } from '~/composables/workspace-live-context'
import { useWorkspaceOverview } from '~/composables/useWorkspaceOverview'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const overview = useWorkspaceOverview(slug)
const { user } = useAuth()
const { publishOverview } = useWorkspaceLiveContext()

watch([() => overview.data.value, () => user.value?.id], ([data, accountId]) => {
  if (data && accountId) publishOverview(accountId, data)
}, { immediate: true })

const navigate = (path: string) => navigateTo(path)
</script>

<template>
  <WorkspaceOverviewView :controller="overview" @navigate="navigate" />
</template>
