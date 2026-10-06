import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PROFILE_EDIT_MENU_ITEMS,
  PROFILE_EDIT_ROOT_PATH,
  canShowProfileEditActions,
  getProfileEditPageMeta
} from '../app/data/profile-edit-navigation.ts'

test('profile edit menu keeps the established child routes', () => {
  assert.deepEqual(
    PROFILE_EDIT_MENU_ITEMS.map(({ path }) => path),
    [
      '/profile/me/edit/basic',
      '/profile/me/edit/skills',
      '/profile/me/edit/career'
    ]
  )
})

test('profile edit menu copy matches the mobile section list', () => {
  assert.deepEqual(
    PROFILE_EDIT_MENU_ITEMS.map(({ menuLabel, description }) => ({
      menuLabel,
      description
    })),
    [
      {
        menuLabel: 'Informasi Dasar',
        description: 'Nama, headline, lokasi, bio, dan tautan profesional.'
      },
      {
        menuLabel: 'Skills & Tools',
        description: 'Kemampuan utama dan teknologi yang kamu kuasai.'
      },
      {
        menuLabel: 'Pengalaman',
        description: 'Riwayat kerja, project, organisasi, dan pengalaman relevan.'
      }
    ]
  )
})

test('profile edit root metadata returns to the profile overview', () => {
  assert.deepEqual(getProfileEditPageMeta(PROFILE_EDIT_ROOT_PATH), {
    title: 'Edit Profil',
    isMenu: true
  })
})

test('profile edit child metadata uses the section title and menu as back path', () => {
  assert.deepEqual(getProfileEditPageMeta('/profile/me/edit/basic'), {
    title: 'Informasi Dasar',
    isMenu: false
  })
})

test('routes outside profile editing have no editor navbar metadata', () => {
  assert.equal(getProfileEditPageMeta('/profile/me'), null)
  assert.equal(getProfileEditPageMeta('/profile/me/edit/portfolio'), null)
  assert.equal(getProfileEditPageMeta('/projects/my-projects'), null)
})

test('save actions are hidden on the menu and require an active form page', () => {
  assert.equal(canShowProfileEditActions(PROFILE_EDIT_ROOT_PATH, true), false)
  assert.equal(canShowProfileEditActions('/profile/me/edit/basic', true), true)
  assert.equal(canShowProfileEditActions('/profile/me/edit/basic', false), false)
})
