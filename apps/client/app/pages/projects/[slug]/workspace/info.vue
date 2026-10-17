<script setup lang="ts">
import { computed } from "vue";
import WorkspaceProjectInfoView from "~/components/workspace/views/WorkspaceProjectInfoView.vue";
import { useWorkspaceProjectInfo } from "~/composables/useWorkspaceProjectInfo";
import { useWorkspaceProjectCompletion } from "~/composables/useWorkspaceProjectCompletion";
import WorkspaceProjectCompletionModal from "~/components/workspace/dialogs/WorkspaceProjectCompletionModal.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));
const {
  data,
  loading,
  error,
  confirmingStart,
  starting,
  startError,
  load,
  requestStart,
  confirmStart,
  cancelStart,
} = useWorkspaceProjectInfo(slug);
const completion = useWorkspaceProjectCompletion(slug, data, () => load(true));
</script>

<template>
  <WorkspaceProjectInfoView
    :info="data"
    :reviewing-closure="completion.reviewing.value"
    :closure-error="completion.open.value ? null : completion.error.value"
    :loading="loading"
    :error="error"
    :confirming-start="confirmingStart"
    :starting="starting"
    :start-error="startError"
    @retry="load"
    @start-request="requestStart"
    @start-confirm="confirmStart"
    @start-cancel="cancelStart"
    @closure-review="completion.requestReview"
    @closure-refresh="load(true)"
  />
  <WorkspaceProjectCompletionModal
    :open="completion.open.value"
    :info="data"
    v-model:result-summary="completion.resultSummary.value"
    v-model:review-basis="completion.reviewBasis.value"
    :saving="completion.saving.value"
    :reviewing="completion.reviewing.value"
    :can-confirm="completion.canConfirm.value"
    :needs-refresh="completion.needsRefresh.value"
    :error="completion.error.value"
    @cancel="completion.cancel"
    @confirm="completion.confirm"
    @refresh="completion.requestReview"
  />
</template>
