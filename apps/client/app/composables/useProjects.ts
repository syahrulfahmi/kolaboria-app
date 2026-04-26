export const useProjects = () => {
  const client = useSupabaseClient()

  const getProjects = async () => {
    const { data, error } = await client.from('projects').select('*')
    if (error) throw error
    return data
  }

  return { getProjects }
}
