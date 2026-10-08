<script setup lang="ts">
import type {
  ProjectEditorMode,
  ProjectEditorCreationContext,
  ProjectEditorEligibility
} from '~/types/project-editor'

const props = defineProps<{
  mode: ProjectEditorMode
  slug?: string
  accountId?: string
  creationContext?: ProjectEditorCreationContext
  eligibility?: ProjectEditorEligibility
  contextAvailable?: boolean
}>()
const emit = defineEmits<{
  (event: 'dirty-change', dirty: boolean): void
  (event: 'submitting-change', submitting: boolean): void
}>()
</script>

<template>
  <ProjectEditor
    :mode="props.mode"
    :slug="props.slug"
    :account-id="props.accountId"
    :creation-context="props.creationContext"
    :eligibility="props.eligibility"
    :context-available="props.contextAvailable"
    demo
    @dirty-change="emit('dirty-change', $event)"
    @submitting-change="emit('submitting-change', $event)"
  />
</template>
