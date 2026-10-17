import type { WorkspaceActivityDTO } from '~/types/workspace-activity'

/** Highlights only the quoted subject identified by the activity contract. */
export const splitWorkspaceActivityDescription = (
  activity: Pick<WorkspaceActivityDTO, 'description' | 'subject'>
) => {
  const { description, subject } = activity
  const matchIndex = subject.label ? description.indexOf(`“${subject.label}”`) : -1
  if (matchIndex < 0) return { before: description, subject: '', after: '' }

  const subjectStart = matchIndex + 1
  return {
    before: description.slice(0, subjectStart),
    subject: subject.label,
    after: description.slice(subjectStart + subject.label.length)
  }
}
