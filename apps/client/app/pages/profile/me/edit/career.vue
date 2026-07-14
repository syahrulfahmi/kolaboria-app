<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile } from '~/types/profile'
import type { CareerHistory } from '~/composables/useCareer'

const props = defineProps<{
  profile: Profile
  careerHistories: CareerHistory[]
}>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()

const { addCareerHistory, updateCareerHistory, deleteCareerHistory } =
  useCareer()
const { add: addToast } = useToast()

const isActionLoading = ref(false)
const showCareerForm = ref(false)
const editingCareer = ref<CareerHistory | null>(null)

// Career Form State
const careerForm = ref({
  title: '',
  company: '',
  start_year: new Date().getFullYear(),
  end_year: undefined as number | undefined,
  description: '',
  is_current: false
})

const openAddCareer = () => {
  editingCareer.value = null
  careerForm.value = {
    title: '',
    company: '',
    start_year: new Date().getFullYear(),
    end_year: undefined,
    description: '',
    is_current: false
  }
  showCareerForm.value = true
}

const openEditCareer = (career: CareerHistory) => {
  editingCareer.value = career
  careerForm.value = {
    title: career.title,
    company: career.company,
    start_year: career.start_year,
    end_year: career.end_year || undefined,
    description: career.description || '',
    is_current: !career.end_year
  }
  showCareerForm.value = true
}

const handleSaveCareer = async () => {
  isActionLoading.value = true
  try {
    const payload = {
      title: careerForm.value.title,
      company: careerForm.value.company,
      start_year: careerForm.value.start_year,
      end_year: careerForm.value.is_current
        ? null
        : careerForm.value.end_year || null,
      description: careerForm.value.description
    }

    if (editingCareer.value && editingCareer.value.id) {
      await updateCareerHistory(editingCareer.value.id, payload)
      addToast({
        variant: 'success',
        title: 'Karier diperbarui',
        message: 'Pengalaman kerja berhasil disimpan.'
      })
    } else if (!editingCareer.value) {
      await addCareerHistory(payload)
      addToast({
        variant: 'success',
        title: 'Karier ditambahkan',
        message: 'Pengalaman kerja baru berhasil ditambahkan.'
      })
    }

    emit('refresh')
    showCareerForm.value = false
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Aksi gagal',
      message: err.message || 'Terjadi kesalahan saat menyimpan riwayat karier.'
    })
  } finally {
    isActionLoading.value = false
  }
}

const handleDeleteCareer = async (id: string | undefined) => {
  if (!id) return
  if (!confirm('Apakah kamu yakin ingin menghapus riwayat karier ini?')) return
  isActionLoading.value = true
  try {
    await deleteCareerHistory(id)
    addToast({
      variant: 'success',
      title: 'Karier dihapus',
      message: 'Pengalaman kerja berhasil dihapus.'
    })
    emit('refresh')
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Aksi gagal',
      message: err.message || 'Gagal menghapus riwayat karier.'
    })
  } finally {
    isActionLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/profile/me')
}

const handleDone = () => {
  router.push('/profile/me')
}

const isDirty = computed(() => false)
const isSaving = computed(() => isActionLoading.value)

defineExpose({
  isDirty,
  isSaving,
  handleSave: handleDone,
  handleCancel
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- CAREER HISTORY SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div
        class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p class="font-title-2 text-primary-700">Riwayat Karier</p>
          <h2 class="mt-1 font-title-3">Perjalanan Kerja</h2>
        </div>
        <AtomicButton
          type="button"
          variant="outline"
          class="w-full sm:w-auto hover:bg-neutral-50"
          :disabled="isActionLoading"
          @click="openAddCareer"
        >
          <span class="flex items-center gap-1.5">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Karier
          </span>
        </AtomicButton>
      </div>

      <!-- Career List -->
      <div
        v-if="careerHistories.length > 0"
        class="divide-y divide-neutral-100"
      >
        <div
          v-for="career in careerHistories"
          :key="career.id"
          class="py-5 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
        >
          <div class="min-w-0 flex-1">
            <h3 class="font-body-1 truncate">
              {{ career.title }}
            </h3>
            <p class="font-label-1 text-primary-600 mt-1">
              {{ career.company }}
            </p>
            <p
              class="font-label-2 text-neutral-400 mt-1 uppercase tracking-wider"
            >
              {{ career.start_year }} — {{ career.end_year || 'Sekarang' }}
            </p>
            <p
              v-if="career.description"
              class="font-paragraph-2 text-secondary mt-2 whitespace-pre-line leading-relaxed"
            >
              {{ career.description }}
            </p>
          </div>

          <div class="shrink-0 flex items-center gap-1">
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Edit Karier"
              :disabled="isActionLoading"
              @click="openEditCareer(career)"
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
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
              title="Hapus Karier"
              :disabled="isActionLoading"
              @click="handleDeleteCareer(career.id)"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8"
      >
        <svg
          class="w-12 h-12 text-neutral-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p class="font-body-1">Belum ada riwayat kerja</p>
        <p class="font-paragraph-2 text-secondary max-w-sm mt-1">
          Tambahkan riwayat karir atau pengalaman kerja kamu untuk meningkatkan
          kredibilitas profil.
        </p>
      </div>
    </section>

    <!-- CAREER HISTORY DIALOG/MODAL -->
    <OrganismModal
      :model-value="showCareerForm"
      :title="
        editingCareer ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'
      "
      subtitle="Isi detail riwayat karier kamu secara lengkap."
      size="lg"
      @close="showCareerForm = false"
    >
      <form
        id="career-form"
        class="flex flex-col gap-4"
        @submit.prevent="handleSaveCareer"
      >
        <MoleculeInputField
          v-model="careerForm.title"
          label="Posisi / Jabatan"
          placeholder="Contoh: Senior UI Designer"
          required
          :disabled="isActionLoading"
        />
        <MoleculeInputField
          v-model="careerForm.company"
          label="Perusahaan / Instansi"
          placeholder="Contoh: PT. Kolaboria Digital"
          required
          :disabled="isActionLoading"
        />

        <div class="grid grid-cols-2 gap-4">
          <MoleculeInputField
            v-model.number="careerForm.start_year"
            type="number"
            label="Tahun Mulai"
            placeholder="Tahun"
            required
            :disabled="isActionLoading"
          />
          <MoleculeInputField
            v-model.number="careerForm.end_year"
            type="number"
            label="Tahun Selesai"
            placeholder="Tahun"
            :disabled="careerForm.is_current || isActionLoading"
            :required="!careerForm.is_current"
          />
        </div>

        <AtomicCheckbox
          v-model="careerForm.is_current"
          label="Saya masih bekerja di sini"
          :disabled="isActionLoading"
        />

        <MoleculeTextarea
          v-model="careerForm.description"
          label="Deskripsi Pekerjaan"
          :rows="6"
          placeholder="Deskripsikan peran dan pencapaian kamu."
          :disabled="isActionLoading"
        />
      </form>

      <template #footer>
        <AtomicButton
          type="button"
          variant="outline"
          class="w-full sm:w-auto hover:bg-neutral-50"
          :disabled="isActionLoading"
          @click="showCareerForm = false"
        >
          Batal
        </AtomicButton>
        <AtomicButton
          type="submit"
          form="career-form"
          variant="primary"
          class="w-full sm:w-auto"
          :loading="isActionLoading"
        >
          Simpan
        </AtomicButton>
      </template>
    </OrganismModal>
  </div>
</template>
