<template>
  <div class="w-full">
    <div
      ref="tabListRef"
      :class="[
        'relative flex gap-2',
        variant === 'underlined' ? 'border-b border-black/[.08]' : '',
        scrollable ? 'overflow-x-auto no-scrollbar' : 'flex-wrap'
      ]"
    >
      <!-- Snap Move Indicator for Underlined Variant -->
      <div
        v-if="variant === 'underlined' && indicatorWidth > 0"
        class="absolute bottom-[-1px] h-[2px] bg-primary-500 rounded-t-full transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.2)] pointer-events-none z-0"
        :style="{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }"
      ></div>

      <button
        v-for="tab in tabs"
        :key="tab.value"
        :disabled="tab.disabled"
        @click="selectTab(tab)"
        :class="getTabClass(tab)"
      >
        <span class="relative z-10">{{ tab.label }}</span>
      </button>
    </div>

    <div class="mt-4 relative">
      <div :key="modelValue" class="w-full">
        <slot :active="modelValue" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
    // [{ label: '', value: '', disabled: false }]
  },
  modelValue: String,
  variant: {
    type: String,
    default: 'underlined',
    validator: (v) => ['underlined', 'pill'].includes(v)
  },
  scrollable: Boolean
})

const emit = defineEmits(['update:modelValue'])

const tabListRef = ref(null)
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

const updateIndicator = async () => {
  if (props.variant !== 'underlined') return
  await nextTick()
  if (!tabListRef.value) return

  const buttons = Array.from(tabListRef.value.querySelectorAll('button'))
  const activeIndex = props.tabs.findIndex((t) => t.value === props.modelValue)

  if (activeIndex !== -1 && buttons[activeIndex]) {
    const btn = buttons[activeIndex]
    indicatorLeft.value = btn.offsetLeft
    indicatorWidth.value = btn.offsetWidth
  } else {
    indicatorWidth.value = 0
  }
}

onMounted(() => {
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
})

watch(() => props.modelValue, updateIndicator)

const selectTab = (tab) => {
  if (!tab.disabled) {
    emit('update:modelValue', tab.value)
  }
}

/**
 * 🎯 STYLE LOGIC
 */
const getTabClass = (tab) => {
  const isActive = props.modelValue === tab.value
  const isDisabled = tab.disabled

  const base = `
    relative px-5 py-2.5 text-[0.95rem] font-medium whitespace-nowrap
    transition-all duration-300
    active:scale-[0.97]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
  `

  const disabled = `
    opacity-50 cursor-not-allowed active:scale-100
  `

  if (props.variant === 'underlined') {
    return [
      base,
      'rounded-md',
      isActive
        ? 'text-primary-400 font-semibold'
        : 'text-neutral-500 hover:text-primary-400 hover:bg-neutral-50/50',
      isDisabled && disabled
    ]
  }

  if (props.variant === 'pill') {
    return [
      base,
      'rounded-full',
      isActive
        ? 'bg-primary-400 text-white shadow-md font-semibold'
        : 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700',
      isDisabled && disabled
    ]
  }
}
</script>

<style scoped>
/* Transisi Fade untuk perpindahan konten */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
