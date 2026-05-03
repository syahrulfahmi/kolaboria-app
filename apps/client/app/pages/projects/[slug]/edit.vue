<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  Project,
  CreateProjectPayload,
  ProjectStatus,
} from "~/types/project";

import EditTabInfo from "~/components/project/edit/EditTabInfo.vue";
import EditTabRequirements from "~/components/project/edit/EditTabRequirements.vue";
import EditTabTimeline from "~/components/project/edit/EditTabTimeline.vue";
import EditTabStatus from "~/components/project/edit/EditTabStatus.vue";
import ProjectStatusConfirmModal from "~/components/project/ProjectStatusConfirmModal.vue";

definePageMeta({ layout: "home", middleware: "auth" });

const route = useRoute();
const router = useRouter();
const {
  getProjectBySlug,
  updateProjectFull,
  updateProjectStatus,
  publishProject,
  getSkillTags,
  getProjectApplicants,
} = useProjects();
const user = useSupabaseUser();
const { add: addToast } = useToast();

const projectSlug = route.params.slug as string;
const project = ref<Project | null>(null);
const skillTags = ref<{ id: string; name: string }[]>([]);
const pending = ref(true);
const isSubmitting = ref(false);

// Tab state
const activeTab = ref(0);
const tabs = [
  { label: "Informasi Dasar" },
  { label: "Kebutuhan & Skill" },
  { label: "Timeline" },
  { label: "Status & Publikasi" },
];

// Form state
const form = reactive<CreateProjectPayload>({
  title: "",
  summary: "",
  description: "",
  type: "web_app",
  visibility: "public",
  max_slots: 3,
  start_date: undefined,
  deadline: undefined,
  tech_stack: [],
  why_join: "",
  skill_tag_ids: [],
});

// Modal state
const showConfirmModal = ref(false);
const confirmAction = ref<"open" | "archived" | "completed" | "in_progress">(
  "open",
);
const hasActiveApplicants = ref(false);

onMounted(async () => {
  try {
    const [p, tags] = await Promise.all([
      getProjectBySlug(projectSlug),
      getSkillTags(),
    ]);

    if (!p) {
      addToast({ variant: "danger", message: "Project tidak ditemukan." });
      router.push("/projects");
      return;
    }

    if (!user.value || user.value.id !== p.creator_id) {
      addToast({
        variant: "danger",
        message: "Anda tidak memiliki akses untuk mengedit project ini.",
      });
      router.push(`/projects/${projectSlug}`);
      return;
    }

    project.value = p;
    skillTags.value = tags;

    // Init form
    form.title = p.title;
    form.summary = p.summary;
    form.description = p.description || "";
    form.type = p.type;
    form.visibility = p.visibility;
    form.max_slots = p.max_slots;
    form.start_date = p.start_date;
    form.deadline = p.deadline;
    form.tech_stack = p.tech_stack || [];
    form.why_join = p.why_join || "";
    form.skill_tag_ids = p.project_skills?.map((s) => s.skill_tag_id) || [];

    // Check active applicants for archive warning
    if (p.status !== "draft" && p.status !== "archived") {
      const applicants = await getProjectApplicants(p.id);
      hasActiveApplicants.value = applicants.some(
        (a) => a.status === "pending" || a.status === "accepted",
      );
    }
  } catch (error: any) {
    addToast({
      variant: "danger",
      message: error.message || "Gagal memuat project.",
    });
  } finally {
    pending.value = false;
  }
});

useHead({
  title: computed(() =>
    project.value
      ? `Edit ${project.value.title} - Kolaboria`
      : "Edit Project - Kolaboria",
  ),
});

const handleSave = async () => {
  if (!project.value) return;
  isSubmitting.value = true;

  try {
    await updateProjectFull(project.value.id, form);

    // Update local project state to reflect changes without full reload
    project.value = { ...project.value, ...form } as unknown as Project;

    if (project.value.status === "draft") {
      addToast({
        variant: "warning",
        message:
          "Perubahanmu tersimpan, tapi project belum bisa dilihat publik karena masih Draft. Publikasikan untuk membuatnya aktif.",
      });
    } else {
      addToast({ variant: "success", message: "Perubahan berhasil disimpan!" });
    }
  } catch (error: any) {
    addToast({
      variant: "danger",
      message: error.message || "Gagal menyimpan perubahan.",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const triggerStatusAction = (
  action: "open" | "archived" | "completed" | "in_progress",
) => {
  console.log(action);
  confirmAction.value = action;
  showConfirmModal.value = true;
};

const handleStatusConfirm = async () => {
  if (!project.value) return;
  isSubmitting.value = true;
  showConfirmModal.value = false;

  try {
    if (confirmAction.value === "open") {
      // Pastikan data terakhir tersimpan sebelum publish
      await updateProjectFull(project.value.id, form);
      await publishProject(project.value.id);
      addToast({
        variant: "success",
        message: "Project berhasil dipublikasikan!",
      });
      router.push(`/projects/${project.value.slug}`);
    } else {
      await updateProjectStatus(project.value.id, confirmAction?.value);
      addToast({
        variant: "success",
        message: "Status project berhasil diperbarui!",
      });
      router.push("/projects/my-projects");
    }
  } catch (error: any) {
    addToast({
      variant: "danger",
      message: error.message || "Gagal memperbarui status.",
    });
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div
      v-if="pending"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <MoleculeLoading text="Memuat data project..." />
    </div>

    <div
      v-else-if="project"
      class="mx-auto w-full max-w-5xl py-8 px-4 sm:px-6 lg:px-8"
    >
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          :to="`/projects/${project.slug}`"
          class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-800"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Detail Project
        </NuxtLink>
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 class="text-heading text-secondary-900">Edit Project</h1>
            <p class="mt-2 text-body text-neutral-600">
              Perbarui informasi atau kelola status project
              <span class="font-bold text-secondary-900">{{
                project.title
              }}</span
              >.
            </p>
          </div>
          <ProjectStatusBadge :status="project.status" />
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:w-64 flex-shrink-0">
          <OrganismContentList v-model="activeTab" :items="tabs" mode="free" />
        </div>

        <!-- Main Content Form -->
        <div class="flex-1">
          <OrganismCard
            variant="elevated"
            class="border-0 shadow-lg shadow-neutral-200/50 p-6 sm:p-8"
          >
            <div class="mb-6 border-b border-neutral-100 pb-5">
              <h2 class="text-xl font-bold text-secondary-900">
                {{ tabs[activeTab].label }}
              </h2>
            </div>

            <!-- Tabs Content -->
            <KeepAlive>
              <EditTabInfo
                v-if="activeTab === 0"
                v-model:form="form"
                @save="handleSave"
              />
              <EditTabRequirements
                v-else-if="activeTab === 1"
                v-model:form="form"
                :skill-tags="skillTags"
                @save="handleSave"
              />
              <EditTabTimeline
                v-else-if="activeTab === 2"
                v-model:form="form"
                @save="handleSave"
              />
              <EditTabStatus
                v-else-if="activeTab === 3"
                :status="project.status"
                :is-submitting="isSubmitting"
                @action="triggerStatusAction"
              />
            </KeepAlive>
          </OrganismCard>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ProjectStatusConfirmModal
      :show="showConfirmModal"
      :action="confirmAction"
      :project-title="project?.title || ''"
      :has-active-applicants="hasActiveApplicants"
      @close="showConfirmModal = false"
      @confirm="handleStatusConfirm"
    />
  </div>
</template>
