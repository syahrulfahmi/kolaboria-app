<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileSkill, ProfileTool } from '../../types/profile-page'

const props = defineProps<{
  skills: ProfileSkill[]
  tools: ProfileTool[]
}>()

const primarySkill = computed(() =>
  props.skills.find((skill) => skill.isPrimary)
)
const secondarySkills = computed(() =>
  props.skills.filter((skill) => !skill.isPrimary)
)
</script>

<template>
  <section class="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
    <h3 class="font-label-1 mb-5 flex items-center gap-2">
      <Icon name="lucide:briefcase-business" class="w-5 h-5 text-neutral-500" />
      Keahlian Utama
    </h3>

    <div v-if="skills.length > 0" class="flex flex-wrap gap-2">
      <AtomicTag
        v-if="primarySkill"
        variant="primary"
        class="border border-primary-200"
      >
        <span class="mr-1">★</span> {{ primarySkill.name }}
      </AtomicTag>

      <AtomicTag
        v-for="skill in secondarySkills"
        :key="skill.id"
        variant="default"
      >
        {{ skill.name }}
      </AtomicTag>
    </div>

    <div v-else class="mt-2 mb-4">
      <p class="font-body-2 text-secondary italic">
        Belum ada keahlian yang ditambahkan.
      </p>
    </div>

    <div class="mt-6 pt-6 border-t border-neutral-100">
      <p class="font-label-1 text-primary mb-4">Tools & Software</p>

      <div v-if="tools.length > 0" class="flex flex-wrap gap-2">
        <AtomicTag
          v-for="userTool in tools"
          :key="userTool.id"
          variant="default"
        >
          {{ userTool.name }}
        </AtomicTag>
      </div>

      <div v-else>
        <p class="font-body-2 text-secondary italic">
          Belum ada tools yang ditambahkan.
        </p>
      </div>
    </div>
  </section>
</template>
