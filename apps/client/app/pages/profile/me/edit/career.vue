<script setup lang="ts">
import { getApiErrorMessage } from '../../../../utils/error'
import { ref, computed } from 'vue'
import type { CareerHistory } from '~/composables/useCareer'
import { formatCareerPeriod } from '~/utils/career-period'

definePageMeta({
  homeNavbar: {
    variant: 'back-path',
    title: 'Riwayat Karier',
    mainHorizontalPadding: 'none'
  }
})

const props = defineProps<{
  careerHistories: CareerHistory[]
  isLoadingData: boolean
  errorMessage: string | null
}>()

const emit = defineEmits<{
  refresh: []
  retryLoad: []
}>()

const router = useRouter()

const { addCareerHistory, updateCareerHistory, deleteCareerHistory } =
  useCareer()
const { add: addToast } = useToast()

const isActionLoading = ref(false)
const showCareerForm = ref(false)
const editingCareer = ref<CareerHistory | null>(null)
const careerFormKey = ref(0)

const openAddCareer = () => {
  editingCareer.value = null
  careerFormKey.value += 1
  showCareerForm.value = true
}

const openEditCareer = (career: CareerHistory) => {
  editingCareer.value = career
  careerFormKey.value += 1
  showCareerForm.value = true
}

const handleSaveCareer = async (career: CareerHistory) => {
  isActionLoading.value = true
  try {
    const payload = {
      title: career.title,
      company: career.company,
      startYear: career.start_year,
      startMonth: career.start_month,
      endYear: career.end_year,
      endMonth: career.end_month,
      description: career.description
    }

    if (career.id) {
      await updateCareerHistory(career.id, payload)
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
  } catch (err: unknown) {
    addToast({
      variant: 'danger',
      title: 'Aksi gagal',
      message: getApiErrorMessage(
        err,
        'Terjadi kesalahan saat menyimpan riwayat karier.'
      )
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
  } catch (err: unknown) {
    addToast({
      variant: 'danger',
      title: 'Aksi gagal',
      message: getApiErrorMessage(err, 'Gagal menghapus riwayat karier.')
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
    <section
      v-if="isLoadingData"
      class="rounded-2xl border border-neutral-200 bg-white"
    >
      <MoleculeLoading label="Memuat riwayat karier..." />
    </section>

    <section
      v-else-if="errorMessage"
      class="rounded-2xl border border-neutral-200 bg-white"
      role="alert"
    >
      <OrganismEmptyState
        title="Riwayat karier belum bisa dimuat"
        :description="errorMessage"
        icon="document"
        action="Coba lagi"
        @action="emit('retryLoad')"
      />
    </section>

    <template v-else>
      <section class="rounded-2xl border border-neutral-200 bg-white">
        <header
          class="flex flex-col gap-4 border-b border-neutral-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7"
        >
          <div class="max-w-3xl">
            <h2 class="font-title-3 text-neutral-900">Pengalaman</h2>
            <p class="mt-1.5 font-body-2 text-secondary">
              Tambahkan pengalaman yang membantu orang lain memahami perjalanan,
              peran, dan kontribusi yang pernah kamu lakukan.
            </p>
          </div>
          <AtomicButton
            type="button"
            variant="primary"
            class="w-full shrink-0 sm:w-auto"
            :disabled="isActionLoading"
            @click="openAddCareer"
          >
            <template #icon-left>
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </template>
            Tambah Pengalaman
          </AtomicButton>
        </header>

        <div class="space-y-6 p-5 sm:p-7">
          <aside
            class="flex gap-3 rounded-xl border border-primary-100 bg-primary-50/50 p-4"
            aria-label="Panduan mengisi pengalaman"
          >
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600"
              aria-hidden="true"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M12 16v-4m0-4h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            </span>
            <div class="min-w-0">
              <p class="font-label-1 text-neutral-900">
                Fokus pada pengalaman yang relevan
              </p>
              <p class="mt-0.5 font-body-3 text-secondary">
                Kamu bisa menambahkan pengalaman kerja, freelance, project,
                organisasi, atau volunteer. Ceritakan peran dan kontribusi yang
                benar-benar kamu lakukan.
              </p>
            </div>
          </aside>

          <div class="flex items-center justify-between gap-3">
            <h3 class="font-label-1 text-neutral-900">Pengalamanmu</h3>
            <span class="font-body-3 text-secondary">
              {{ careerHistories.length }} pengalaman
            </span>
          </div>

          <div
            v-if="careerHistories.length > 0"
            class="overflow-hidden rounded-xl border border-neutral-200 divide-y divide-neutral-200"
          >
            <article
              v-for="career in careerHistories"
              :key="career.id"
              class="flex gap-3 p-4 sm:gap-4 sm:p-5"
            >
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 sm:h-12 sm:w-12"
                aria-hidden="true"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.7"
                    d="M3 7.5h18v13H3v-13zM8 7.5V5a2 2 0 012-2h4a2 2 0 012 2v2.5M3 12h18m-11 0v2h4v-2"
                  />
                </svg>
              </span>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <h4 class="font-label-1 text-neutral-900">
                    {{ career.title }}
                  </h4>
                  <div class="-mr-2 -mt-1 flex shrink-0 items-center gap-0.5">
                    <AtomicIconButton
                      title="Edit pengalaman"
                      aria-label="Edit pengalaman"
                      variant="ghost"
                      size="sm"
                      class="focus-visible:!ring-2 focus-visible:!ring-primary-400"
                      :disabled="isActionLoading"
                      @click="openEditCareer(career)"
                    >
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.8"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </AtomicIconButton>
                    <AtomicIconButton
                      title="Hapus pengalaman"
                      aria-label="Hapus pengalaman"
                      variant="ghost"
                      size="sm"
                      class="hover:!text-danger-600 hover:!bg-danger-50 focus-visible:!ring-2 focus-visible:!ring-primary-400"
                      :disabled="isActionLoading"
                      @click="handleDeleteCareer(career.id)"
                    >
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.8"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3M4 7h16"
                        />
                      </svg>
                    </AtomicIconButton>
                  </div>
                </div>
                <p class="mt-0.5 font-body-2 text-neutral-700">
                  {{ career.company }}
                </p>
                <p class="mt-1 font-body-3 text-secondary">
                  {{
                    formatCareerPeriod(
                      career.start_year,
                      career.start_month,
                      career.end_year,
                      career.end_month
                    )
                  }}
                </p>
                <p
                  v-if="career.description"
                  class="mt-2 whitespace-pre-line font-body-3 leading-relaxed text-secondary"
                >
                  {{ career.description }}
                </p>
              </div>
            </article>
          </div>

          <div
            v-else
            class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center"
          >
            <p class="font-label-1 text-neutral-900">Belum ada pengalaman</p>
            <p class="mx-auto mt-1 max-w-md font-body-3 text-secondary">
              Tambahkan pengalaman kerja, project, organisasi, atau volunteer
              yang relevan dengan perjalananmu.
            </p>
          </div>
        </div>
      </section>

      <OrganismModal
        :model-value="showCareerForm"
        :title="editingCareer ? 'Edit Pengalaman' : 'Tambah Pengalaman'"
        :subtitle="
          editingCareer
            ? 'Perbarui informasi pengalaman dan kontribusimu.'
            : 'Tambahkan informasi yang paling relevan tentang pengalaman dan kontribusimu.'
        "
        :mobile-fullscreen="true"
        size="lg"
        @close="showCareerForm = false"
      >
        <ProfileEditCareerHistoryForm
          :key="careerFormKey"
          :initial-data="editingCareer"
          :loading="isActionLoading"
          @save="handleSaveCareer"
        />

        <template #footer>
          <AtomicButton
            type="button"
            variant="outline"
            class="w-1/3 shrink-0 sm:w-auto"
            :disabled="isActionLoading"
            @click="showCareerForm = false"
          >
            Batal
          </AtomicButton>
          <AtomicButton
            type="submit"
            form="career-history-form"
            variant="primary"
            class="min-w-0 flex-1 sm:flex-none"
            :loading="isActionLoading"
            :disabled="isActionLoading"
          >
            {{ editingCareer ? 'Simpan Perubahan' : 'Tambah Pengalaman' }}
          </AtomicButton>
        </template>
      </OrganismModal>
    </template>
  </div>
</template>
