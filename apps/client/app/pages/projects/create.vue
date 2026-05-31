<script setup lang="ts">
import type { CreateProjectPayload } from "~/types/project";

definePageMeta({ layout: "home", middleware: ["auth", "onboarding-guard"] });
useHead({ title: "Buat Project — Kolaboria" });

const { createProject, publishProject, getSkillTags } = useProjects();
const { getProfile } = useProfile();
const { isVerified } = useAuth();
const router = useRouter();

const currentStep = ref(1);
const totalSteps = 4;
const isSubmitting = ref(false);
const submitError = ref("");

const stepperSteps = [
  { title: "Informasi Dasar", description: "Isi detail utama project" },
  { title: "Kebutuhan & Skill", description: "Tentukan kontributor" },
  { title: "Timeline & Komitmen", description: "Jadwal dan komitmen" },
  { title: "Review & Simpan", description: "Tinjau kembali project" },
];

// Load data awal
const profile = ref<any>(null);
const skillTags = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  const [p, tags] = await Promise.all([getProfile(), getSkillTags()]);
  profile.value = p;
  skillTags.value = tags;
});

const canPublish = computed(() => (profile.value?.completion_score ?? 0) >= 50);

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

const stepValid = computed(() => {
  if (currentStep.value === 1)
    return form.title.trim().length > 0 && form.summary.trim().length > 0;
  if (currentStep.value === 2) return true;
  if (currentStep.value === 3) return true;
  return true;
});

const goNext = () => {
  if (stepValid.value && currentStep.value < totalSteps) currentStep.value++;
};
const goBack = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const saveDraft = async () => {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    const project = await createProject(form);
    router.push(`/projects/${project.id}`);
  } catch (e: any) {
    submitError.value = e?.message || "Gagal menyimpan draft.";
  } finally {
    isSubmitting.value = false;
  }
};

const saveAndPublish = async () => {
  if (!canPublish.value) {
    submitError.value =
      "Completion score kamu belum mencapai 50%. Lengkapi profil terlebih dahulu.";
    return;
  }
  isSubmitting.value = true;
  submitError.value = "";
  try {
    const project = await createProject(form);
    await publishProject(project.id);
    router.push(`/projects/${project.id}`);
  } catch (e: any) {
    submitError.value = e?.message || "Gagal mempublikasikan project.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="mx-auto w-full max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink
        to="/projects"
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
        Kembali ke Project
      </NuxtLink>
      <h1 class="text-heading text-secondary-900">Buat Project Baru</h1>
      <p class="mt-2 text-body text-neutral-600">
        Isi detail project dan ajak talenta lain untuk berkolaborasi.
      </p>
    </div>

    <!-- Two-column Layout -->
    <div v-if="!isVerified" class="mt-8">
      <OrganismCard variant="outlined" class="text-center p-12">
        <h2 class="text-title text-secondary-900 mb-2">Verifikasi Email Diperlukan</h2>
        <p class="text-body text-neutral-600 mb-6">
          Anda harus memverifikasi email Anda terlebih dahulu sebelum dapat membuat proyek baru. Silakan periksa inbox Anda atau minta tautan verifikasi baru dari halaman utama.
        </p>
        <NuxtLink to="/home">
          <AtomicButton variant="primary">Kembali ke Beranda</AtomicButton>
        </NuxtLink>
      </OrganismCard>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Stepper -->
      <div class="lg:w-64 flex-shrink-0">
        <OrganismContentList
          :model-value="currentStep - 1"
          :items="
            stepperSteps.map((s, i) => ({
              label: s.title,
              description: s.description,
              completed: i < currentStep - 1,
            }))
          "
          mode="stepper"
          @update:model-value="
            (val) => {
              if (val < currentStep) currentStep = val + 1;
            }
          "
        />
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Step 1: Info Dasar -->
        <ProjectCreateStep1Info v-if="currentStep === 1" v-model:form="form" />

        <!-- Step 2: Skill & Kebutuhan -->
        <ProjectCreateStep2Requirements
          v-else-if="currentStep === 2"
          v-model:form="form"
          :skill-tags="skillTags"
        />

        <!-- Step 3: Timeline -->
        <ProjectCreateStep3Timeline
          v-else-if="currentStep === 3"
          v-model:form="form"
        />

        <!-- Step 4: Review -->
        <ProjectCreateStep4Review
          v-else
          v-model:form="form"
          :profile="profile"
          :can-publish="canPublish"
          :submit-error="submitError"
          :is-submitting="isSubmitting"
          @save-draft="saveDraft"
          @save-and-publish="saveAndPublish"
        />

        <!-- Navigation -->
        <div class="mt-5 flex gap-4 justify-end">
          <AtomicButton
            v-if="currentStep > 1"
            variant="outline"
            @click="goBack"
          >
            Kembali
          </AtomicButton>
          <div v-else />
          <AtomicButton
            v-if="currentStep < totalSteps"
            variant="primary"
            :disabled="!stepValid"
            @click="goNext"
          >
            Lanjut
          </AtomicButton>
        </div>
      </div>
    </div>
  </div>
</template>
