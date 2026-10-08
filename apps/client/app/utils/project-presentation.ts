import { getProjectCategoryLabel } from '../constants/projectCategory'
import type { MasterItem, Project, ProjectRole } from '../types/project'
import type { ProjectDetailResponse, ProjectSummaryResponse } from '../types/project-editor'

const originLabels: Record<string, string> = {
  personal: 'Proyek pribadi',
  community: 'Komunitas',
  experiment: 'Eksperimen',
  client: 'Proyek client'
}

const displayDate = (value: string | null) => {
  if (!value) return undefined
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return undefined
  return `Sampai ${date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })}`
}

export const toProjectListItem = (summary: ProjectSummaryResponse) => ({
  id: summary.id,
  title: summary.title,
  slug: summary.slug,
  summary: summary.summary,
  description: summary.summary,
  acceptsContributors: summary.status === 'open' && summary.filled_capacity < summary.total_capacity,
  context: originLabels[summary.origin] ?? 'Proyek pribadi',
  type: getProjectCategoryLabel(summary.project_category),
  author: {
    name: summary.owner_profile?.full_name || summary.owner_profile?.username ||
      summary.initiator_organization?.name || 'Project Lead belum ditetapkan',
    status: summary.owner_profile?.username
      ? `@${summary.owner_profile.username}`
      : summary.initiator_organization ? 'Organisasi pemrakarsa' : 'Project Lead belum ditetapkan',
    avatar: summary.owner_profile?.avatar ?? null
  },
  skills: [...new Set([...summary.skills, ...summary.tools].map(item => item.name))],
  memberCount: `${summary.filled_capacity} dari ${summary.total_capacity}`,
  commitmentHours: summary.hours_per_week,
  deadline: displayDate(summary.deadline),
  categoryLabel: getProjectCategoryLabel(summary.project_category),
  createdAt: summary.created_at,
  filledCapacity: summary.filled_capacity,
  isBookmarked: false
})

const toMasterItem = (item: { id: string; name: string; slug: string }, category: string): MasterItem => ({
  ...item,
  category
})

export const toProjectDetailView = (detail: ProjectDetailResponse): Project => {
  const roles: ProjectRole[] = detail.roles.map(role => ({
    id: role.id,
    contribution_role_id: role.contribution_role_id,
    contribution_role: role.contribution_role
      ? toMasterItem(role.contribution_role, 'Contribution Role')
      : null,
    custom_title: null,
    description: role.description,
    capacity: role.capacity,
    filled_capacity: role.filled_capacity,
    remaining_capacity: role.remaining_capacity,
    status: role.status,
    tools: role.tools.map(item => toMasterItem(item, 'Tool')),
    skill_tags: role.skills.map(item => item.name)
  }))
  const ownerRole = detail.owner_role?.contribution_role

  return {
    id: detail.id,
    creator_id: detail.ownership.created_by_user_id,
    title: detail.title,
    slug: detail.slug,
    summary: detail.summary,
    description: detail.description,
    project_category: detail.project_category,
    visibility: detail.visibility,
    status: detail.status,
    max_slots: roles.reduce((total, role) => total + role.capacity, 0),
    start_date: detail.start_date,
    deadline: detail.deadline,
    why_join: detail.why_collaborative,
    created_at: detail.created_at,
    published_at: detail.published_at,
    project_roles: roles,
    owner_contribution_role_id: detail.owner_role?.contribution_role_id ?? null,
    owner_contribution_role: ownerRole ? toMasterItem(ownerRole, 'Contribution Role') : null,
    creation_mode: detail.creation_mode,
    origin: detail.origin,
    why_collaborative: detail.why_collaborative,
    contributor_outcome: detail.contributor_outcome,
    owner_commitment: detail.owner_commitment,
    lead_expectations: detail.lead_expectations,
    hours_per_week: detail.hours_per_week,
    owner_id: detail.ownership.owner_id,
    initiator_organization_id: detail.ownership.initiator_organization_id,
    owner_profile: detail.ownership.owner_profile ?? null,
    initiator_profile: detail.ownership.show_initiator ? detail.ownership.initiator_profile ?? null : null,
    initiator_organization: detail.ownership.initiator_organization ?? null,
    profiles: detail.ownership.owner_profile ?? undefined,
    creator: detail.ownership.show_initiator ? detail.ownership.initiator_profile ?? undefined : undefined,
    capabilities: detail.capabilities
  }
}
