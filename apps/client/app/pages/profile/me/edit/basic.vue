<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile, TalentProfile } from '~/types/profile'
import { LocationService } from '~/services/location.service'

const props = defineProps<{
  profile: Profile
  talentProfile: TalentProfile | null
}>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()
const { updateProfile, updateTalentProfile } = useProfile()
const { add: addToast } = useToast()

const isSaving = ref(false)

const initialForm = {
  full_name: props.profile.full_name || '',
  headline: props.profile.headline || '',
  bio: props.profile.bio || '',
  goal: props.talentProfile?.goal || '',
  address: props.profile.address?.address || '',
  village_id: props.profile.address?.villageId || null
}

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
    return [village, district, regency, province].filter(Boolean).join(', ')
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
  isSaving.value = true
  try {
    await updateProfile(form.value)
    emit('refresh')

    addToast({
      variant: 'success',
      title: 'Profil diperbarui',
      message: 'Informasi dasar profil berhasil disimpan.'
    })

    await router.replace('/profile/me')
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Gagal menyimpan',
      message: err.message || 'Terjadi kesalahan saat menyimpan perubahan.'
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
  <form class="flex flex-col gap-6" @submit.prevent="handleSave">
    <!-- INFORMASI DASAR SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div class="mb-6">
        <p class="font-title-2 text-primary-700">Informasi Dasar</p>
        <h2 class="mt-1 font-title-3">Identitas Pengguna</h2>
      </div>

      <MoleculeInputField
        v-model="form.full_name"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap kamu"
        required
        :disabled="isSaving"
      />

      <div class="mt-5">
        <MoleculeInputField
          v-model="form.headline"
          label="Headline"
          placeholder="Contoh: Frontend Developer | UI/UX Enthusiast"
          :disabled="isSaving"
        />
      </div>

      <div class="mt-5">
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

      <div class="mt-5">
        <MoleculeTextarea
          v-model="form.address"
          label="Alamat Lengkap"
          rows="2"
          placeholder="Jalan, nomor rumah, RT/RW, dan detail alamat lainnya."
          :disabled="isSaving"
        />
      </div>

      <div class="mt-5">
        <MoleculeTextarea
          v-model="form.bio"
          label="Bio"
          rows="4"
          placeholder="Ceritakan fokus, pengalaman, atau cara kamu berkontribusi."
          :disabled="isSaving"
        />
      </div>

      <div class="mt-5">
        <MoleculeTextarea
          v-model="form.goal"
          label="Goal"
          rows="4"
          placeholder="Contoh: Mencari pengalaman project nyata dan mentor untuk berkembang."
          :disabled="isSaving"
        />
      </div>
    </section>
  </form>
</template>
