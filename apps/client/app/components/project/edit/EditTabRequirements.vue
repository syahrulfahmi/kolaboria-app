<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

defineProps<{
  skillTags: { id: string; name: string }[]
  contributionRoles: { id: string; name: string; slug: string; category?: string | null }[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })
</script>

<template>
  <ProjectCreateRoleRequirementsEditor
    v-model:form="form"
    :skill-tags="skillTags"
    :contribution-roles="contributionRoles"
  />
</template>
