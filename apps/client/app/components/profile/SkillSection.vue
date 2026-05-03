<script setup lang="ts">
import { computed } from 'vue'
import type { UserSkill, UserTool } from '../../types/profile'

const props = defineProps<{
  skills: UserSkill[]
  tools: UserTool[]
}>()

const primarySkill = computed(() =>
  props.skills.find((skill) => skill.is_primary)
)
const secondarySkills = computed(() =>
  props.skills.filter((skill) => !skill.is_primary)
)
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200 shadow-sm transition-shadow hover:shadow-md">
    <h3 class="text-heading text-secondary-900 mb-5 flex items-center gap-2">
      <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      Keahlian Utama
    </h3>

    <div v-if="skills.length > 0" class="flex flex-wrap gap-2">
      <AtomicTag
        v-if="primarySkill"
        variant="primary"
        class="border border-primary-200 font-medium"
      >
        <span class="mr-1">★</span> {{ primarySkill.skills?.name }}
      </AtomicTag>

      <AtomicTag
        v-for="skill in secondarySkills"
        :key="skill.id"
        variant="default"
      >
        {{ skill.skills?.name }}
      </AtomicTag>
    </div>

    <div v-else class="mt-2 mb-4">
      <p class="text-body text-neutral-500 italic">
        Belum ada keahlian yang ditambahkan.
      </p>
    </div>

    <div class="mt-6 pt-6 border-t border-neutral-100">
      <p class="text-caption font-semibold uppercase text-primary-700 mb-4">Tools & Software</p>
      
      <div v-if="tools.length > 0" class="flex flex-wrap gap-2">
        <AtomicTag v-for="userTool in tools" :key="userTool.id" variant="default">
          {{ userTool.tools?.name }}
        </AtomicTag>
      </div>

      <div v-else>
        <p class="text-body text-neutral-500 italic">
          Belum ada tools yang ditambahkan.
        </p>
      </div>
    </div>
  </section>
</template>
