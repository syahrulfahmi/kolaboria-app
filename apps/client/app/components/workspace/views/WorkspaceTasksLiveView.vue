<script setup lang="ts">
import { Search, X } from "@lucide/vue";
import WorkspaceTaskLiveColumn from "./WorkspaceTaskLiveColumn.vue";
import WorkspaceTaskModal from "../dialogs/WorkspaceTaskModal.vue";
import type { createWorkspaceTasksController } from "~/composables/useWorkspaceTasks";

const props = defineProps<{
  controller: ReturnType<typeof createWorkspaceTasksController>;
}>();
const c = props.controller;
const columns = c.visibleColumns;
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col gap-2 sm:gap-4">
    <div class="flex shrink-0 flex-wrap items-end justify-between gap-2">
      <div class="min-w-0">
        <p
          v-if="c.projectTitle.value"
          class="truncate font-label-3 uppercase tracking-[0.1em] text-primary-700"
        >
          {{ c.projectTitle.value }}
        </p>
        <h2 class="mt-1 font-title-2 text-secondary-900">Tugas proyek</h2>
      </div>
      <AtomicTag v-if="c.projectStatus.value">{{
        c.projectStatus.value === "in_progress" ? "Berjalan" : "Hanya baca"
      }}</AtomicTag>
    </div>
    <p v-if="c.projectStatus.value === 'completed'" class="shrink-0 rounded-lg bg-success-50 px-3 py-2 font-body-3 text-success-800">
      Proyek telah selesai. Task dan komentar tersimpan sebagai riwayat dan hanya dapat dibaca.
      <NuxtLink :to="`/projects/${encodeURIComponent(c.info.value?.project.slug ?? '')}/workspace/info`" class="font-semibold underline underline-offset-2">Lihat penutupan proyek</NuxtLink>
    </p>
    <div
      class="grid shrink-0 grid-cols-1 gap-2 rounded-xl border border-neutral-200 bg-white p-2 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:p-4"
    >
      <div
        class="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2"
        role="group"
        aria-label="Filter task"
      >
        <button
          v-for="item in [
            { value: 'all', label: 'Semua' },
            { value: 'mine', label: 'Tugas saya' },
            { value: 'review', label: 'Perlu review' },
          ] as const"
          :key="item.value"
          type="button"
          class="shrink-0 rounded-lg border px-2.5 py-1.5 font-label-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:px-3 sm:py-2"
          :class="
            c.filter.value === item.value
              ? 'border-primary-300 bg-primary-50 text-primary-800'
              : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          "
          :aria-pressed="c.filter.value === item.value"
          @click="c.changeFilter(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
      <div
        class="flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto sm:flex-1 sm:justify-end"
      >
        <span
          class="hidden shrink-0 font-body-3 text-neutral-500 sm:inline"
          aria-hidden="true"
          >Anggota</span
        >
        <span
          class="hidden h-7 shrink-0 border-l border-neutral-200 sm:block"
          aria-hidden="true"
        />
        <div
          class="flex max-w-full shrink-0 flex-wrap items-center gap-y-1 pl-2 sm:max-w-[45vw]"
          role="group"
          aria-label="Filter task berdasarkan anggota"
        >
          <button
            v-for="member in c.members.value"
            :key="member.id"
            type="button"
            class="relative -ml-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white first:ml-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="
              c.assigneeFilter.value === member.id
                ? 'border-primary-600 ring-2 ring-primary-300 shadow-md'
                : ''
            "
            :aria-label="`Filter task: ${member.name}`"
            :aria-pressed="c.assigneeFilter.value === member.id"
            :title="member.name"
            @click="c.setAssigneeFilter(member.id)"
          >
            <AtomicAvatar
              :name="member.name"
              :src="member.avatar ?? undefined"
              :size="'sm'"
            />
          </button>
        </div>
        <MoleculeLoading
          v-if="c.membersLoading.value"
          compact
          label="Memuat anggota…"
        />
        <span
          v-else-if="c.membersError.value"
          class="flex max-w-full shrink-0 items-center gap-1 font-body-3 text-danger-700"
          role="alert"
          ><span class="max-w-40 truncate" :title="c.membersError.value"
            >Anggota gagal dimuat</span
          ><button
            type="button"
            class="shrink-0 underline"
            @click="c.loadMembers()"
          >
            Coba lagi
          </button></span
        >
        <span
          v-else-if="!c.members.value.length"
          class="shrink-0 font-body-3 text-neutral-500"
          >Belum ada anggota</span
        >
        <button
          v-if="c.assigneeFilter.value"
          type="button"
          class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"
          aria-label="Hapus filter anggota"
          @click="c.setAssigneeFilter(null)"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
        <div class="relative min-w-0 flex-1 sm:max-w-[260px]">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            :value="c.query.value"
            type="search"
            aria-label="Cari task"
            placeholder="Cari task..."
            class="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 font-body-3 text-secondary-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            @input="c.setSearch(($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
      <AtomicButton
        v-if="c.canCreate.value && c.projectStatus.value === 'in_progress'"
        variant="primary"
        size="sm"
        @click="c.openCreate"
        >Buat task</AtomicButton
      >
    </div>

    <p
      v-if="c.error.value"
      class="rounded-lg bg-danger-50 p-3 font-body-3 text-danger-800"
      role="alert"
    >
      {{ c.error.value }}
      <button type="button" class="underline" @click="c.loadBoard">
        Coba muat ulang
      </button>
    </p>
    <MoleculeLoading
      v-if="c.loading.value && !c.tasks.value.todo.length"
      label="Memuat task proyek…"
    />
    <div
      v-else
      class="-mx-4 min-h-0 flex-1 overflow-auto px-4 pb-2 sm:mx-0 sm:px-0"
      aria-label="Board Kanban, gulir untuk melihat seluruh task"
    >
      <div
        class="grid min-h-full min-w-[1280px] auto-rows-max grid-cols-5 gap-3"
      >
        <WorkspaceTaskLiveColumn
          v-for="column in columns"
          :key="column.status"
          :status="column.status"
          :title="column.label"
          :tasks="column.tasks"
          :total="column.total"
          :can-load-more="column.canLoadMore"
          :loading="column.loadingMore"
          :error="column.error"
          @open="c.openTask"
          @move="c.changeStatus"
          @load-more="c.loadMore(column.status)"
          @retry="c.loadBoard"
        />
      </div>
    </div>
    <p class="hidden shrink-0 font-body-3 text-neutral-500 sm:block">
      Seret kartu langsung ke status yang diizinkan; kamu dapat melewati kolom
      perantara.
    </p>

    <WorkspaceTaskModal :controller="c" />
    <p
      v-if="c.notice.value"
      class="fixed bottom-6 right-6 z-50 rounded-lg bg-secondary-800 px-4 py-3 font-body-2 text-white shadow-lg"
      role="status"
    >
      {{ c.notice.value }}
    </p>
  </section>
</template>
