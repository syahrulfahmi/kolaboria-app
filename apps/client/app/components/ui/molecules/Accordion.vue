<template>
  <div class="space-y-2" role="presentation">
    <AccordionItem
      v-for="(item, i) in items"
      :key="i"
      :index="i"
      :title="item.title"
      :content="item.content"
    >
      <!-- Pass named slot through if provided -->
      <template v-if="$slots[`item-${i}`]" #default>
        <slot :name="`item-${i}`" />
      </template>
    </AccordionItem>

    <!-- Fallback: slot tanpa items prop -->
    <slot v-if="!items?.length" />
  </div>
</template>

<script setup lang="ts">
import { reactive, provide } from 'vue'
import AccordionItem from './AccordionItem.vue'

export interface AccordionItemData {
  title: string
  content?: string
}

const props = defineProps<{
  items?: AccordionItemData[]
  multiple?: boolean
  defaultOpen?: number | number[]
}>()

// Build initial active set
const initActiveItems = (): Set<number> => {
  if (props.defaultOpen === undefined) return new Set()
  if (Array.isArray(props.defaultOpen)) return new Set(props.defaultOpen)
  return new Set([props.defaultOpen])
}

const state = reactive({
  activeItems: initActiveItems()
})

const toggle = (index: number) => {
  if (state.activeItems.has(index)) {
    state.activeItems.delete(index)
  } else {
    if (!props.multiple) {
      state.activeItems.clear()
    }
    state.activeItems.add(index)
  }
}

provide('accordion', {
  activeItems: state.activeItems,
  toggle
})
</script>
