<template>
  <div class="flex flex-col gap-1.5" ref="dropdownRef">
    <label
      v-if="label"
      class="text-xs font-semibold tracking-wide uppercase text-neutral-500"
    >
      {{ label }}
      <span
        v-if="multiple && max"
        class="normal-case font-normal text-neutral-400 ml-1"
        >(maks {{ max }})</span
      >
      <span v-if="required" class="text-primary-400 text-base leading-none"
        >*</span
      >
    </label>

    <div class="relative" ref="triggerRef">
      <div
        class="flex min-h-[44px] w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white px-3 py-2 transition-all duration-150 focus-within:ring-2 focus-within:ring-offset-1"
        :class="[
          error
            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-200'
            : 'border-neutral-300 hover:border-primary-300 focus-within:border-primary-400 focus-within:ring-primary-200',
          disabled ? 'cursor-not-allowed bg-neutral-100 opacity-75' : '',
        ]"
        @click="toggleDropdown"
      >
        <!-- Single Value Mode -->
        <template v-if="!multiple">
          <div class="relative flex-1 flex items-center h-full min-h-[24px]">
            <span
              v-if="!searchable || !isOpen"
              class="absolute inset-0 flex items-center truncate pl-1"
              :class="[
                !selectedSingle ? 'text-neutral-400' : 'text-neutral-900',
              ]"
              style="pointer-events: none"
            >
              {{ selectedSingle ? selectedSingle.label : placeholder }}
            </span>

            <input
              v-if="searchable"
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="w-full border-none bg-transparent p-0 pl-1 text-sm focus:outline-none focus:ring-0 text-neutral-900 placeholder:text-neutral-400"
              :class="{ 'opacity-0': !isOpen }"
              :placeholder="selectedSingle ? selectedSingle.label : placeholder"
              :disabled="disabled"
              @focus="handleFocus"
              @click.stop="
                () => {
                  if (!isOpen) toggleDropdown();
                }
              "
            />
          </div>
        </template>

        <!-- Multiple Value Mode -->
        <template v-else>
          <!-- Selected Chips -->
          <span
            v-for="val in selectedMultipleValues"
            :key="String(val)"
            class="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20"
          >
            {{ getOptionLabel(val) }}
            <button
              type="button"
              @click.stop="removeOption(val)"
              class="group -mr-1 flex h-4 w-4 items-center justify-center rounded-sm hover:bg-primary-200/50"
            >
              <svg
                class="h-3 w-3 text-primary-600 group-hover:text-primary-800"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                />
              </svg>
            </button>
          </span>

          <!-- Search Input for Multiple Mode -->
          <input
            v-if="searchable"
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="
              selectedMultipleValues.length === 0 ? placeholder : ''
            "
            :disabled="
              disabled || (max ? selectedMultipleValues.length >= max : false)
            "
            class="flex-1 min-w-[80px] border-none bg-transparent p-0 text-sm focus:outline-none focus:ring-0 ml-1"
            @focus="handleFocus"
            @keydown.delete="handleBackspace"
            @click.stop="
              () => {
                if (!isOpen) toggleDropdown();
              }
            "
          />
          <span
            v-else-if="selectedMultipleValues.length === 0"
            class="text-neutral-400 pl-1"
            >{{ placeholder }}</span
          >
        </template>

        <svg
          class="h-5 w-5 text-neutral-400 transition-transform duration-200 ml-auto"
          :class="{ 'rotate-180 text-primary-400': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <Teleport to="body">
        <transition
          enter-active-class="transition-all ease-out duration-150"
          :enter-from-class="
            openUpward
              ? 'transform opacity-0 translate-y-3'
              : 'transform opacity-0 -translate-y-3'
          "
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition-all ease-in duration-150"
          leave-from-class="transform opacity-100 translate-y-0"
          :leave-to-class="
            openUpward
              ? 'transform opacity-0 translate-y-3'
              : 'transform opacity-0 -translate-y-3'
          "
        >
          <div
            v-if="isOpen && !disabled"
            ref="dropdownListRef"
            class="fixed z-[9999] max-h-60 overflow-auto rounded-xl bg-white shadow-lg shadow-secondary-900/10 ring-1 ring-black/5 focus:outline-none flex flex-col"
            :style="dropdownStyle"
          >
            <ul role="listbox" class="py-1.5 flex-1 overflow-y-auto">
              <!-- Loading Skeleton -->
              <template v-if="loading">
                <li
                  v-for="i in 3"
                  :key="i"
                  class="py-2.5 px-4 flex items-center gap-3"
                >
                  <div
                    class="h-4 w-4 bg-neutral-100 animate-pulse rounded-sm"
                    v-if="multiple"
                  ></div>
                  <div
                    class="h-4 w-full bg-neutral-100 animate-pulse rounded-md"
                  ></div>
                </li>
              </template>

              <template v-else>
                <li
                  v-for="option in filteredOptions"
                  :key="String(option.value)"
                  @click.stop="selectOption(option)"
                  class="relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-sm text-neutral-800 transition-colors border-l-2"
                  :class="[
                    isSelected(option)
                      ? 'bg-primary-50 text-primary-700 font-medium border-primary-500'
                      : 'border-transparent hover:bg-neutral-50 hover:text-neutral-900 hover:border-primary-300',
                    multiple &&
                    max &&
                    selectedMultipleValues.length >= max &&
                    !isSelected(option)
                      ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:border-transparent hover:text-neutral-800'
                      : '',
                  ]"
                  role="option"
                  :aria-selected="isSelected(option)"
                >
                  <span class="block truncate">{{ option.label }}</span>
                  <span
                    v-if="isSelected(option)"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-500"
                  >
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </li>
                <li
                  v-if="filteredOptions.length === 0"
                  class="py-3 px-4 text-sm text-neutral-500 text-center"
                >
                  Opsi tidak ditemukan
                </li>
              </template>
            </ul>
          </div>
        </transition>
      </Teleport>
    </div>

    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <svg
        class="h-3.5 w-3.5 text-red-500 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="text-caption text-red-500">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

interface Option {
  label: string;
  value: string | number;
}

// Props supporting both Single and Multiple modes
const props = defineProps<{
  label?: string;
  modelValue?: string | number | (string | number)[] | null;
  options: Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  // New features
  multiple?: boolean;
  searchable?: boolean;
  max?: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | number | (string | number)[] | null];
  open: [];
}>();

const isOpen = ref(false);
const hasOpened = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownListRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");
const openUpward = ref(false);
const dropdownStyle = ref<Record<string, string>>({});

// Computed values
const selectedSingle = computed(() => {
  if (props.multiple) return null;
  if (props.modelValue === null || props.modelValue === undefined) return null;
  return props.options.find((opt) => opt.value === props.modelValue) || null;
});

const selectedMultipleValues = computed(() => {
  if (!props.multiple) return [];
  return (Array.isArray(props.modelValue) ? props.modelValue : []) as (
    | string
    | number
  )[];
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => opt.label.toLowerCase().includes(query));
});

// Methods
const getOptionLabel = (value: string | number) => {
  return props.options.find((opt) => opt.value === value)?.label || value;
};

const isSelected = (option: Option) => {
  if (props.multiple) {
    return selectedMultipleValues.value.includes(option.value);
  }
  return option.value === props.modelValue;
};

const DROPDOWN_MAX_HEIGHT = 240;

const calculatePosition = () => {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  openUpward.value =
    spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;

  dropdownStyle.value = {
    position: "fixed",
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: "9999",
    ...(openUpward.value
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  };
};

const handleFocus = () => {
  if (!isOpen.value && !props.disabled) {
    toggleDropdown();
  }
};

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    if (!hasOpened.value) {
      hasOpened.value = true;
      emit("open");
    }
    calculatePosition();
    nextTick(() => {
      if (props.searchable) {
        searchInputRef.value?.focus();
      }
    });
  } else {
    searchQuery.value = "";
  }
};

const selectOption = (option: Option) => {
  if (props.disabled) return;

  if (props.multiple) {
    const currentValues = [...selectedMultipleValues.value];
    const index = currentValues.indexOf(option.value);

    if (index > -1) {
      currentValues.splice(index, 1); // Remove
    } else {
      if (props.max && currentValues.length >= props.max) return; // Limit reached
      currentValues.push(option.value); // Add
    }

    emit("update:modelValue", currentValues);
    searchQuery.value = "";
    searchInputRef.value?.focus();
  } else {
    emit("update:modelValue", option.value);
    isOpen.value = false;
    searchQuery.value = "";
  }
};

const removeOption = (value: string | number) => {
  if (props.disabled || !props.multiple) return;
  const currentValues = selectedMultipleValues.value.filter((v) => v !== value);
  emit("update:modelValue", currentValues);
};

const handleBackspace = () => {
  if (
    props.multiple &&
    searchQuery.value === "" &&
    selectedMultipleValues.value.length > 0
  ) {
    const currentValues = [...selectedMultipleValues.value];
    currentValues.pop();
    emit("update:modelValue", currentValues);
  }
};

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const isOutsideDropdown =
    dropdownRef.value && !dropdownRef.value.contains(target);
  const isOutsideList =
    dropdownListRef.value && !dropdownListRef.value.contains(target);

  if (isOutsideDropdown && isOutsideList) {
    isOpen.value = false;
    searchQuery.value = "";
  }
};

const handleScrollOrResize = () => {
  if (isOpen.value) {
    calculatePosition();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", handleScrollOrResize, true);
  window.addEventListener("resize", handleScrollOrResize);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleScrollOrResize, true);
  window.removeEventListener("resize", handleScrollOrResize);
});
</script>
