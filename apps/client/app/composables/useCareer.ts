import { ref } from 'vue'

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
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()
  const isCareerLoading = ref(false)

  const getCareerHistories = async (userId: string) => {
    isCareerLoading.value = true
    try {
      const { data, error } = await client
        .from('career_histories')
        .select('*')
        .eq('user_id', userId)
        .order('start_year', { ascending: false })

      if (error) throw error
      return data as CareerHistory[]
    } catch (error) {
      console.error('Error fetching career histories:', error)
      return []
    } finally {
      isCareerLoading.value = false
    }
  }

  const addCareerHistory = async (payload: CareerHistory) => {
    if (!user.value) throw new Error('Kamu harus login.')
    isCareerLoading.value = true
    try {
      const { error } = await client
        .from('career_histories')
        .insert({
          ...payload,
          user_id: user.value.id
        })

      if (error) throw error
    } finally {
      isCareerLoading.value = false
    }
  }

  const updateCareerHistory = async (id: string, payload: Partial<CareerHistory>) => {
    if (!user.value) throw new Error('Kamu harus login.')
    isCareerLoading.value = true
    try {
      const { error } = await client
        .from('career_histories')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.value.id)

      if (error) throw error
    } finally {
      isCareerLoading.value = false
    }
  }

  const deleteCareerHistory = async (id: string) => {
    if (!user.value) throw new Error('Kamu harus login.')
    isCareerLoading.value = true
    try {
      const { error } = await client
        .from('career_histories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.value.id)

      if (error) throw error
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
