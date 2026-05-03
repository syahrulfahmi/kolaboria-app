import type { UserTool } from '../types/profile'

export const useTool = () => {
  const client = useSupabaseClient<any>()
  const user = useSupabaseUser()

  const getUserTools = async (userId: string): Promise<UserTool[]> => {
    const { data, error } = await client
      .from('user_tools')
      .select('*, tools(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  const addUserTool = async (toolId: string) => {
    if (!user.value) throw new Error('User tidak ditemukan')
    const { error } = await client
      .from('user_tools')
      .upsert({
        user_id: user.value.id,
        tool_id: toolId
      }, { onConflict: 'user_id, tool_id' })
    if (error) throw error
  }

  const removeUserTool = async (userToolId: string) => {
    const { error } = await client
      .from('user_tools')
      .delete()
      .eq('id', userToolId)
    if (error) throw error
  }

  return {
    getUserTools,
    addUserTool,
    removeUserTool
  }
}
