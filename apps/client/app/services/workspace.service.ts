import type {
  ActivityLog,
  CreateTaskPayload,
  LogActivityPayload,
  MemberProfile,
  ReorderTaskUpdate,
  Task,
  TaskComment,
  UpdateTaskPayload
} from '../types/workspace'

const taskSelect = `
  *,
  assignee:profiles!tasks_assignee_id_fkey(id, username, full_name, avatar),
  creator:profiles!tasks_created_by_fkey(id, username, full_name, avatar)
`

export const WorkspaceService = {
  async getTasks(client: any, projectId: string): Promise<Task[]> {
    const { data, error } = await client
      .from('tasks')
      .select(taskSelect)
      .eq('project_id', projectId)
      .order('status')
      .order('position', { ascending: true })

    if (error) throw error
    return data ?? []
  },

  async createTask(
    client: any,
    payload: CreateTaskPayload & { created_by: string }
  ): Promise<Task> {
    const { data, error } = await client
      .from('tasks')
      .insert(payload)
      .select(taskSelect)
      .single()

    if (error) throw error
    return data
  },

  async updateTask(
    client: any,
    taskId: string,
    payload: UpdateTaskPayload
  ): Promise<Task> {
    const { data, error } = await client
      .from('tasks')
      .update(payload)
      .eq('id', taskId)
      .select(taskSelect)
      .single()

    if (error) throw error
    return data
  },

  async deleteTask(client: any, taskId: string): Promise<void> {
    const { error } = await client.from('tasks').delete().eq('id', taskId)
    if (error) throw error
  },

  async reorderTasks(client: any, updates: ReorderTaskUpdate[]): Promise<void> {
    await Promise.all(
      updates.map(async (update) => {
        const { error } = await client
          .from('tasks')
          .update({ status: update.status, position: update.position })
          .eq('id', update.id)

        if (error) throw error
      })
    )
  },

  async getTaskComments(
    client: any,
    taskId: string
  ): Promise<TaskComment[]> {
    const { data, error } = await client
      .from('task_comments')
      .select(
        `
        *,
        profiles:profiles!task_comments_author_id_fkey(id, username, full_name, avatar)
      `
      )
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data ?? []
  },

  async addComment(
    client: any,
    taskId: string,
    authorId: string,
    body: string
  ): Promise<TaskComment> {
    const { data, error } = await client
      .from('task_comments')
      .insert({ task_id: taskId, author_id: authorId, body })
      .select(
        `
        *,
        profiles:profiles!task_comments_author_id_fkey(id, username, full_name, avatar)
      `
      )
      .single()

    if (error) throw error
    return data
  },

  async deleteComment(client: any, commentId: string): Promise<void> {
    const { error } = await client
      .from('task_comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
  },

  async getActivityLogs(
    client: any,
    projectId: string,
    limit = 20
  ): Promise<ActivityLog[]> {
    const { data, error } = await client
      .from('activity_logs')
      .select(
        `
        *,
        profiles:profiles!activity_logs_actor_id_fkey(id, username, full_name, avatar)
      `
      )
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data ?? []
  },

  async logActivity(
    client: any,
    payload: LogActivityPayload
  ): Promise<void> {
    const { error } = await client.from('activity_logs').insert({
      ...payload,
      metadata: payload.metadata ?? {}
    })

    if (error) throw error
  },

  async getWorkspaceMembers(
    client: any,
    projectId: string,
    creatorId: string
  ): Promise<MemberProfile[]> {
    const { data: owner, error: ownerError } = await client
      .from('profiles')
      .select('id, username, full_name, avatar')
      .eq('id', creatorId)
      .single()

    if (ownerError) throw ownerError

    const { data: memberRows, error: membersError } = await client
      .from('project_members')
      .select('profile_id, profiles(id, username, full_name, avatar)')
      .eq('project_id', projectId)

    if (membersError) throw membersError

    const byId = new Map<string, MemberProfile>()
    if (owner) byId.set(owner.id, owner)

    for (const row of memberRows ?? []) {
      const profile = Array.isArray(row.profiles)
        ? row.profiles[0]
        : row.profiles
      if (profile?.id) byId.set(profile.id, profile)
    }

    return [...byId.values()]
  }
}
