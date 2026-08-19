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
  <OrganismCard variant="elevated" class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50">
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="font-title-2">Kebutuhan & Keahlian</h3>
      <p class="mt-1 font-paragraph-2 text-secondary">
        Tentukan peran, kapasitas, dan tools untuk membentuk tim project.
      </p>
    </div>
    <ProjectCreateRoleRequirementsEditor
      v-model:form="form"
      :contribution-roles="contributionRoles"
      :tools="tools"
    />
  </OrganismCard>
</template>
