<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

defineProps<{
  skillTags: { id: string; name: string }[]
  contributionRoles: { id: string; name: string; slug: string; category?: string | null }[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })
</script>

<template>
  <OrganismCard variant="elevated" class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50">
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="font-title-2">Kebutuhan & Keahlian</h3>
      <p class="mt-1 font-paragraph-2 text-secondary">
        Tentukan peran dan skill untuk membentuk tim project.
      </p>
    </div>
    <ProjectCreateRoleRequirementsEditor
      v-model:form="form"
      :skill-tags="skillTags"
      :contribution-roles="contributionRoles"
    />
  </OrganismCard>
</template>
