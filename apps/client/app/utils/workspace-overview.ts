import type { WorkspaceOverviewDTO, WorkspaceOverviewViewModel } from '~/types/workspace-overview'

const isCount = (value: number) => Number.isSafeInteger(value) && value >= 0

export const mapWorkspaceOverview = (dto: WorkspaceOverviewDTO): WorkspaceOverviewViewModel => {
  const summary = dto?.task_summary
  if (!dto?.project?.id || !dto.project.slug || !dto.project.title || !dto.viewer?.capabilities || !summary || !dto.team_summary) {
    throw new Error('Respons Overview proyek tidak lengkap.')
  }
  const counts = [summary.total_tasks, summary.todo_tasks, summary.in_progress_tasks, summary.review_tasks,
    summary.done_tasks, summary.closed_tasks, summary.outstanding_tasks, dto.team_summary.active_member_count]
  if (!counts.every(isCount) || summary.total_tasks !== summary.todo_tasks + summary.in_progress_tasks +
      summary.review_tasks + summary.done_tasks + summary.closed_tasks ||
      summary.outstanding_tasks !== summary.todo_tasks + summary.in_progress_tasks + summary.review_tasks) {
    throw new Error('Ringkasan task Overview tidak konsisten.')
  }
  if (!Array.isArray(dto.my_tasks) || dto.my_tasks.length > 5 ||
      (dto.recent_discussions !== null && (!Array.isArray(dto.recent_discussions) || dto.recent_discussions.length > 2)) ||
      !Array.isArray(dto.recent_activities) || dto.recent_activities.length > 3) {
    throw new Error('Jumlah data preview Overview tidak valid.')
  }
  const denominator = summary.todo_tasks + summary.in_progress_tasks + summary.review_tasks + summary.done_tasks
  return { ...dto, progress: { completed: summary.done_tasks, denominator, percent: denominator === 0 ? null : Math.round(summary.done_tasks / denominator * 100) } }
}

export const formatWorkspaceOverviewDate = (value: string | null): string => {
  if (!value) return 'Belum ditentukan'
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return 'Tanggal tidak valid'
  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return 'Tanggal tidak valid'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

export const formatWorkspaceOverviewTime = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Waktu tidak tersedia'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}
