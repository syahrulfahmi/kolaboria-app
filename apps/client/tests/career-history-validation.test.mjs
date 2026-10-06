import assert from 'node:assert/strict'
import test from 'node:test'

import '../tests/helpers/frontend-runtime.mjs'
import { careerHistoryFormSchema } from '../app/data/career-history-validation.ts'

const currentYear = new Date().getFullYear()

const validCareer = {
  title: 'Product Designer',
  company: 'Kolaboria',
  start_year: 2023,
  start_month: 1,
  end_year: null,
  end_month: null,
  description: 'Mendesain pengalaman produk.',
  is_current: true
}

test('career form accepts fields supported by the API contract', () => {
  assert.deepEqual(careerHistoryFormSchema.parse(validCareer), validCareer)
})

test('career form enforces API length and year constraints', () => {
  const invalidCareers = [
    { ...validCareer, title: 'x'.repeat(151) },
    { ...validCareer, company: 'x'.repeat(151) },
    { ...validCareer, start_year: 1949 },
    { ...validCareer, start_year: currentYear + 1 },
    { ...validCareer, description: 'x'.repeat(2001) },
    { ...validCareer, end_year: 2022, is_current: false }
  ]

  for (const career of invalidCareers) {
    assert.equal(careerHistoryFormSchema.safeParse(career).success, false)
  }
})

test('career form requires an end year when the career is not current', () => {
  assert.equal(
    careerHistoryFormSchema.safeParse({
      ...validCareer,
      end_year: null,
      is_current: false
    }).success,
    false
  )
})
