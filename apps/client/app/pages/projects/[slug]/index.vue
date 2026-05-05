<template>
  <div class="min-h-screen bg-gray-50 pb-24 lg:pb-0" ref="pageRoot">
    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex flex-col items-center justify-center min-h-screen"
    >
      <div
        class="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-500 font-medium text-center">
        Memuat detail proyek...
      </p>
    </div>

    <!-- Error / Not Found -->
    <div
      v-else-if="error || !project"
      class="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div class="text-6xl mb-6">🔍</div>
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">
        Proyek Tidak Ditemukan
      </h1>
      <p class="text-gray-600 mb-8">
        Proyek yang kamu cari nggak ada atau terjadi kesalahan.
      </p>
      <AtomicButton variant="primary" to="/projects">
        Kembali ke Proyek
      </AtomicButton>
    </div>

    <!-- Project Detail -->
    <div v-else>
      <!-- Draft Banner -->
      <div
        v-if="project.status === 'draft' && isOwner"
        class="mx-auto max-w-7xl pb-4"
      >
        <MoleculeTicker
          variant="warning"
          message="Project ini masih Draft — belum bisa dilihat publik."
          :closable="false"
          @action-click="navigateTo(`/projects/${project.slug}/edit`)"
          action-label="Edit & Publikasikan"
        />
      </div>

      <section
        ref="heroSection"
        class="relative text-white overflow-hidden w-full"
      >
        <div
          class="absolute inset-0"
          style="
            background: linear-gradient(
              160deg,
              #0f1f35 0%,
              #152846 35%,
              #1a4a6e 68%,
              #1d7a9c 100%
            );
          "
          aria-hidden="true"
        ></div>

        <!-- Right-side accent glow -->
        <div
          class="absolute inset-0 pointer-events-none"
          style="
            background:
              radial-gradient(
                ellipse 55% 70% at 95% 50%,
                rgba(74, 184, 224, 0.22) 0%,
                transparent 65%
              ),
              radial-gradient(
                ellipse 40% 40% at 5% 100%,
                rgba(255, 176, 32, 0.08) 0%,
                transparent 55%
              );
          "
          aria-hidden="true"
        ></div>

        <!-- Aurora subtle effects -->
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div class="k-aurora-1 opacity-25 mix-blend-overlay"></div>
          <div class="k-aurora-2 opacity-20 mix-blend-overlay"></div>
        </div>

        <!-- Fine line grid texture -->
        <div
          class="absolute inset-0 pointer-events-none"
          style="
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
              );
            background-size: 48px 48px;
          "
          aria-hidden="true"
        ></div>

        <div
          class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28"
        >
          <div
            class="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16"
          >
            <!-- LEFT: Text content —— takes most of the width -->
            <div class="flex-1 min-w-0">
              <!-- Pill breadcrumb -->
              <div class="flex items-center gap-2.5 mb-7">
                <NuxtLink
                  to="/projects"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/60 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-primary-300"></span>
                  Proyek Kolaborasi
                </NuxtLink>
                <span class="text-white/20 text-xs">·</span>
                <span
                  class="text-primary-300 text-xs font-semibold tracking-wider uppercase"
                >
                  {{ coverLabel }}
                </span>
              </div>

              <!-- Title -->
              <h1
                class="text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.08] tracking-tight text-white mb-5"
              >
                {{ project.title }}
              </h1>

              <!-- Status row -->
              <div class="flex flex-wrap items-center gap-3 mb-7">
                <ProjectStatusBadge :status="project.status" />
                <div class="flex items-center gap-2 ml-2">
                  <div
                    class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/90 uppercase"
                  >
                    {{ creatorInitial }}
                  </div>
                  <span class="text-white/60 text-sm font-medium">Oleh</span>
                  <NuxtLink
                    v-if="creatorUsername"
                    :to="`/profile/${creatorUsername}`"
                    class="text-white/80 hover:text-white transition-colors text-sm font-medium"
                  >
                    {{ creatorName }}
                  </NuxtLink>
                  <span v-else class="text-white/80 text-sm font-medium">{{
                    creatorName
                  }}</span>
                </div>
              </div>

              <!-- Description -->
              <p
                class="font-paragraph-lg text-white/65 leading-[1.85] text-[1rem] max-w-2xl"
              >
                {{ project.summary }}
              </p>

              <!-- Inline stat chips -->
              <div class="flex flex-wrap items-center gap-3 mt-8">
                <div
                  v-for="(stat, i) in heroStats"
                  :key="i"
                  class="flex items-center gap-2.5 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 hover:bg-white/12 transition-colors duration-300 group"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center border border-white/8 group-hover:bg-white/15 transition-all duration-300"
                  >
                    <svg v-bind="stat.iconAttrs" class="w-4 h-4 text-white/70">
                      <path v-bind="stat.pathAttrs" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-lg font-black text-white leading-none">
                      {{ stat.value }}
                    </div>
                    <div
                      class="text-[10px] text-white/45 font-semibold tracking-wider uppercase mt-0.5"
                    >
                      {{ stat.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Smooth transition to page background -->
        <div
          class="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
            class="w-full h-full"
          >
            <path
              d="M0 80L1440 80L1440 24C1080 72 720 80 360 56C240 48 120 32 0 40L0 80Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      <section class="max-w-7xl mx-auto pt-12 pb-32 px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <!-- Left: Content Column -->
          <div class="lg:col-span-8 flex flex-col gap-16">
            <!-- ─── SECTION: About ─── -->
            <section id="section-about" ref="sectionAbout" class="scroll-mt-20">
              <div class="flex items-center gap-2 mb-5">
                <span
                  class="w-1 h-4 rounded-full bg-primary-400 flex-shrink-0"
                ></span>
                <h2
                  class="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase"
                >
                  Deskripsi Proyek
                </h2>
              </div>
              <div class="space-y-5">
                <p
                  v-for="(paragraph, idx) in descriptionParagraphs"
                  :key="idx"
                  class="text-gray-700 leading-[1.85] text-[0.975rem]"
                >
                  {{ paragraph }}
                </p>
                <p
                  v-if="descriptionParagraphs.length === 0"
                  class="text-gray-700 leading-[1.85] text-[0.975rem]"
                >
                  {{ project.summary }}
                </p>
              </div>
            </section>

            <hr class="border-gray-200" />

            <!-- ─── SECTION: Requirements ─── -->
            <section
              id="section-requirements"
              ref="sectionRequirements"
              class="scroll-mt-20"
            >
              <div class="flex items-center gap-2 mb-6">
                <span
                  class="w-1 h-4 rounded-full bg-secondary-400 flex-shrink-0"
                ></span>
                <h2
                  class="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase"
                >
                  Persyaratan
                </h2>
              </div>

              <div class="space-y-7">
                <!-- Skills -->
                <div>
                  <p
                    class="font-label-sm text-gray-500 mb-3 text-sm font-medium"
                  >
                    Keterampilan
                  </p>
                  <div
                    v-if="
                      requiredSkills.length > 0 || optionalSkills.length > 0
                    "
                    class="flex flex-wrap gap-2"
                  >
                    <span
                      v-for="skill in requiredSkills"
                      :key="skill.skill_tag_id"
                      class="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 text-sm font-medium rounded-md"
                    >
                      {{ skill.skill_tags.name }}
                    </span>
                    <span
                      v-for="skill in optionalSkills"
                      :key="skill.skill_tag_id"
                      class="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 text-sm font-medium rounded-md"
                    >
                      {{ skill.skill_tags.name }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-sm italic">
                    Tidak ditentukan
                  </span>
                </div>

                <!-- Category + Capacity inline -->
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <p
                      class="font-label-sm text-gray-500 mb-1.5 text-sm font-medium"
                    >
                      Kategori Project
                    </p>
                    <p class="text-gray-900 font-semibold text-base">
                      {{ coverLabel }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="font-label-sm text-gray-500 mb-1.5 text-sm font-medium"
                    >
                      Kapasitas Tim
                    </p>
                    <p class="text-gray-900 font-semibold text-base">
                      {{ members.length }} / {{ project.max_slots }} kontributor
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr class="border-gray-200" />

            <!-- ─── SECTION: Timeline ─── -->
            <section
              id="section-timeline"
              ref="sectionTimeline"
              class="scroll-mt-20"
            >
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                  <span
                    class="w-1 h-4 rounded-full bg-accent-400 flex-shrink-0"
                  ></span>
                  <h2
                    class="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase"
                  >
                    Timeline
                  </h2>
                </div>
                <span
                  class="flex items-center gap-1.5 text-xs font-semibold text-green-600"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-green-500"
                    :class="project.status === 'open' ? 'animate-pulse' : ''"
                  ></span>
                  {{ timelineStatusLabel }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p
                    class="font-label-sm text-gray-500 mb-1.5 text-sm font-medium"
                  >
                    Tanggal Mulai
                  </p>
                  <p class="text-gray-900 font-semibold text-base">
                    {{ formattedStartDate || 'Fleksibel' }}
                  </p>
                </div>
                <div>
                  <p
                    class="font-label-sm text-gray-500 mb-1.5 text-sm font-medium"
                  >
                    Durasi
                  </p>
                  <p class="text-gray-900 font-semibold text-base">
                    {{ projectDurationLabel }}
                  </p>
                </div>
                <div>
                  <p
                    class="font-label-sm text-gray-500 mb-1.5 text-sm font-medium"
                  >
                    Sistem
                  </p>
                  <p class="text-gray-900 font-semibold text-base">
                    {{ coverLabel }}
                  </p>
                </div>
              </div>
            </section>

            <!-- ─── SECTION: Why Join (optional) ─── -->
            <template v-if="project.why_join">
              <hr class="border-gray-200" />
              <section id="section-why-join" class="scroll-mt-20">
                <div class="flex items-center gap-2 mb-5">
                  <span
                    class="w-1 h-4 rounded-full bg-accent-400 flex-shrink-0"
                  ></span>
                  <h2
                    class="text-xs font-bold text-accent-600 tracking-[0.15em] uppercase"
                  >
                    Kenapa Bergabung
                  </h2>
                </div>
                <p
                  class="text-gray-700 leading-[1.85] text-[0.975rem] whitespace-pre-line"
                >
                  {{ project.why_join }}
                </p>
              </section>
            </template>

            <!-- ─── SECTION: Team ─── -->
            <hr class="border-gray-200" />
            <section id="section-team" ref="sectionTeam" class="scroll-mt-20">
              <div class="flex items-center gap-2 mb-6">
                <span
                  class="w-1 h-4 rounded-full bg-gray-300 flex-shrink-0"
                ></span>
                <h2
                  class="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase"
                >
                  Tim Proyek
                </h2>
              </div>

              <div v-if="members.length > 0" class="space-y-4">
                <div
                  v-for="member in members"
                  :key="member.profile_id"
                  class="flex items-center gap-3"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700"
                  >
                    {{
                      (
                        member.profiles?.full_name ||
                        member.profiles?.username ||
                        '?'
                      )
                        .charAt(0)
                        .toUpperCase()
                    }}
                  </div>
                  <div class="min-w-0">
                    <NuxtLink
                      :to="`/profile/${member.profiles?.username}`"
                      class="block truncate font-semibold text-gray-900 text-sm leading-tight hover:text-primary-600 transition-colors"
                    >
                      {{
                        member.profiles?.full_name || member.profiles?.username
                      }}
                    </NuxtLink>
                    <div class="text-xs text-gray-500">Kontributor</div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500 italic">
                Belum ada anggota yang bergabung.
              </p>
            </section>
          </div>

          <!-- Right: Sidebar (desktop only) -->
          <div class="lg:col-span-4 hidden lg:block">
            <div class="sticky top-20 space-y-8">
              <!-- Apply CTA Card -->
              <div
                class="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(74,184,224,0.12)] relative group"
                style="
                  background: linear-gradient(
                    155deg,
                    #1c2e4a 0%,
                    #1a6b8a 60%,
                    #4ab8e0 100%
                  );
                "
              >
                <div
                  class="absolute inset-0 pointer-events-none opacity-20"
                  style="
                    background-image: radial-gradient(
                      rgba(255, 255, 255, 0.5) 1px,
                      transparent 1px
                    );
                    background-size: 20px 20px;
                  "
                ></div>
                <div class="relative z-10 p-7">
                  <h3 class="font-black text-2xl text-white mb-2">
                    Siap Bergabung?
                  </h3>
                  <p class="text-white/80 leading-relaxed mb-6 text-sm">
                    Kolaborasi bersama
                    <span class="text-white font-semibold">{{
                      creatorName
                    }}</span>
                    dan mulai kontribusi di project ini.
                  </p>

                  <div class="grid grid-cols-2 gap-3 mb-6">
                    <div
                      class="bg-white/10 rounded-xl p-3 border border-white/10"
                    >
                      <p class="text-xs text-white/60 mb-0.5">Slot Tersedia</p>
                      <p class="text-lg font-bold text-white">
                        {{ openSlots }}
                      </p>
                    </div>
                    <div
                      class="bg-white/10 rounded-xl p-3 border border-white/10"
                    >
                      <p class="text-xs text-white/60 mb-0.5">Deadline</p>
                      <p class="text-sm font-semibold text-white truncate">
                        {{ formattedDeadline || 'Fleksibel' }}
                      </p>
                    </div>
                  </div>

                  <!-- CTAs -->
                  <template v-if="!user">
                    <NuxtLink to="/login">
                      <AtomicButton variant="primary">
                        Login untuk Melamar
                      </AtomicButton>
                    </NuxtLink>
                  </template>

                  <template v-else-if="isOwner">
                    <div class="flex flex-col gap-3">
                      <NuxtLink :to="`/projects/${project.slug}/applicants`">
                        <AtomicButton variant="primary" size="lg" block>
                          Kelola Pelamar
                        </AtomicButton>
                      </NuxtLink>
                      <NuxtLink :to="`/projects/${project.slug}/edit`">
                        <AtomicButton variant="secondary" size="lg" block>
                          Edit Project
                        </AtomicButton>
                      </NuxtLink>
                    </div>
                  </template>

                  <template
                    v-else-if="currentApplication && applicationMessage"
                  >
                    <div
                      class="rounded-xl border border-primary-300/30 bg-primary-900/40 p-4 mb-4 backdrop-blur-sm"
                    >
                      <p class="text-sm font-semibold text-primary-100">
                        {{ applicationMessage.title }}
                      </p>
                      <p class="mt-1 text-xs text-white/70">
                        {{ applicationMessage.body }}
                      </p>
                    </div>
                    <NuxtLink to="/projects/my-applications">
                      <AtomicButton variant="primary" size="lg" block>
                        Lihat Lamaran Saya
                      </AtomicButton>
                    </NuxtLink>
                  </template>

                  <template v-else-if="canApply">
                    <AtomicButton
                      variant="primary"
                      @click="showApplyModal = true"
                      class="w-full"
                    >
                      Apply Project Ini
                    </AtomicButton>
                  </template>

                  <template v-else>
                    <div
                      class="rounded-xl border border-white/20 bg-black/20 p-4 backdrop-blur-sm"
                    >
                      <p class="text-sm font-medium text-white text-center">
                        {{
                          openSlots === 0
                            ? 'Slot untuk project ini sudah penuh.'
                            : 'Project ini belum membuka lamaran baru.'
                        }}
                      </p>
                    </div>
                  </template>

                  <div
                    class="flex items-center gap-3 mt-6 pt-5 border-t border-white/10"
                  >
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 rounded-full bg-white/20 border-2 border-[#1c2e4a] flex items-center justify-center text-xs font-bold text-white shadow-sm"
                        title="Pembuat Project"
                      >
                        {{ creatorInitial }}
                      </div>
                      <div
                        class="w-8 h-8 rounded-full bg-accent-400/80 border-2 border-[#1c2e4a] flex items-center justify-center text-xs font-bold text-white shadow-sm"
                        title="Kontributor Terisi"
                      >
                        {{ members.length }}
                      </div>
                      <div
                        class="w-8 h-8 rounded-full bg-primary-300/60 border-2 border-[#1c2e4a] flex items-center justify-center text-xs font-bold text-white shadow-sm"
                        title="Slot Tersedia"
                      >
                        +{{ openSlots }}
                      </div>
                    </div>
                    <p class="text-white/70 text-xs font-medium">
                      <span class="text-white font-bold">{{
                        members.length
                      }}</span>
                      kontributor aktif
                    </p>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="contentTags.length > 0" class="px-1">
                <h3
                  class="font-label-sm text-gray-400 mb-4 tracking-[0.1em] uppercase text-xs font-bold"
                >
                  Tag
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in contentTags"
                    :key="tag"
                    class="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =============================================
           STICKY BOTTOM CTA BAR (mobile + all)
      ============================================= -->
      <div
        class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 lg:hidden"
        :class="
          showStickyBar
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        "
      >
        <div
          class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 justify-between"
        >
          <div class="min-w-0 flex-1">
            <div class="font-bold text-gray-900 text-sm leading-tight truncate">
              {{ project.title }}
            </div>
            <div class="text-xs text-gray-500 mt-0.5">
              <span
                class="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1"
              ></span>
              {{ openSlots }} slot tersedia
            </div>
          </div>
          <div class="flex items-center ml-auto flex-shrink-0">
            <template v-if="!user">
              <AtomicButton
                to="/login"
                variant="primary"
                size="sm"
                class="font-bold shrink-0"
              >
                Login
              </AtomicButton>
            </template>

            <template v-else-if="isOwner">
              <div class="flex items-center gap-2">
                <AtomicButton
                  :to="`/projects/${project.slug}/edit`"
                  variant="outline"
                  size="sm"
                  class="font-bold shrink-0"
                >
                  Edit
                </AtomicButton>
                <AtomicButton
                  :to="`/projects/${project.slug}/applicants`"
                  variant="primary"
                  size="sm"
                  class="font-bold shrink-0"
                >
                  Kelola Pelamar
                </AtomicButton>
              </div>
            </template>

            <template v-else-if="currentApplication">
              <AtomicButton
                to="/projects/my-applications"
                variant="primary"
                size="sm"
                class="font-bold shrink-0"
              >
                Lihat Lamaran
              </AtomicButton>
            </template>

            <template v-else-if="canApply">
              <AtomicButton
                variant="primary"
                size="sm"
                @click="showApplyModal = true"
                class="font-bold shrink-0 w-full"
              >
                Apply Project Ini
              </AtomicButton>
            </template>
          </div>
        </div>
      </div>
    </div>

    <ProjectApplyModal
      v-if="project"
      :project-id="project.id"
      :show="showApplyModal"
      @close="showApplyModal = false"
      @applied="handleApplied"
    />
  </div>
</template>

<script setup lang="ts">
import type { Application, Project } from '~/types/project'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const { getProjectBySlug, getMyApplications } = useProjects()
const user = useSupabaseUser()

const projectSlug = route.params.slug as string

const {
  data: project,
  error,
  pending,
  refresh: refreshProject
} = await useAsyncData<Project | null>(`project-${projectSlug}`, () =>
  getProjectBySlug(projectSlug)
)

useHead({
  title: project.value
    ? `${project.value.title} - Kolaboria`
    : 'Project - Kolaboria'
})

const { data: myApps, refresh: refreshApps } = await useAsyncData<
  Application[]
>(`my-apps-${projectSlug}`, () =>
  user.value ? getMyApplications() : Promise.resolve([])
)

const currentApplication = computed(() =>
  myApps.value?.find((app) => app.project_id === project.value?.id)
)

const hasApplied = computed(() => !!currentApplication.value)

const isOwner = computed(
  () => !!user.value && user.value.id === project.value?.creator_id
)

const members = computed(
  () =>
    project.value?.project_members?.filter(
      (member) => member.role === 'contributor'
    ) ?? []
)

const filledSlots = computed(() => members.value.length)

const openSlots = computed(() => {
  if (!project.value) return 0
  return Math.max(0, project.value.max_slots - filledSlots.value)
})

const canApply = computed(() => {
  if (!user.value) return false
  if (isOwner.value) return false
  if (hasApplied.value) return false
  const alreadyMember = members.value.some(
    (member) => member.profile_id === user.value?.id
  )
  return (
    !alreadyMember && project.value?.status === 'open' && openSlots.value > 0
  )
})

const isClosedForApplication = computed(
  () =>
    !!project.value &&
    (project.value.status !== 'open' || openSlots.value === 0)
)

const formatDate = (date: string | null | undefined) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formattedDeadline = computed(() => formatDate(project.value?.deadline))
const formattedStartDate = computed(() => formatDate(project.value?.start_date))

const typeLabel: Record<string, string> = {
  web_app: 'Web App',
  mobile_app: 'Mobile App',
  ui_ux: 'UI/UX Design',
  backend: 'Backend',
  data_analytics: 'Data & Analytics',
  devops: 'DevOps',
  other: 'Lainnya'
}

const coverLabel = computed(() =>
  project.value ? typeLabel[project.value.type] : 'Project'
)

const creatorName = computed(
  () =>
    project.value?.profiles?.full_name ||
    project.value?.profiles?.username ||
    'Anonim'
)

const creatorUsername = computed(() => project.value?.profiles?.username)
const creatorInitial = computed(() => creatorName.value.charAt(0).toUpperCase())

const requiredSkills = computed(
  () =>
    project.value?.project_skills?.filter((skill) => skill.is_required) ?? []
)

const optionalSkills = computed(
  () =>
    project.value?.project_skills?.filter((skill) => !skill.is_required) ?? []
)

const projectDurationLabel = computed(() => {
  if (!project.value?.start_date || !project.value?.deadline) {
    return 'Belum ditentukan'
  }

  const start = new Date(project.value.start_date)
  const end = new Date(project.value.deadline)
  const diffInMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())

  return diffInMonths > 0 ? `${diffInMonths} Bulan` : '< 1 Bulan'
})

const timelineStatusLabel = computed(() =>
  project.value?.status === 'open'
    ? 'Pendaftaran Terbuka'
    : project.value?.status === 'in_progress'
      ? 'Sedang Berjalan'
      : project.value?.status === 'completed'
        ? 'Selesai'
        : 'Belum Membuka Lamaran'
)

const heroStats = computed(() => [
  {
    label: 'Slot Tersedia',
    value: openSlots.value,
    iconAttrs: { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    pathAttrs: {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197'
    }
  },
  {
    label: 'Kontributor',
    value: members.value.length,
    iconAttrs: { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    pathAttrs: {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z'
    }
  },
  {
    label: 'Estimasi Waktu',
    value: projectDurationLabel.value,
    iconAttrs: { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    pathAttrs: {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }
])

const contentTags = computed(() => {
  const techTags = project.value?.tech_stack ?? []
  const skillTags =
    project.value?.project_skills?.map((skill) => skill.skill_tags.name) ?? []
  return [...new Set([...techTags, ...skillTags])].slice(0, 12)
})

const descriptionParagraphs = computed(() => {
  const description = project.value?.description?.trim()
  if (!description) return []
  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})

const applicationMessage = computed(() => {
  switch (currentApplication.value?.status) {
    case 'pending':
      return {
        title: 'Lamaranmu sedang ditinjau',
        body: 'Pemilik project akan meninjau motivasi dan kontribusimu.'
      }
    case 'accepted':
      return {
        title: 'Lamaranmu diterima',
        body: 'Kamu sudah masuk ke alur kolaborasi project ini.'
      }
    case 'rejected':
      return {
        title: 'Lamaranmu belum diterima',
        body: 'Kamu tetap bisa mengeksplor project lain yang lebih cocok.'
      }
    case 'withdrawn':
      return {
        title: 'Lamaran ditarik kembali',
        body: 'Status lamaran ini sudah tidak aktif.'
      }
    default:
      return null
  }
})

const showApplyModal = ref(false)

const handleApplied = async () => {
  await refreshApps()
  await refreshProject()
}

// Refs for DOM sections
const heroSection = ref<HTMLElement | null>(null)

// Scroll state
const showStickyBar = ref(false)
let scrollHandler: () => void

// Track mobile breakpoint (< 1024px = lg)
const isMobile = ref(false)
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

const setupScrollListener = () => {
  updateIsMobile()
  scrollHandler = () => {
    const heroBottom = heroSection.value?.getBoundingClientRect().bottom ?? 0
    showStickyBar.value = isMobile.value && heroBottom <= 20
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener(
    'resize',
    () => {
      updateIsMobile()
      const heroBottom = heroSection.value?.getBoundingClientRect().bottom ?? 0
      showStickyBar.value = isMobile.value && heroBottom <= 0
    },
    { passive: true }
  )
}

onMounted(() => {
  setupScrollListener()
  // Trigger initial check
  if (scrollHandler) scrollHandler()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style scoped>
/* Aurora effects */
.k-aurora-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 70%
  );
  animation: aurora-drift 14s ease-in-out infinite alternate;
  border-radius: 50%;
  filter: blur(60px);
  will-change: transform;
}
.k-aurora-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 176, 32, 0.12) 0%,
    transparent 70%
  );
  animation: aurora-drift 18s ease-in-out infinite alternate-reverse;
  border-radius: 50%;
  filter: blur(70px);
  will-change: transform;
}
@keyframes aurora-drift {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(40px, -30px) scale(1.08);
  }
  100% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

/* Hide scrollbar for tab nav overflow */
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Subtle glassmorphism bg */
.bg-white\/8 {
  background-color: rgba(255, 255, 255, 0.08);
}
.bg-white\/8:hover {
  background-color: rgba(255, 255, 255, 0.12);
}
.border-white\/8 {
  border-color: rgba(255, 255, 255, 0.08);
}
</style>
