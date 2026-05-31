<script setup lang="ts">
import type { Project } from "../../types/project";

const props = defineProps<{
  project: Project;
  pendingApplicantsCount?: number;
}>();

const { startProject } = useProjects();
const toast = useToast();
const starting = ref(false);

const openSlots = computed(() => {
  const memberCount =
    props.project.project_members?.filter((m) => m.role === "contributor")
      .length ?? 0;
  return Math.max(0, props.project.max_slots - memberCount);
});

const memberCount = computed(() => {
  return (
    props.project.project_members?.filter((m) => m.role === "contributor")
      .length ?? 0
  );
});

const isFull = computed(() => memberCount.value >= props.project.max_slots);

const skills = computed(
  () =>
    props.project.project_skills
      ?.map((ps) => ps.skill_tags?.name)
      .filter(Boolean)
      .slice(0, 3) ?? []
);

const extraSkillCount = computed(() => {
  const total = props.project.project_skills?.length ?? 0;
  return total > 3 ? total - 3 : 0;
});

const typeLabel: Record<string, string> = {
  web_app: "Web App",
  mobile_app: "Mobile App",
  ui_ux: "UI/UX",
  backend: "Backend",
  data_analytics: "Data & Analytics",
  devops: "DevOps",
  other: "Lainnya",
};

const handleStartProject = async () => {
  if (starting.value) return;
  starting.value = true;

  try {
    await startProject(props.project.id);
    toast.success("Project berhasil dimulai.");
    await navigateTo(`/projects/${props.project.slug}/workspace`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memulai project.";
    toast.error(message);
  } finally {
    starting.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-md hover:shadow-primary-900/5 sm:p-6"
  >
    <!-- Header -->
    <div>
      <div class="mb-4 flex items-center justify-between gap-3">
        <ProjectStatusBadge :status="project.status" size="sm" />
        <span class="text-caption font-semibold uppercase text-neutral-400">
          {{ typeLabel[project.type] ?? "Lainnya" }}
        </span>
      </div>

      <NuxtLink
        :to="`/projects/${project.slug}`"
        class="text-title text-secondary-900 transition-colors hover:text-primary-700 line-clamp-2"
      >
        {{ project.title }}
      </NuxtLink>

      <p class="mt-2 text-body text-neutral-600 line-clamp-2">
        {{ project.summary }}
      </p>

      <!-- Skills -->
      <div v-if="skills.length > 0" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="skill in skills"
          :key="skill"
          class="rounded-md bg-neutral-50 px-2 py-1 text-caption text-neutral-600 ring-1 ring-inset ring-neutral-200"
        >
          {{ skill }}
        </span>
        <span
          v-if="extraSkillCount > 0"
          class="rounded-md bg-neutral-50 px-2 py-1 text-caption text-neutral-500 ring-1 ring-inset ring-neutral-200"
        >
          +{{ extraSkillCount }}
        </span>
      </div>
    </div>

    <!-- Progress & Footer -->
    <div class="mt-6 border-t border-neutral-100 pt-5">
      <div class="mb-5 grid grid-cols-2 gap-4">
        <!-- Applicants Count -->
        <div class="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p
            class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400"
          >
            Pelamar Baru
          </p>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span
              class="text-xl font-bold"
              :class="
                pendingApplicantsCount && pendingApplicantsCount > 0
                  ? 'text-primary-600'
                  : 'text-secondary-900'
              "
            >
              {{ pendingApplicantsCount || 0 }}
            </span>
            <span class="text-caption font-medium text-neutral-500">Orang</span>
          </div>
        </div>

        <!-- Slot Progress -->
        <div class="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p
            class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400"
          >
            Slot Terisi
          </p>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span
              class="text-xl font-bold"
              :class="isFull ? 'text-success-600' : 'text-secondary-900'"
            >
              {{ memberCount }}
            </span>
            <span class="text-caption font-medium text-neutral-500"
              >/ {{ project.max_slots }}</span
            >
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex flex-col gap-2">
        <template v-if="project.status === 'draft'">
          <NuxtLink :to="`/projects/${project.slug}/edit`" class="w-full">
            <AtomicButton variant="primary" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit & Publikasikan
              </span>
            </AtomicButton>
          </NuxtLink>
          <NuxtLink :to="`/projects/${project.slug}`" class="w-full">
            <AtomicButton variant="outline" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Lihat Detail
              </span>
            </AtomicButton>
          </NuxtLink>
        </template>
        <template v-else-if="project.status === 'open'">
          <AtomicButton
            variant="primary"
            class="w-full"
            :loading="starting"
            :disabled="starting"
            @click="handleStartProject"
          >
            <span class="flex items-center justify-center gap-2">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3l14 9-14 9V3z"
                />
              </svg>
              Start Project
            </span>
          </AtomicButton>

          <NuxtLink :to="`/projects/${project.slug}/applicants`" class="w-full">
            <AtomicButton variant="outline" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Kelola Pelamar
              </span>
            </AtomicButton>
          </NuxtLink>
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink :to="`/projects/${project.slug}/edit`" class="w-full">
              <AtomicButton variant="outline" class="w-full">
                <span class="flex items-center justify-center gap-1.5">
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </span>
              </AtomicButton>
            </NuxtLink>
            <NuxtLink :to="`/projects/${project.slug}`" class="w-full">
              <AtomicButton variant="outline" class="w-full">
                <span class="flex items-center justify-center gap-1.5">
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Lihat
                </span>
              </AtomicButton>
            </NuxtLink>
          </div>
        </template>

        <template v-else-if="project.status === 'in_progress'">
          <NuxtLink :to="`/projects/${project.slug}/workspace`" class="w-full">
            <AtomicButton variant="primary" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-6m4 6V7m4 10v-4M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                  />
                </svg>
                Open Workspace
              </span>
            </AtomicButton>
          </NuxtLink>

          <NuxtLink :to="`/projects/${project.slug}/applicants`" class="w-full">
            <AtomicButton variant="outline" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Kelola Pelamar
              </span>
            </AtomicButton>
          </NuxtLink>

          <div class="grid grid-cols-2 gap-2">
            <NuxtLink :to="`/projects/${project.slug}/edit`" class="w-full">
              <AtomicButton variant="outline" class="w-full">
                <span class="flex items-center justify-center gap-1.5">
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </span>
              </AtomicButton>
            </NuxtLink>
            <NuxtLink :to="`/projects/${project.slug}`" class="w-full">
              <AtomicButton variant="outline" class="w-full">
                <span class="flex items-center justify-center gap-1.5">
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Lihat
                </span>
              </AtomicButton>
            </NuxtLink>
          </div>
        </template>
        <template v-else>
          <NuxtLink :to="`/projects/${project.slug}`" class="w-full">
            <AtomicButton variant="outline" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Lihat Detail
              </span>
            </AtomicButton>
          </NuxtLink>
          <NuxtLink :to="`/projects/${project.slug}/edit`" class="w-full">
            <AtomicButton variant="outline" class="w-full">
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </span>
            </AtomicButton>
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>
