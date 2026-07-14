<script setup lang="ts">
import { computed } from 'vue'
import type { CompletionItem } from '../../utils/profileCompletion'
import type { UserSkill, UserTool } from '../../types/profile'
import { clampCompletionScore } from '../../utils/profileCompletion'

const props = defineProps<{
  score: number
  completedItems: CompletionItem[]
  username: string
  skills?: UserSkill[]
  tools?: UserTool[]
}>()

const safeScore = computed(() => clampCompletionScore(props.score))
const isCompleted = computed(() => safeScore.value >= 100)
const missingItems = computed(() =>
  props.completedItems.filter((item) => !item.done)
)

const animatedScore = ref(0)

onMounted(() => {
  setTimeout(() => {
    animatedScore.value = safeScore.value
  }, 100)
})

const scoreColorClass = computed(() => {
  const score = safeScore.value
  if (score < 40) return 'text-danger-600'
  if (score < 70) return 'text-accent-600'
  if (score < 100) return 'text-primary-700'
  return 'text-success-700'
})

const primarySkill = computed(() => props.skills?.find((s) => s.is_primary))

const otherSkills = computed(
  () => props.skills?.filter((s) => !s.is_primary).slice(0, 5) ?? []
)

const displayedTools = computed(() => props.tools?.slice(0, 6) ?? [])

const getSkillVariant = (category?: string) => {
  const cat = category?.toLowerCase() || ''
  switch (cat) {
    case 'frontend':
      return 'info'
    case 'backend':
      return 'primary'
    case 'mobile':
      return 'success'
    case 'design':
      return 'danger'
    case 'devops':
      return 'warning'
    case 'data':
      return 'info'
    default:
      return 'default'
  }
}
</script>

<template>
  <OrganismCard variant="default" class="h-full">
    <div class="flex flex-col gap-6">
      <!-- Header: Score -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-body-1 text-primary-700">Profile Readiness</p>
          <h2 class="mt-1 font-body-1 text-secondary-900">
            {{
              isCompleted
                ? 'Portfolio siap dipakai'
                : 'Lengkapi portfolio utama'
            }}
          </h2>
          <p class="mt-2 font-body-2 text-neutral-600">
            {{
              isCompleted
                ? 'Semua sinyal penting sudah lengkap.'
                : `${missingItems.length} bagian masih bisa kamu perkuat.`
            }}
          </p>
        </div>
        <div
          class="flex flex-col items-end rounded-xl border border-neutral-100 bg-white px-5 py-3 shadow-sm ring-2 ring-primary-50 transition-all hover:shadow-md"
        >
          <p class="font-label-2 text-secondary">Score</p>
          <p class="text-3xl font-bold leading-none" :class="scoreColorClass">
            {{ animatedScore }}%
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="relative">
        <div class="h-2.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            class="h-full rounded-full bg-primary-500 transition-all duration-[800ms] ease-out"
            :style="{ width: `${animatedScore}%` }"
          />
        </div>

        <!-- Milestone markers -->
        <div
          class="absolute -bottom-4 left-0 right-0 flex justify-between px-1 text-[10px] text-neutral-400"
        >
          <span
            class="relative before:absolute before:-top-3 before:left-1/2 before:h-1.5 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-neutral-200"
            >0%</span
          >
          <span
            class="relative before:absolute before:-top-3 before:left-1/2 before:h-1.5 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-neutral-200"
            >25%</span
          >
          <span
            class="relative before:absolute before:-top-3 before:left-1/2 before:h-1.5 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-neutral-200"
            >50%</span
          >
          <span
            class="relative before:absolute before:-top-3 before:left-1/2 before:h-1.5 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-neutral-200"
            >75%</span
          >
          <span
            class="relative before:absolute before:-top-3 before:left-1/2 before:h-1.5 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-neutral-200"
            >100%</span
          >
        </div>
      </div>

      <!-- Checklist Items -->
      <div class="mt-4 space-y-3">
        <div
          v-for="item in completedItems"
          :key="item.key"
          class="flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
          :class="
            item.done
              ? 'border-success-100 bg-success-50'
              : 'border-neutral-200 bg-neutral-50'
          "
        >
          <div class="flex items-center gap-3">
            <span
              class="flex h-7 w-7 items-center justify-center rounded-full font-body-3"
              :class="
                item.done
                  ? 'bg-success-100 text-success-700'
                  : 'bg-white text-neutral-500'
              "
            >
              {{ item.done ? '✓' : '+' }}
            </span>
            <span class="font-body-2 text-secondary-900">{{ item.label }}</span>
          </div>
          <span class="font-body-3 text-neutral-500">+{{ item.weight }}%</span>
        </div>
      </div>

      <!-- Skills Section -->
      <div
        v-if="skills && skills.length > 0"
        class="border-t border-neutral-100 pt-5"
      >
        <p class="mb-3 font-label-1">Skill</p>
        <div class="flex flex-wrap gap-2">
          <!-- Primary skill badge (highlighted) -->
          <AtomicTagCategory
            v-if="primarySkill"
            :variant="getSkillVariant(primarySkill.skills.category)"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {{ primarySkill.skills.name }}
            <span
              class="ml-0.5 rounded-sm bg-current/10 px-1 py-0.5 font-label-3"
            >
              Utama
            </span>
          </AtomicTagCategory>
          <!-- Other skills -->
          <AtomicTagCategory
            v-for="skill in otherSkills"
            :key="skill.id"
            :variant="getSkillVariant(skill.skills.category)"
          >
            {{ skill.skills.name }}
          </AtomicTagCategory>
          <AtomicTagCategory
            v-if="(skills?.length ?? 0) > 6"
            variant="default"
            class="!text-neutral-600"
          >
            +{{ (skills?.length ?? 0) - 6 }} lainnya
          </AtomicTagCategory>
        </div>
      </div>

      <!-- Tools Section -->
      <div
        v-if="tools && tools.length > 0"
        class="border-t border-neutral-100 pt-5"
      >
        <p class="mb-3 font-label-1">Tools</p>
        <div class="flex flex-wrap gap-2">
          <AtomicTagCategory
            v-for="tool in displayedTools"
            :key="tool.id"
            variant="default"
          >
            {{ tool.tools.name }}
          </AtomicTagCategory>
          <AtomicTagCategory
            v-if="(tools?.length ?? 0) > 6"
            variant="default"
            class="!text-neutral-600"
          >
            +{{ (tools?.length ?? 0) - 6 }} lainnya
          </AtomicTagCategory>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex justify-end">
        <NuxtLink to="/profile/me/edit">
          <AtomicButton variant="primary">
            {{ isCompleted ? 'Perbarui profil' : 'Lengkapi profil' }}
          </AtomicButton>
        </NuxtLink>
      </div>
    </div>
  </OrganismCard>
</template>
