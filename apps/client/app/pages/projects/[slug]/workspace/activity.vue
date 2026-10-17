<script setup lang="ts">
import { computed } from 'vue'
import WorkspaceActivityView from '~/components/workspace/views/WorkspaceActivityView.vue'
import { useWorkspaceActivity } from '~/composables/useWorkspaceActivity'

const route = useRoute()
const activity = useWorkspaceActivity(computed(() => String(route.params.slug ?? '')))
</script>

<template>
  <WorkspaceActivityView :controller="activity" />
</template>
