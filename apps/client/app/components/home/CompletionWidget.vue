<script setup lang="ts">
import { computed } from "vue";
import type { CompletionItem } from "../../utils/profileCompletion";
import { clampCompletionScore } from "../../utils/profileCompletion";

const props = defineProps<{
  score: number;
  completedItems: CompletionItem[];
  username: string;
}>();

const safeScore = computed(() => clampCompletionScore(props.score));
const isCompleted = computed(() => safeScore.value >= 100);
const missingItems = computed(() =>
  props.completedItems.filter((item) => !item.done),
);

const animatedScore = ref(0);

onMounted(() => {
  setTimeout(() => {
    animatedScore.value = safeScore.value;
  }, 100);
});

const scoreColorClass = computed(() => {
  const score = safeScore.value;
  if (score < 40) return "text-danger-600";
  if (score < 70) return "text-accent-600";
  if (score < 100) return "text-primary-700";
  return "text-success-700";
});
</script>

<template>
  <OrganismCard variant="default" class="h-full">
    <div class="flex flex-col gap-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-caption font-semibold uppercase text-primary-700">
            Profile readiness
          </p>
          <h2 class="mt-1 text-title text-secondary-900">
            {{
              isCompleted
                ? "Portfolio siap dipakai"
                : "Lengkapi portfolio utama"
            }}
          </h2>
          <p class="mt-2 text-body text-neutral-600">
            {{
              isCompleted
                ? "Semua sinyal penting sudah lengkap."
                : `${missingItems.length} bagian masih bisa kamu perkuat.`
            }}
          </p>
        </div>
        <div
          class="flex flex-col items-end rounded-xl border border-neutral-100 bg-white px-5 py-3 shadow-sm ring-2 ring-primary-50 transition-all hover:shadow-md"
        >
          <p
            class="text-caption font-semibold uppercase tracking-wider text-neutral-500"
          >
            Score
          </p>
          <p
            class="text-display font-bold leading-none"
            :class="scoreColorClass"
          >
            {{ animatedScore }}%
          </p>
        </div>
      </div>

      <div class="relative">
        <div class="h-2.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            class="h-full rounded-full bg-primary-500 transition-all duration-[800ms] ease-out"
            :style="{ width: `${animatedScore}%` }"
          />
        </div>

        <!-- Milestone markers -->
        <div
          class="absolute -bottom-4 left-0 right-0 flex justify-between px-1 text-[10px] font-semibold text-neutral-400"
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
              class="flex h-7 w-7 items-center justify-center rounded-full text-caption font-semibold"
              :class="
                item.done
                  ? 'bg-success-100 text-success-700'
                  : 'bg-white text-neutral-500'
              "
            >
              {{ item.done ? "✓" : "+" }}
            </span>
            <span class="text-body font-medium text-secondary-900">{{
              item.label
            }}</span>
          </div>
          <span class="text-caption font-semibold text-neutral-500"
            >+{{ item.weight }}%</span
          >
        </div>
      </div>

      <div class="flex justify-end">
        <NuxtLink :to="`/profile/${username}/edit`">
          <AtomicButton variant="primary">
            {{ isCompleted ? "Perbarui profil" : "Lengkapi profil" }}
          </AtomicButton>
        </NuxtLink>
      </div>
    </div>
  </OrganismCard>
</template>
