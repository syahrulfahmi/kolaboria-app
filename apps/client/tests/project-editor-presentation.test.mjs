import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'

const presentation = await import('../app/utils/project-presentation.ts').catch(() => ({}))

test('project summary card combines role skill labels without inventing an owner profile', () => {
  assert.equal(typeof presentation.toProjectListItem, 'function')
  const item = presentation.toProjectListItem({
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    slug: 'project-summary',
    title: 'Project summary',
    summary: 'Brief publik.',
    project_category: 'product',
    origin: 'community',
    status: 'open',
    owner_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    owner_profile: {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      username: 'dian',
      full_name: 'Dian Pemilik',
      headline: 'Product builder',
      avatar: 'https://cdn.example/dian.png'
    },
    initiator_organization_id: null,
    initiator_organization: null,
    total_capacity: 4,
    filled_capacity: 2,
    hours_per_week: 10,
    deadline: '2026-12-01',
    skills: [{ id: 's1', name: 'Vue', slug: 'vue' }],
    tools: [{ id: 't1', name: 'Nuxt', slug: 'nuxt' }],
    created_at: '2026-10-08T00:00:00.000Z'
  })

  assert.equal(item.id, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
  assert.equal(item.author.name, 'Dian Pemilik')
  assert.equal(item.author.avatar, 'https://cdn.example/dian.png')
  assert.deepEqual(item.skills, ['Vue', 'Nuxt'])
  assert.equal(item.memberCount, '2 dari 4')
  assert.equal(item.acceptsContributors, true)
})

test('organization project detail keeps its initiator separate from the unassigned owner', () => {
  assert.equal(typeof presentation.toProjectDetailView, 'function')
  const project = presentation.toProjectDetailView({
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    slug: 'organization-project',
    status: 'awaiting_owner',
    version: 3,
    created_at: '2026-10-08T00:00:00.000Z',
    updated_at: '2026-10-08T00:01:00.000Z',
    published_at: null,
    creation_mode: 'organization_initiated',
    initiator_organization_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    title: 'Organization project',
    summary: 'Brief organisasi.',
    description: '',
    project_category: 'community',
    visibility: 'public',
    origin: 'community',
    why_collaborative: '',
    contributor_outcome: '',
    owner_commitment: '',
    lead_expectations: 'Memimpin koordinasi lintas kontributor.',
    client_acknowledgement: false,
    start_date: null,
    deadline: null,
    availability: 'flexible',
    hours_per_week: 5,
    collaboration_agreement: true,
    ownership: {
      created_by_user_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      initiator_user_id: null,
      initiator_organization_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      owner_id: null,
      owner_profile: null,
      initiator_profile: {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        username: 'admin-organisasi',
        full_name: 'Admin Komunitas',
        headline: null,
        avatar: null
      },
      initiator_organization: {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        name: 'Komunitas Teknologi',
        slug: 'komunitas-teknologi'
      },
      show_initiator: true,
      can_accept_contributors: false
    },
    owner_role: null,
    roles: [],
  })

  assert.equal(project.creator_id, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')
  assert.equal(project.owner_id, null)
  assert.equal(project.initiator_organization_id, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  assert.equal(project.initiator_organization?.name, 'Komunitas Teknologi')
  assert.equal(project.initiator_profile?.username, 'admin-organisasi')
  assert.equal(project.creation_mode, 'organization_initiated')
  assert.equal(project.lead_expectations, 'Memimpin koordinasi lintas kontributor.')
  assert.equal(project.availability, 'flexible')
  assert.equal(project.can_accept_contributors, false)
  assert.equal(project.capabilities, undefined)
  assert.equal(project.status, 'awaiting_owner')
})

test('project detail preserves owner, availability, role quotas and contributor eligibility from the API', () => {
  const project = presentation.toProjectDetailView({
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    slug: 'personal-project',
    status: 'open',
    version: 1,
    created_at: '2026-10-08T00:00:00.000Z',
    updated_at: '2026-10-08T00:01:00.000Z',
    published_at: '2026-10-08T00:01:00.000Z',
    creation_mode: 'personal',
    initiator_organization_id: null,
    title: 'Personal project',
    summary: 'Brief personal.',
    description: 'Detail proyek.',
    project_category: 'product',
    visibility: 'public',
    origin: 'personal',
    why_collaborative: '',
    contributor_outcome: '',
    owner_commitment: 'Melakukan review mingguan.',
    lead_expectations: '',
    client_acknowledgement: false,
    start_date: null,
    deadline: null,
    availability: 'part_time',
    hours_per_week: 10,
    collaboration_agreement: true,
    ownership: {
      created_by_user_id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
      initiator_user_id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
      initiator_organization_id: null,
      owner_id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
      owner_profile: null,
      initiator_profile: null,
      initiator_organization: null,
      show_initiator: false,
      can_accept_contributors: true
    },
    owner_role: null,
    roles: [{
      id: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
      contribution_role_id: null,
      contribution_role: null,
      description: 'Mengerjakan antarmuka.',
      capacity: 2,
      position: 1,
      skill_ids: [],
      skills: [],
      tool_ids: [],
      tools: [],
      filled_capacity: 1,
      remaining_capacity: 1,
      status: 'open'
    }],
  })

  assert.equal(project.owner_id, 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee')
  assert.equal(project.creation_mode, 'personal')
  assert.equal(project.availability, 'part_time')
  assert.equal(project.can_accept_contributors, true)
  assert.equal(project.project_roles?.[0]?.filled_capacity, 1)
  assert.equal(project.project_roles?.[0]?.remaining_capacity, 1)
})

test('project detail gives a clear contribution state for ownerless, active, full and closed projects', () => {
  assert.equal(typeof presentation.getProjectContributionAvailabilityMessage, 'function')
  const message = presentation.getProjectContributionAvailabilityMessage

  assert.equal(message('awaiting_owner', 'public', 2, 1, false), 'Proyek ini menunggu Project Lead sebelum kolaborasi dibuka.')
  assert.equal(message('in_progress', 'public', 2, 1, true), 'Proyek sudah berjalan dan tidak menerima kontributor baru.')
  assert.equal(message('open', 'public', 0, 1, true), 'Kuota kontributor untuk proyek ini sudah terpenuhi.')
  assert.equal(message('open', 'public', 2, 0, true), 'Belum ada peran kontributor yang dibuka.')
  assert.equal(message('open', 'public', 2, 1, true), 'Lamaran untuk proyek ini belum dapat diajukan saat ini.')
  assert.equal(message('open', 'invite_only', 2, 1, true), 'Proyek ini tidak membuka lamaran publik.')
  assert.equal(message('open', 'public', 2, 1, false), 'Proyek ini menunggu Project Lead sebelum kolaborasi dibuka.')
  assert.equal(message('completed', 'public', 2, 1, true), 'Proyek sudah selesai dan tidak menerima kontributor baru.')
  assert.equal(message('archived', 'public', 2, 1, true), 'Proyek ini sudah diarsipkan.')
  assert.equal(message('draft', 'public', 2, 1, false), 'Proyek ini masih berupa draf dan belum dibuka untuk kolaborasi.')
})
