<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'
import type { Tool } from '~/types/skill'

defineProps<{
  contributionRoles: { id: string; name: string; slug: string; category?: string | null }[]
  tools: Tool[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })
</script>

<template>
  <ProjectCreateRoleRequirementsEditor
    v-model:form="form"
    :contribution-roles="contributionRoles"
    :tools="tools"
  />
</template>
