import { ref } from 'vue'
import { CareerService } from '../services/career.service'

export interface CareerHistory {
  id?: string
  user_id?: string
  title: string
  company: string
  start_year: number
  end_year: number | null
  description: string | null
}

export const useCareer = () => {
  const isCareerLoading = ref(false)

  const getCareerHistories = async (userId?: string) => {
    isCareerLoading.value = true
    try {
      const res = await CareerService.getMyCareerHistories()
      return (res.data || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        company: c.company,
        start_year: c.startYear,
        end_year: c.endYear || null,
        description: c.description || null
      })) as CareerHistory[]
    } catch (error) {
      console.error('Error fetching career histories:', error)
      return []
    } finally {
      isCareerLoading.value = false
    }
  }

  const addCareerHistory = async (payload: CareerHistory) => {
    isCareerLoading.value = true
    try {
      await CareerService.createCareerHistory({
        title: payload.title,
        company: payload.company,
        startYear: payload.start_year,
        endYear: payload.end_year,
        description: payload.description
      })
    } finally {
      isCareerLoading.value = false
    }
  }

  const updateCareerHistory = async (id: string, payload: Partial<CareerHistory>) => {
    isCareerLoading.value = true
    try {
      await CareerService.updateCareerHistory(id, {
        title: payload.title!,
        company: payload.company!,
        startYear: payload.start_year!,
        endYear: payload.end_year,
        description: payload.description
      })
    } finally {
      isCareerLoading.value = false
    }
  }

  const deleteCareerHistory = async (id: string) => {
    isCareerLoading.value = true
    try {
      await CareerService.deleteCareerHistory(id)
    } finally {
      isCareerLoading.value = false
    }
  }

  return {
    isCareerLoading,
    getCareerHistories,
    addCareerHistory,
    updateCareerHistory,
    deleteCareerHistory
  }
}
