<script setup lang="ts">
import { computed } from "vue";
import type { createWorkspaceTasksController } from "~/composables/useWorkspaceTasks";
import { TASK_COLUMNS } from "~/composables/useWorkspaceTasks";

const props = defineProps<{
  controller: ReturnType<typeof createWorkspaceTasksController>;
}>();

const c = props.controller;

const dialogTitle = computed(() =>
  c.detailLoading.value
    ? "Memuat task…"
    : c.creatingTask.value
      ? "Buat task baru"
      : "Detail task",
);
const dialogSubtitle = computed(() => c.selectedTask.value?.title ?? "");
const selectableStatuses = computed(() => {
  const selected = c.selectedTask.value;
  if (!selected) return [{ value: "todo", label: "Akan dikerjakan" }];

  const allowed = new Set(selected.permissions.allowed_transitions);
  return TASK_COLUMNS.filter(
    (column) => column.status === selected.status || allowed.has(column.status),
  ).map((column) => ({ value: column.status, label: column.label }));
});
const assigneeOptions = computed(() => [
  { value: "", label: "Belum ditentukan" },
  ...c.members.value.map((member) => ({
    value: member.id,
    label: member.name,
  })),
]);

const formatTaskDate = (value: Date) =>
  [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");

const dueDateValue = computed<Date | null>({
  get() {
    const value = c.taskForm.value.dueDate;
    if (!value) return null;

    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  },
  set(value) {
    c.taskForm.value.dueDate = value ? formatTaskDate(value) : "";
  },
});

const primaryDisabled = computed(
  () =>
    c.detailLoading.value ||
    !c.canSave.value ||
    (!c.creatingTask.value && !c.selectedTask.value) ||
    (!!c.selectedTask.value &&
      !c.selectedTask.value.permissions.edit_content &&
      !c.selectedTask.value.permissions.manage_metadata &&
      c.taskForm.value.status === c.selectedTask.value.status),
);

const commentDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const handlePrimary = () => {
  if (!primaryDisabled.value) void c.save();
};
</script>

<template>
  <OrganismModal
    v-model="c.dialogOpen.value"
    :title="dialogTitle"
    :subtitle="dialogSubtitle"
    size="lg"
    :mobile-fullscreen="true"
    :primary-label="
      c.saving.value
        ? 'Menyimpan…'
        : c.creatingTask.value
          ? 'Buat task'
          : 'Simpan perubahan'
    "
    secondary-label="Tutup"
    :primary-disabled="primaryDisabled"
    :primary-loading="c.saving.value"
    @on-primary-click="handlePrimary"
    @on-secondary-click="c.closeDialog"
    @close="c.closeDialog"
  >
    <MoleculeLoading
      v-if="c.detailLoading.value"
      label="Memuat detail task dan komentar…"
    />
    <div
      v-else-if="c.creatingTask.value || c.selectedTask.value"
      class="space-y-4"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <MoleculeInputField
          v-model="c.taskForm.value.title"
          label="Judul task"
          placeholder="Contoh: Susun alur onboarding"
          required
          :disabled="
            !!c.selectedTask.value &&
            !c.selectedTask.value.permissions.edit_content
          "
        />
        <MoleculeDropdown
          v-if="
            !c.selectedTask.value ||
            c.selectedTask.value.permissions.manage_metadata
          "
          v-model="c.taskForm.value.assigneeMemberId"
          label="Penanggung jawab"
          placeholder="Pilih anggota"
          :options="assigneeOptions"
          :disabled="c.membersLoading.value"
        />
        <MoleculeDropdown
          v-if="
            c.canManage.value &&
            (!c.selectedTask.value ||
              c.selectedTask.value.permissions.manage_metadata)
          "
          v-model="c.taskForm.value.priority"
          label="Prioritas"
          :options="[
            { label: 'Rendah', value: 'low' },
            { label: 'Sedang', value: 'medium' },
            { label: 'Tinggi', value: 'high' },
          ]"
          :disabled="c.projectStatus.value !== 'in_progress'"
        />
        <MoleculeDatePicker
          v-if="
            c.canManage.value &&
            (!c.selectedTask.value ||
              c.selectedTask.value.permissions.manage_metadata)
          "
          v-model="dueDateValue"
          label="Target selesai"
          placeholder="Pilih tanggal target"
          :disabled="c.projectStatus.value !== 'in_progress'"
        />
      </div>

      <MoleculeTextarea
        v-model="c.taskForm.value.description"
        label="Deskripsi task"
        placeholder="Jelaskan konteks dan ruang lingkup pekerjaan..."
        :rows="3"
        :disabled="
          !!c.selectedTask.value &&
          !c.selectedTask.value.permissions.edit_content
        "
      />

      <MoleculeDropdown
        v-if="c.selectedTask.value"
        v-model="c.taskForm.value.status"
        label="Status task"
        :options="selectableStatuses"
        :disabled="c.projectStatus.value !== 'in_progress'"
      />
      <MoleculeTextarea
        v-if="
          c.selectedTask.value &&
          c.taskForm.value.status === 'closed' &&
          c.selectedTask.value.status !== 'closed'
        "
        v-model="c.taskForm.value.closeReason"
        label="Alasan perubahan scope"
        placeholder="Contoh: kebutuhan digabung ke task lain"
        :rows="2"
      />

      <p
        v-if="c.selectedTask.value?.review_summary?.self_review"
        class="rounded-lg bg-warning-50 p-3 font-body-3 text-warning-900"
      >
        Review terakhir dilakukan oleh assignee sendiri (self-review), bukan
        peer review.
      </p>
      <p
        v-if="c.selectedTask.value?.needs_reassignment"
        class="rounded-lg bg-warning-50 p-3 font-body-3 text-warning-900"
      >
        Assignee sebelumnya tidak lagi aktif. Pengelola perlu menetapkan anggota
        aktif sebelum task dikirim untuk ditinjau kembali.
      </p>
      <p
        v-if="c.mutationError.value"
        class="rounded-lg bg-danger-50 p-3 font-body-3 text-danger-800"
        role="alert"
      >
        {{ c.mutationError.value }}
      </p>

      <section
        v-if="c.selectedTask.value"
        class="border-t border-neutral-200 pt-4"
        aria-labelledby="workspace-task-comments-title"
      >
        <div class="flex items-center justify-between">
          <h3
            id="workspace-task-comments-title"
            class="font-label-2 text-secondary-900"
          >
            Komentar task
          </h3>
          <AtomicTag>{{ c.selectedTask.value.comment_count }}</AtomicTag>
        </div>
        <div v-if="c.comments.value.length" class="mt-3 space-y-2">
          <article
            v-for="comment in c.comments.value"
            :key="comment.id"
            class="flex gap-2.5 rounded-lg bg-neutral-50 p-3"
          >
            <AtomicAvatar
              :name="comment.author.name"
              :src="comment.author.avatar ?? undefined"
              :size="'xs'"
            />
            <div class="min-w-0">
              <p class="font-label-3 text-secondary-900">
                {{ comment.author.name }}
                <span class="font-body-3 font-normal text-neutral-500">
                  {{ commentDate(comment.created_at) }}
                </span>
              </p>
              <p
                class="mt-1 whitespace-pre-wrap font-body-3 text-neutral-700"
              >
                {{ comment.body }}
              </p>
            </div>
          </article>
        </div>
        <p v-else class="mt-3 font-body-3 text-neutral-500">
          Belum ada komentar. Tambahkan update atau pertanyaan.
        </p>
        <div class="mt-3 flex items-end gap-2">
          <MoleculeTextarea
            v-model="c.taskForm.value.comment"
            label="Komentar"
            placeholder="Tulis komentar..."
            :rows="2"
            class="min-w-0 flex-1"
            :disabled="c.projectStatus.value !== 'in_progress'"
          />
          <AtomicButton
            variant="outline"
            size="sm"
            :disabled="
              c.projectStatus.value !== 'in_progress' ||
              !c.taskForm.value.comment.trim() ||
              c.sendingComment.value
            "
            :loading="c.sendingComment.value"
            @click="c.sendComment"
          >
            Kirim
          </AtomicButton>
        </div>
        <div
          v-if="
            c.commentsPage.value.page < c.commentsPage.value.totalPages ||
            c.commentsPage.value.error
          "
          class="mt-2"
        >
          <MoleculeLoading
            v-if="c.commentsLoading.value"
            compact
            label="Memuat komentar…"
          />
          <p
            v-else-if="c.commentsPage.value.error"
            class="font-body-3 text-danger-800"
            role="alert"
          >
            {{ c.commentsPage.value.error }}
          </p>
          <AtomicButton
            v-else
            variant="ghost"
            size="sm"
            @click="c.loadMoreComments"
          >
            Muat komentar lainnya
          </AtomicButton>
        </div>
      </section>

      <div
        v-if="c.selectedTask.value?.permissions.delete"
        class="flex justify-end border-t border-neutral-200 pt-3"
      >
        <AtomicButton variant="ghost-danger" size="sm" @click="c.remove">
          Hapus task
        </AtomicButton>
      </div>
    </div>
    <p
      v-else
      class="rounded-lg bg-danger-50 p-3 font-body-3 text-danger-800"
      role="alert"
    >
      {{ c.mutationError.value ?? "Task tidak lagi tersedia." }}
    </p>
  </OrganismModal>
</template>
