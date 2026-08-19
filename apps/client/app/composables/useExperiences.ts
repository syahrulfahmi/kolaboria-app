import { ExperienceService } from '../services/experience.service'
import type {
  ExperienceCard,
  ExperienceDetail,
  ExperienceVisibility
} from '../types/experience'
export const useExperiences = () => {
  const experiences = useState<ExperienceCard[]>('my_experiences', () => [])
  const selectedExperience = useState<ExperienceDetail | null>(
    'selected_experience',
    () => null
  )
  const loading = useState('experiences_loading', () => false)
  const saving = useState('experiences_saving', () => false)
  const error = useState<string | null>('experiences_error', () => null)
  const listMine = async () => {
    loading.value = true
    error.value = null
    try {
      experiences.value = await ExperienceService.listMine()
      return experiences.value
    } catch (e) {
      error.value = 'Tidak dapat memuat rekam kontribusi'
      throw e
    } finally {
      loading.value = false
    }
  }
  const getById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      selectedExperience.value = await ExperienceService.getById(id)
      return selectedExperience.value
    } catch (e) {
      error.value = 'Rekam kontribusi tidak ditemukan'
      throw e
    } finally {
      loading.value = false
    }
  }
  const getPublic = async (username: string, slug: string) => {
    loading.value = true
    error.value = null
    try {
      return await ExperienceService.getPublic(username, slug)
    } catch (e) {
      error.value = 'Rekam kontribusi tidak tersedia'
      throw e
    } finally {
      loading.value = false
    }
  }
  const updateVisibility = async (id: string, v: ExperienceVisibility) => {
    saving.value = true
    try {
      await ExperienceService.updateVisibility(id, v)
      if (selectedExperience.value?.id === id)
        selectedExperience.value.visibility = v
      experiences.value = experiences.value.map((x) =>
        x.id === id
          ? {
              ...x,
              visibility: v,
              visibility_label: v === 'public' ? 'Publik' : 'Privat'
            }
          : x
      )
    } finally {
      saving.value = false
    }
  }
  const upsertReflection = async (id: string, body: string) => {
    saving.value = true
    try {
      await ExperienceService.upsertReflection(id, body)
      if (selectedExperience.value?.id === id)
        selectedExperience.value = {
          ...selectedExperience.value,
          reflection: { body, updated_at: new Date().toISOString() }
        }
    } finally {
      saving.value = false
    }
  }
  const deleteReflection = async (id: string) => {
    saving.value = true
    try {
      await ExperienceService.deleteReflection(id)
      if (selectedExperience.value?.id === id)
        selectedExperience.value = {
          ...selectedExperience.value,
          reflection: null
        }
    } finally {
      saving.value = false
    }
  }
  const trackEvent = async (
    id: string,
    event_type: string,
    metadata?: Record<string, string>
  ) => {
    try {
      await ExperienceService.trackEvent(id, event_type, metadata)
    } catch {
      /* analytics must not block the experience page */
    }
  }
  return {
    experiences,
    selectedExperience,
    loading,
    saving,
    error,
    listMine,
    getById,
    getPublic,
    updateVisibility,
    upsertReflection,
    deleteReflection,
    trackEvent
  }
}
