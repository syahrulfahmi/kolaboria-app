<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { CreateProjectPayload } from '~/types/project'
import { sanitizeSlug } from '~/utils/slug'

const props = defineProps<{
  currentSlug?: string
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })

const typeOptions = [
  { value: 'web_app', label: 'Web App' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'ui_ux', label: 'UI/UX Design' },
  { value: 'backend', label: 'Backend' },
  { value: 'data_analytics', label: 'Data & Analytics' },
  { value: 'devops', label: 'DevOps' },
  { value: 'other', label: 'Lainnya' }
]

const visibilityOptions = [
  { value: 'public', label: 'Publik' },
  { value: 'invite_only', label: 'Invite Only' }
]

const isEditingSlug = ref(false)
const slugError = ref('')

onMounted(() => {
  if (props.currentSlug) {
    form.value.slug = props.currentSlug
  }
})

const onSlugInput = (val: string) => {
  form.value.slug = sanitizeSlug(val)
  if (form.value.slug.length < 3) {
    slugError.value = 'Slug harus minimal 3 karakter'
  } else {
    slugError.value = ''
  }
}

const startEditingSlug = () => {
  isEditingSlug.value = true
  if (!form.value.slug) {
    form.value.slug = props.currentSlug
  }
}

const cancelEditingSlug = () => {
  isEditingSlug.value = false
  form.value.slug = props.currentSlug
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Section: Identitas Utama -->
    <div
      class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100"
    >
      <MoleculeInputField
        v-model="form.title"
        label="Judul Project"
        placeholder="Cth: Platform Edukasi Bahasa Daerah"
        hint="Gunakan judul yang singkat, jelas, dan mendeskripsikan inti project."
        required
      />

      <!-- Section: Slug Project -->
      <div
        v-if="isEditingSlug"
        class="flex flex-col gap-2 rounded-xl bg-amber-50/50 p-4 ring-1 ring-amber-100"
      >
        <div class="flex items-center justify-between">
          <label class="font-label-1"> Slug URL Baru </label>
          <button
            type="button"
            class="text-xs text-body text-neutral-500 hover:text-neutral-700"
            @click="cancelEditingSlug"
          >
            Batal
          </button>
        </div>
        <MoleculeInputField
          :model-value="form.slug"
          @update:model-value="onSlugInput"
          placeholder="cth: platform-edukasi-bahasa-daerah"
          :error="slugError"
          hint="Peringatan: Mengubah slug akan mematikan tautan proyek lama yang
          telah dibagikan."
          required
        />
        <span class="font-label-2">
          Preview URL:
          <span class="font-label-2">
            kolaboria.com/projects/{{ form.slug || '***' }}
          </span>
        </span>
      </div>
      <div
        v-else
        class="flex items-center justify-between rounded-xl bg-neutral-100/50 p-4 ring-1 ring-neutral-200/50"
      >
        <div class="flex flex-col">
          <span class="font-label-1">Tautan Proyek</span>
          <span class="font-mono text-sm text-neutral-700 mt-1">
            kolaboria.com/projects/<span class="font-bold text-neutral-900">{{
              form.slug || currentSlug
            }}</span>
          </span>
        </div>
        <AtomicIconButton
          variant="outline"
          size="sm"
          shape="square"
          title="Ubah Slug"
          @click="startEditingSlug"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </AtomicIconButton>
      </div>

      <MoleculeTextarea
        v-model="form.summary"
        label="Ringkasan Singkat"
        placeholder="Jelaskan secara singkat apa tujuan atau masalah yang ingin diselesaikan oleh proyek ini?"
        :max-length="200"
        show-counter
        required
        hint="Akan ditampilkan di halaman pencarian project."
      />

      <MoleculeTextarea
        v-model="form.description"
        label="Deskripsi Lengkap"
        placeholder="Jelaskan lebih detail tentang latar belakang, tujuan, dan ruang lingkup project ini..."
        hint="Deskripsi yang detail akan meningkatkan kemungkinan talenta untuk tertarik bergabung."
      />
    </div>

    <!-- Section: Kategori & Visibilitas -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <MoleculeDropdown
        v-model="form.type"
        label="Kategori Project"
        :options="typeOptions"
        hint="Kategori membantu sistem merekomendasikan project ke talenta yang tepat."
      />

      <MoleculeDropdown
        v-model="form.visibility"
        label="Visibilitas"
        :options="visibilityOptions"
        hint="Project privat (Invite Only) tidak akan muncul di halaman pencarian."
      />
    </div>
  </div>
</template>
