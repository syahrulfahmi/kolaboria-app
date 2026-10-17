<script setup lang="ts">
import { computed } from 'vue'
import WorkspaceTeamView from '~/components/workspace/views/WorkspaceTeamView.vue'
import { useWorkspaceTeam } from '~/composables/useWorkspaceTeam'

const route = useRoute()
const team = useWorkspaceTeam(computed(() => String(route.params.slug ?? '')))

const openMemberTasks = async (membershipId: string) => {
  await navigateTo({ path: `/projects/${encodeURIComponent(String(route.params.slug ?? ''))}/workspace/tasks`, query: { assignee: membershipId } })
}
</script>

<template>
  <WorkspaceTeamView
    :project-title="team.info.value?.project.title ?? ''"
    :project-status="team.info.value?.project.status ?? null"
    :members="team.members.value"
    :loading="team.loading.value"
    :saving-member-id="team.savingMemberId.value"
    :members-error="team.membersError.value"
    :info-error="team.infoError.value"
    :can-manage-workspace="team.canManageWorkspace.value"
    :can-grant-task-access="team.canGrantTaskAccess.value"
    :current-user-id="team.currentUserId.value"
    :pagination="team.pagination.value"
    :page="team.page.value"
    :can-go-previous="team.canGoPrevious.value"
    :can-go-next="team.canGoNext.value"
    @member-tasks="openMemberTasks"
    @task-access-change="team.setTaskManagement"
    @page-change="team.setPage"
    @retry="team.load"
  />
</template>
