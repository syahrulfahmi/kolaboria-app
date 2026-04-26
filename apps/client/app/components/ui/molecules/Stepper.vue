<template>
  <div
    class="flex w-full"
    :class="[
      orientation === 'horizontal' ? 'flex-col' : 'flex-row'
    ]"
  >
    <!-- Stepper Navigation -->
    <ol
      class="flex relative w-full"
      :class="[
        orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col h-full'
      ]"
    >
      <template v-if="orientation === 'horizontal'">
        <template v-for="(step, index) in steps" :key="`h-${index}`">
          <!-- Horizontal Step -->
          <li class="relative flex flex-col group flex-1" :class="{ 'pr-4': index < steps.length - 1 }">
            
            <!-- Title Area -->
            <div class="mb-5 flex flex-col items-start text-left min-h-[5rem]">
              <span
                class="text-3xl font-bold tracking-tighter transition-colors duration-500 leading-none"
                :class="[
                  index === modelValue ? 'text-primary-600' :
                  index < modelValue ? 'text-neutral-800' : 'text-neutral-300'
                ]"
              >
                {{ (index + 1).toString().padStart(2, '0') }}
              </span>
              <h4
                class="mt-2 text-sm font-semibold transition-colors duration-500"
                :class="[
                  index <= modelValue ? 'text-neutral-800' : 'text-neutral-400'
                ]"
              >
                {{ step.title }}
              </h4>
              <!-- Fade-up transition for description -->
              <transition
                enter-active-class="transition-all duration-500 ease-out delay-150"
                enter-from-class="opacity-0 translate-y-2 filter blur-sm"
                enter-to-class="opacity-100 translate-y-0 filter blur-0"
              >
                <p
                  v-if="step.description && index <= modelValue"
                  class="mt-1 text-xs text-neutral-500 leading-relaxed max-w-[90%]"
                >
                  {{ step.description }}
                </p>
              </transition>
            </div>

            <!-- Connector & Dot Area -->
            <div class="relative w-full h-[1px] bg-neutral-200 flex items-center">
              <!-- Progress Fill -->
              <div
                v-if="index < steps.length - 1"
                class="absolute left-0 top-0 h-full bg-primary-500 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left w-full"
                :class="index < modelValue ? 'scale-x-100' : 'scale-x-0'"
              ></div>
              
              <!-- Dot -->
              <div
                class="absolute left-0 w-2 h-2 rounded-full -translate-y-[0.5px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10"
                :class="[
                  index < modelValue ? 'bg-primary-500 scale-100' :
                  index === modelValue ? 'bg-primary-500 ring-4 ring-primary-100 scale-125' :
                  'bg-neutral-300 scale-100'
                ]"
              ></div>
            </div>
          </li>
        </template>
      </template>

      <template v-else>
        <!-- Vertical Steps -->
        <li
          v-for="(step, index) in steps"
          :key="`v-${index}`"
          class="relative flex flex-row items-start pb-10 last:pb-0"
        >
          <!-- Connector & Dot Column -->
          <div class="relative flex flex-col items-center mr-6 mt-1.5">
            <!-- Dot -->
            <div
              class="w-2.5 h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10"
              :class="[
                index < modelValue ? 'bg-primary-500 scale-100' :
                index === modelValue ? 'bg-primary-500 ring-4 ring-primary-100 scale-125' :
                'bg-neutral-300 scale-100'
              ]"
            ></div>
            
            <!-- Vertical Line -->
            <div
              v-if="index < steps.length - 1"
              class="absolute top-2 w-[1px] h-full bg-neutral-200"
            >
              <div
                class="w-full bg-primary-500 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top h-[calc(100%+2.5rem)]"
                :class="index < modelValue ? 'scale-y-100' : 'scale-y-0'"
              ></div>
            </div>
          </div>

          <!-- Title Area -->
          <div class="flex flex-col text-left">
            <span
              class="text-2xl font-bold tracking-tight transition-colors duration-500 leading-none mb-1"
              :class="[
                index === modelValue ? 'text-primary-600' :
                index < modelValue ? 'text-neutral-800' : 'text-neutral-300'
              ]"
            >
              {{ (index + 1).toString().padStart(2, '0') }}
            </span>
            <h4
              class="text-sm font-semibold transition-colors duration-500"
              :class="[
                index <= modelValue ? 'text-neutral-800' : 'text-neutral-400'
              ]"
            >
              {{ step.title }}
            </h4>
            <transition
              enter-active-class="transition-all duration-500 ease-out delay-150"
              enter-from-class="opacity-0 translate-y-2 filter blur-sm"
              enter-to-class="opacity-100 translate-y-0 filter blur-0"
            >
              <p
                v-if="step.description && index <= modelValue"
                class="mt-1.5 text-xs text-neutral-500 leading-relaxed"
              >
                {{ step.description }}
              </p>
            </transition>
          </div>
        </li>
      </template>
    </ol>

    <!-- Navigation Buttons (Optional) -->
    <div v-if="showNavigation" class="flex items-center gap-3 mt-10" :class="orientation === 'horizontal' ? 'justify-between' : 'justify-start ml-10'">
      <button
        @click="prev"
        :disabled="modelValue === 0"
        class="px-5 py-2.5 text-sm font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Kembali
      </button>
      <button
        @click="next"
        class="px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 shadow-sm transition-colors"
      >
        {{ modelValue === steps.length - 1 ? 'Selesai' : 'Lanjut' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface StepItem {
  title: string
  description?: string
  icon?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: number
    steps: StepItem[]
    orientation?: 'horizontal' | 'vertical'
    showNavigation?: boolean
  }>(),
  {
    orientation: 'horizontal',
    showNavigation: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  complete: []
}>()

const next = () => {
  if (props.modelValue < props.steps.length - 1) {
    emit('update:modelValue', props.modelValue + 1)
  } else {
    emit('complete')
  }
}

const prev = () => {
  if (props.modelValue > 0) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>
