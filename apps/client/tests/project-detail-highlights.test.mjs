import assert from 'node:assert/strict'
import test from 'node:test'

import './helpers/frontend-runtime.mjs'

const presentation = await import('../app/utils/project-presentation.ts').catch(() => ({}))

test('project detail presents only the outcome written for contributors', () => {
  assert.equal(typeof presentation.getProjectContributorOutcome, 'function')

  assert.equal(
    presentation.getProjectContributorOutcome({
      contributor_outcome: '  Portofolio kolaborasi dan pengalaman praktik.  '
    }),
    'Portofolio kolaborasi dan pengalaman praktik.'
  )
})

test('project detail omits the contributor outcome section when it is empty', () => {
  assert.equal(presentation.getProjectContributorOutcome({ contributor_outcome: '  ' }), null)
  assert.equal(presentation.getProjectContributorOutcome({}), null)
})
