import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'

const { ProjectService } = await import('../app/services/project.service.ts')
const { useProjects } = await import('../app/composables/useProjects.ts')

const paged = (ids, page, totalPages) => ({
  status: 200,
  message: 'ok',
  data: ids.map(id => ({ id })),
  meta: { page, limit: 100, total: totalPages * 100, total_pages: totalPages }
})

test('public project discovery consumes every API summary page', async () => {
  const original = ProjectService.getProjectSummaries
  const pages = [
    ['public-1', 'public-2'],
    ['public-3'],
    ['public-4']
  ]
  const requestedPages = []
  ProjectService.getProjectSummaries = async ({ page }) => {
    requestedPages.push(page)
    return paged(pages[page - 1] ?? [], page, pages.length)
  }
  try {
    const projects = await useProjects().getPublicProjectSummaries()
    assert.deepEqual(projects.map(project => project.id), ['public-1', 'public-2', 'public-3', 'public-4'])
    assert.deepEqual(requestedPages, [1, 2, 3])
  } finally {
    ProjectService.getProjectSummaries = original
  }
})

test('my-project lists consume all owned and initiated pages before deduplicating', async () => {
  const original = ProjectService.getMyProjectSummaries
  const requested = []
  const data = {
    owned: [['owned-1', 'shared'], ['owned-2']],
    initiated: [['shared', 'initiated-1'], ['initiated-2']]
  }
  ProjectService.getMyProjectSummaries = async (scope, { page } = {}) => {
    requested.push(`${scope}:${page}`)
    return paged(data[scope][page - 1] ?? [], page, 2)
  }
  try {
    const projects = await useProjects().getMyProjectSummaries()
    assert.deepEqual(projects.map(project => project.id).sort(), ['initiated-1', 'initiated-2', 'owned-1', 'owned-2', 'shared'])
    assert.deepEqual(requested.sort(), ['initiated:1', 'initiated:2', 'owned:1', 'owned:2'])
    assert.equal(projects.find(project => project.id === 'shared').my_scope, 'owned')
  } finally {
    ProjectService.getMyProjectSummaries = original
  }
})
