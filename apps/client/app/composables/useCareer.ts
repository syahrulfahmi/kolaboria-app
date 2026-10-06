import { ref } from 'vue'
import { CareerService } from '../services/career.service'
import type { CareerHistoryRequest } from '../types/profile-api'

export interface CareerHistory {
  id?: string
  user_id?: string
  title: string
  company: string
  start_year: number
  start_month: number | null
  end_year: number | null
  end_month: number | null
  description: string | null
}

export const useCareer = () => {
  const isCareerLoading = ref(false)

  const getCareerHistories = async (_userId?: string) => {
    isCareerLoading.value = true
    try {
      const res = await CareerService.getMyCareerHistories()
      return (res.data || []).map((c) => ({
        id: c.id,
        title: c.title,
        company: c.company,
        start_year: c.start_year,
        start_month: c.start_month ?? null,
        end_year: c.end_year,
        end_month: c.end_month ?? null,
        description: c.description
      }))
    } catch (error) {
      console.error('Error fetching career histories:', error)
      return []
    } finally {
      isCareerLoading.value = false
    }
  }

  const addCareerHistory = async (payload: CareerHistoryRequest) => {
    isCareerLoading.value = true
    try {
      await CareerService.createCareerHistory(payload)
    } finally {
      isCareerLoading.value = false
    }
  }

  const updateCareerHistory = async (id: string, payload: CareerHistoryRequest) => {
    isCareerLoading.value = true
    try {
      await CareerService.updateCareerHistory(id, payload)
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
