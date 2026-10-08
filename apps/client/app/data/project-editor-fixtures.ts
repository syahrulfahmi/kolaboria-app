import type { ProjectEditorDraft, ProjectEditorRecord, ProjectEditorReferences } from '../types/project-editor'

const makeBlankDraft = (): ProjectEditorDraft => ({
  creation_mode: 'personal', initiator_organization_id: null, lead_expectations: '',
  title: '', summary: '', description: '', slug: '', project_category: 'product', visibility: 'public',
  roles: [{ client_key: 'role-create-1', description: '', capacity: 1, filled_capacity: 0, tool_ids: [], skill_tags: [] }],
  tool_ids: [], origin: 'personal', why_collaborative: '', contributor_outcome: '', owner_commitment: '',
  client_acknowledgement: false, start_date: null, deadline: null, availability: 'flexible',
  hours_per_week: 10, collaboration_agreement: false
})

export const createBlankProjectEditorDraft = (): ProjectEditorDraft => structuredClone(makeBlankDraft())

export const createProjectEditorReferences = (): ProjectEditorReferences => ({
  contribution_roles: [
    { id: 'role-frontend', name: 'Frontend Developer', slug: 'frontend', category: 'Contribution Role' },
    { id: 'role-backend', name: 'Backend Developer', slug: 'backend', category: 'Contribution Role' },
    { id: 'role-designer', name: 'UI/UX Designer', slug: 'ui-ux-designer', category: 'Contribution Role' }
  ],
  tools: [
    { id: 'tool-nuxt', name: 'Nuxt', slug: 'nuxt', category: 'Framework' },
    { id: 'tool-typescript', name: 'TypeScript', slug: 'typescript', category: 'Language' },
    { id: 'tool-go', name: 'Go', slug: 'go', category: 'Language' },
    { id: 'tool-postgres', name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
    { id: 'tool-figma', name: 'Figma', slug: 'figma', category: 'Design' },
    { id: 'tool-tailwind', name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Framework' }
  ],
  skill_suggestions: ['Vue.js', 'Nuxt', 'TypeScript', 'REST API', 'PostgreSQL', 'Figma', 'Design System', 'Usability Testing']
})

const createFixture = (): ProjectEditorRecord => ({
  id: 'preview-project-platform-portofolio-talenta-digital',
  slug: 'platform-portofolio-talenta-digital',
  status: 'open', version: 1, saved_at: '2026-10-07T09:00:00.000Z',
  draft: {
    ...makeBlankDraft(),
    title: 'Platform Portofolio untuk Talenta Digital',
    summary: 'Membangun platform yang membantu talenta menunjukkan pengalaman proyek secara lebih terstruktur.',
    description: 'Platform ini membantu talenta mengubah kontribusi nyata dalam proyek menjadi pengalaman yang dapat ditampilkan dalam portfolio.',
    slug: 'platform-portofolio-talenta-digital',
    roles: [
      { client_key: 'role-fixture-frontend', id: 'fixture-role-frontend', contribution_role_id: 'role-frontend', description: 'Membangun Project Hub, flow aplikasi, integrasi API, dan pengalaman pengguna desktop serta mobile.', capacity: 2, filled_capacity: 1, tool_ids: ['tool-nuxt', 'tool-typescript'], skill_tags: ['Vue.js', 'Nuxt', 'TypeScript'] },
      { client_key: 'role-fixture-backend', id: 'fixture-role-backend', contribution_role_id: 'role-backend', description: 'Merancang REST API, aturan aplikasi, database, autentikasi, dan integrasi workspace.', capacity: 2, filled_capacity: 0, tool_ids: ['tool-go', 'tool-postgres'], skill_tags: ['Go', 'PostgreSQL', 'REST API'] },
      { client_key: 'role-fixture-designer', id: 'fixture-role-designer', contribution_role_id: 'role-designer', description: 'Menyusun alur pengguna, wireframe, design system, serta mengevaluasi kemudahan penggunaan.', capacity: 1, filled_capacity: 0, tool_ids: ['tool-figma'], skill_tags: ['Figma', 'UI/UX Design'] }
    ],
    tool_ids: ['tool-nuxt', 'tool-postgres', 'tool-tailwind'],
    why_collaborative: 'Proyek memerlukan perspektif engineering dan design agar solusi nyaman digunakan.',
    contributor_outcome: 'Kontributor mendapat pengalaman membangun produk serta hasil kerja untuk ditampilkan di portofolio.',
    owner_commitment: 'Saya akan terlibat dalam perencanaan produk, diskusi teknis, review, dan pengambilan keputusan.',
    start_date: '2026-10-15', deadline: '2026-12-15', availability: 'part_time', hours_per_week: 10,
    collaboration_agreement: true
  }
})

export const createProjectEditorFixture = (slug: string): ProjectEditorRecord | null =>
  slug === 'platform-portofolio-talenta-digital' ||
  slug === 'platform-portofolio-untuk-talenta-digital'
    ? structuredClone(createFixture())
    : null
