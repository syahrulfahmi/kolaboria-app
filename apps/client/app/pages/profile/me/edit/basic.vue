<script setup lang="ts">
import { getApiErrorMessage } from '../../../../utils/error'
import { ref, computed, reactive } from 'vue'
import type { Profile, TalentProfile } from '~/types/profile'
import { LocationService } from '~/services/location.service'

definePageMeta({
  homeNavbar: {
    variant: 'back-path',
    title: 'Informasi Dasar',
    mainHorizontalPadding: 'none'
  }
})

const props = defineProps<{
  profile: Profile
  talentProfile: TalentProfile | null
}>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()
const { updateProfile } = useProfile()
const { add: addToast } = useToast()

const isSaving = ref(false)

const initialForm = reactive({
  full_name: props.profile.full_name || '',
  headline: props.profile.headline || '',
  bio: props.profile.bio || '',
  goal: props.talentProfile?.goal || '',
  address: props.profile.address?.address || '',
  village_id: props.profile.address?.villageId || null
})

const form = ref({ ...initialForm })

const isDirty = computed(() => {
  return (
    form.value.full_name !== initialForm.full_name ||
    form.value.headline !== initialForm.headline ||
    form.value.bio !== initialForm.bio ||
    form.value.goal !== initialForm.goal ||
    form.value.address !== initialForm.address ||
    form.value.village_id !== initialForm.village_id
  )
})

const initialLocationLabel = computed(() => {
  if (props.profile.address) {
    const { village, district, regency, province } = props.profile.address
    const label = [village, district, regency, province]
      .filter(Boolean)
      .join(', ')
    if (label) return label
  }
  return props.profile.location || ''
})

const locationOptions = ref<Array<{ label: string; value: number }>>([])
const isLoadingLocations = ref(false)

const handleLocationSearch = async (query: string) => {
  if (!query || query.length < 2) {
    locationOptions.value = []
    return
  }
  isLoadingLocations.value = true
  try {
    const results = await LocationService.searchLocations(query)
    locationOptions.value = results.map((loc) => ({
      label: `${loc.village}, ${loc.district}, ${loc.regency}, ${loc.province}`,
      value: loc.villageId
    }))
  } catch (err) {
    console.error('Failed to search locations:', err)
  } finally {
    isLoadingLocations.value = false
  }
}

const handleSave = async () => {
  if (!form.value.full_name.trim()) {
    addToast({
      variant: 'warning',
      title: 'Nama wajib diisi',
      message: 'Masukkan nama lengkap sebelum menyimpan profil.'
    })
    return
  }

  isSaving.value = true
  try {
    await updateProfile({
      fullName: form.value.full_name.trim(),
      headline: form.value.headline.trim() || null,
      bio: form.value.bio.trim() || null,
      villageId: form.value.village_id,
      address: form.value.address.trim() || null,
      goal: form.value.goal.trim() || null
    })
    Object.assign(initialForm, form.value)
    emit('refresh')

    addToast({
      variant: 'success',
      title: 'Profil diperbarui',
      message: 'Informasi dasar profil berhasil disimpan.'
    })

    await router.replace('/profile/me')
  } catch (err: unknown) {
    addToast({
      variant: 'danger',
      title: 'Gagal menyimpan',
      message: getApiErrorMessage(
        err,
        'Terjadi kesalahan saat menyimpan perubahan.'
      )
    })
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  router.push('/profile/me')
}

defineExpose({
  isDirty,
  isSaving,
  handleSave,
  handleCancel
})
</script>

<template>
  <form
    class="divide-y divide-neutral-200 rounded-lg lg:border lg:border-neutral-200 bg-white"
    @submit.prevent="handleSave"
  >
    <section class="py-6 px-4">
      <header class="mb-5">
        <h2 class="font-title-3">Identitas</h2>
        <p class="mt-1.5 font-body-2 text-secondary">
          Informasi yang ditampilkan pada profilmu ketika berinteraksi dengan
          project dan pengguna lain.
        </p>
      </header>

      <div class="flex flex-col gap-5">
        <MoleculeInputField
          v-model="form.full_name"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap kamu"
          required
          :disabled="isSaving"
        />

        <MoleculeInputField
          v-model="form.headline"
          label="Headline"
          placeholder="Contoh: Frontend Developer | UI/UX Enthusiast"
          hint="Gunakan peran atau fokus profesional yang paling menggambarkan dirimu."
          :disabled="isSaving"
        />

        <div class="flex flex-col gap-1.5">
          <MoleculeAutocomplete
            v-model="form.village_id"
            label="Lokasi"
            placeholder="Cari kelurahan, kecamatan, kota..."
            :options="locationOptions"
            :loading="isLoadingLocations"
            :initial-label="initialLocationLabel"
            :disabled="isSaving"
            @search="handleLocationSearch"
          />
        </div>

        <MoleculeTextarea
          v-model="form.address"
          label="Alamat Lengkap"
          rows="2"
          max-length="500"
          placeholder="Jalan, nomor rumah, RT/RW, dan detail alamat lainnya."
          :disabled="isSaving"
        />
      </div>
    </section>

    <section class="py-6 px-4">
      <header class="mb-5">
        <h2 class="font-title-3">Tentang kamu</h2>
        <p class="mt-1.5 font-body-2 text-secondary">
          Ceritakan fokus, kemampuan, dan jenis kontribusi atau project yang
          kamu minati.
        </p>
      </header>

      <div class="flex flex-col gap-5">
        <MoleculeTextarea
          v-model="form.bio"
          label="Bio"
          rows="3"
          max-length="300"
          show-counter
          placeholder="Ceritakan fokus, pengalaman, atau cara kamu berkontribusi."
          :disabled="isSaving"
        />

        <MoleculeTextarea
          v-model="form.goal"
          label="Tujuan Kolaborasi"
          rows="6"
          max-length="200"
          show-counter
          placeholder="Contoh: Mencari pengalaman project nyata dan mentor untuk berkembang."
          :disabled="isSaving"
        />
      </div>
    </section>
  </form>
</template>
