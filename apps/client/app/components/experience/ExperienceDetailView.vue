<script setup lang="ts">
import type { ExperienceDetail } from '../../types/experience'
const props = defineProps<{ experience: ExperienceDetail; owner?: boolean }>()
const emit = defineEmits<{
  visibility: [value: 'private' | 'public']
  reflection: [value: string]
}>()
const reflection = ref(props.experience.reflection?.body || '')
const dirty = computed(
  () => reflection.value !== (props.experience.reflection?.body || '')
)
const saveReflection = () => emit('reflection', reflection.value)
const copyLink = async () => {
  await navigator.clipboard?.writeText(window.location.href)
}
const { trackEvent } = useExperiences()
onMounted(() => {
  if (!props.owner) void trackEvent(props.experience.id, 'experience_viewed')
})
const copyPublicLink = async () => {
  await copyLink()
  await trackEvent(props.experience.id, 'copy_link_clicked')
}
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6 px-4 py-8">
    <header class="rounded-3xl bg-secondary-900 p-6 text-white sm:p-8">
      <p class="text-sm text-white/70">{{ experience.project_title }}</p>
      <h1 class="mt-2 text-3xl font-semibold">
        {{ experience.contribution_role }}
      </h1>
      <p class="mt-2 max-w-2xl text-white/75">
        {{ experience.project_summary }}
      </p>
      <div class="mt-5 flex flex-wrap gap-2 text-sm text-white/75">
        <span>{{ experience.record_status_label }}</span
        ><span>·</span
        ><span>{{ experience.outcome || 'Outcome project tercatat' }}</span
        ><span>·</span><span>{{ experience.visibility_label }}</span>
      </div>
    </header>
    <section class="grid gap-3 sm:grid-cols-5">
      <div
        v-for="item in [
          { label: 'Task selesai', value: experience.metrics.completed_tasks },
          {
            label: 'Task ditugaskan',
            value: experience.metrics.assigned_tasks
          },
          { label: 'Diskusi', value: experience.metrics.discussions },
          { label: 'Deliverable', value: experience.metrics.deliverables },
          { label: 'Tim', value: experience.metrics.team_size }
        ]"
        :key="item.label"
        class="rounded-2xl border border-neutral-200 bg-white p-4"
      >
        <p class="text-2xl font-semibold text-secondary-900">
          {{ item.value }}
        </p>
        <p class="mt-1 text-xs text-neutral-500">{{ item.label }}</p>
      </div>
    </section>
    <section class="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 class="text-xl font-semibold text-secondary-900">
        Highlight kontribusi
      </h2>
      <ExperienceHighlightsEditor
        v-if="experience.highlights.length"
        class="mt-4"
        :highlights="experience.highlights"
      />
      <p v-else class="mt-3 text-sm text-neutral-500">
        Belum ada highlight yang dipilih.
      </p>
    </section>
    <section class="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 class="text-xl font-semibold text-secondary-900">
        Refleksi Kontributor
      </h2>
      <p class="mt-1 text-sm text-neutral-500">
        Ditulis oleh kontributor; terpisah dari fakta terverifikasi.
      </p>
      <ExperienceReflectionEditor v-if="owner" v-model="reflection" />
      <p v-else class="mt-4 whitespace-pre-wrap text-sm text-neutral-700">
        {{
          experience.reflection?.body ||
          'Kontributor belum menambahkan refleksi.'
        }}
      </p>
      <div v-if="owner" class="mt-3 flex justify-end">
        <AtomicButton
          :disabled="!dirty"
          variant="primary"
          size="sm"
          @click="saveReflection"
          >Simpan Refleksi</AtomicButton
        >
      </div>
    </section>
    <ExperienceTimeline
      :joined-at="experience.joined_at"
      :started-at="experience.project_started_at"
      :ended-at="experience.project_ended_at"
    /><ExperienceTrustSection :items="experience.trust_explanation" />
    <div class="flex flex-wrap gap-3">
      <ExperienceShareActions @copy="copyPublicLink" /><template v-if="owner"
        ><AtomicButton
          v-if="experience.visibility === 'private'"
          variant="primary"
          size="sm"
          :disabled="
            experience.record_status !== 'finalized' ||
            experience.integrity_status !== 'valid'
          "
          @click="emit('visibility', 'public')"
          >Publikasikan</AtomicButton
        ><AtomicButton
          v-else
          variant="ghost"
          size="sm"
          @click="emit('visibility', 'private')"
          >Jadikan Privat</AtomicButton
        ></template
      >
    </div>
  </div>
</template>
