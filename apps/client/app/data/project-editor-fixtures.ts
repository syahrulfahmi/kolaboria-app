import type { ProjectEditorDraft, ProjectEditorRecord, ProjectEditorReferences } from '../types/project-editor'

const makeBlankDraft = (): ProjectEditorDraft => ({
  creation_mode: 'personal', initiator_organization_id: null, lead_expectations: '',
  title: '', summary: '', description: '', slug: '', project_category: 'product', visibility: 'public',
  roles: [{ client_key: 'role-create-1', description: '', capacity: 1, filled_capacity: 0, tool_ids: [], skill_ids: [] }],
  origin: 'personal', why_collaborative: '', contributor_outcome: '', owner_commitment: '',
  client_acknowledgement: false, start_date: null, deadline: null, availability: 'flexible',
  hours_per_week: 10, collaboration_agreement: false
})

export const createBlankProjectEditorDraft = (): ProjectEditorDraft => structuredClone(makeBlankDraft())

export const createEmptyProjectEditorReferences = (): ProjectEditorReferences => ({
  contribution_roles: [],
  skills: [],
  tools: []
})

export const createProjectEditorReferences = (): ProjectEditorReferences => ({
  contribution_roles: [
    { id: '5838d3f2-7c00-5cc7-bf80-96e063b006e1', name: 'Frontend Developer', slug: 'frontend-developer', category: 'Contribution Role' },
    { id: '540b1676-7eb8-518d-a737-103b6499731e', name: 'Backend Developer', slug: 'backend-developer', category: 'Contribution Role' },
    { id: '227efbda-9515-5b42-aad8-83608b783b71', name: 'UI/UX Designer', slug: 'ui-ux-designer', category: 'Contribution Role' }
  ],
  skills: [
    { id: 'e61e074d-34a6-5235-93d7-c2b47ed74f02', name: 'Frontend Development', slug: 'frontend-development', category: 'Engineering' },
    { id: 'e8ffd3ee-fd4e-58bb-b739-f151ded8c2fc', name: 'Web Accessibility', slug: 'web-accessibility', category: 'Engineering' },
    { id: '95792fe6-797c-51da-8a69-f96d515268fb', name: 'Version Control', slug: 'version-control', category: 'Engineering' },
    { id: '92994309-518c-5d15-b7bf-ba77d86742de', name: 'Backend Development', slug: 'backend-development', category: 'Engineering' },
    { id: '97dba0ab-b8e3-530c-a02e-4a39ef5bab27', name: 'API Design', slug: 'api-design', category: 'Engineering' },
    { id: '3ca70ed2-4221-515e-93c3-45eb1c4d8ed3', name: 'Database Design', slug: 'database-design', category: 'Engineering' },
    { id: 'b1e7a2c6-66c9-5a31-b950-58bece85c14e', name: 'UI Design', slug: 'ui-design', category: 'Design' },
    { id: '58ee6126-a3a8-546c-a36f-e0bcb9194ad7', name: 'UX Design', slug: 'ux-design', category: 'Design' },
    { id: '9556beb4-98f1-51c8-9a36-0ff17232baa9', name: 'Wireframing', slug: 'wireframing', category: 'Design' }
  ],
  tools: [
    { id: 'c04676b1-1823-54a3-8d5e-f84bb73305b6', name: 'Nuxt', slug: 'nuxt', category: 'Framework' },
    { id: 'cc6141eb-4185-54dd-ae50-46ca9a211bee', name: 'TypeScript', slug: 'typescript', category: 'Language' },
    { id: 'c9b6abb2-a812-5c61-bf33-3351abebb50c', name: 'Go', slug: 'go', category: 'Language' },
    { id: '87677701-6f88-5782-8a67-c70eda7bf8ac', name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
    { id: 'f99a082a-7ffc-5208-b012-208fa734a8dc', name: 'Figma', slug: 'figma', category: 'Design' },
    { id: 'bfe4cf92-a270-5ebd-8e97-14dca80699f0', name: 'FigJam', slug: 'figjam', category: 'Design' },
    { id: '4dd5f467-5e80-5d47-b5a2-15430061599c', name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Framework' }
  ],
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
      { client_key: 'role-fixture-frontend', id: '50000000-0000-4000-8000-000000000001', contribution_role_id: '5838d3f2-7c00-5cc7-bf80-96e063b006e1', description: 'Membangun Project Hub, flow aplikasi, integrasi API, dan pengalaman pengguna desktop serta mobile.', capacity: 2, filled_capacity: 1, tool_ids: ['c04676b1-1823-54a3-8d5e-f84bb73305b6', 'cc6141eb-4185-54dd-ae50-46ca9a211bee'], skill_ids: ['e61e074d-34a6-5235-93d7-c2b47ed74f02', 'e8ffd3ee-fd4e-58bb-b739-f151ded8c2fc'] },
      { client_key: 'role-fixture-backend', id: '50000000-0000-4000-8000-000000000002', contribution_role_id: '540b1676-7eb8-518d-a737-103b6499731e', description: 'Merancang REST API, aturan aplikasi, database, autentikasi, dan integrasi workspace.', capacity: 2, filled_capacity: 0, tool_ids: ['c9b6abb2-a812-5c61-bf33-3351abebb50c', '87677701-6f88-5782-8a67-c70eda7bf8ac'], skill_ids: ['92994309-518c-5d15-b7bf-ba77d86742de', '97dba0ab-b8e3-530c-a02e-4a39ef5bab27', '3ca70ed2-4221-515e-93c3-45eb1c4d8ed3'] },
      { client_key: 'role-fixture-designer', id: '50000000-0000-4000-8000-000000000003', contribution_role_id: '227efbda-9515-5b42-aad8-83608b783b71', description: 'Menyusun alur pengguna, wireframe, design system, serta mengevaluasi kemudahan penggunaan.', capacity: 1, filled_capacity: 0, tool_ids: ['f99a082a-7ffc-5208-b012-208fa734a8dc', 'bfe4cf92-a270-5ebd-8e97-14dca80699f0'], skill_ids: ['b1e7a2c6-66c9-5a31-b950-58bece85c14e', '58ee6126-a3a8-546c-a36f-e0bcb9194ad7', '9556beb4-98f1-51c8-9a36-0ff17232baa9'] }
    ],
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
