export const PROFILE_EDIT_ROOT_PATH = '/profile/me/edit'

export const PROFILE_EDIT_MENU_ITEMS = [
  {
    key: 'basic',
    label: 'Dasar',
    menuLabel: 'Informasi Dasar',
    title: 'Informasi Dasar',
    description: 'Nama, headline, lokasi, bio, dan tautan profesional.',
    path: `${PROFILE_EDIT_ROOT_PATH}/basic`,
    icon: 'user'
  },
  {
    key: 'skills',
    label: 'Skills & Tools',
    menuLabel: 'Skills & Tools',
    title: 'Skills & Tools',
    description: 'Kemampuan utama dan teknologi yang kamu kuasai.',
    path: `${PROFILE_EDIT_ROOT_PATH}/skills`,
    icon: 'code'
  },
  {
    key: 'career',
    label: 'Riwayat Karier',
    menuLabel: 'Pengalaman',
    title: 'Riwayat Karier',
    description: 'Riwayat kerja, project, organisasi, dan pengalaman relevan.',
    path: `${PROFILE_EDIT_ROOT_PATH}/career`,
    icon: 'academic-cap'
  }
] as const

export type ProfileEditMenuItem = (typeof PROFILE_EDIT_MENU_ITEMS)[number]

export interface ProfileEditPageMeta {
  title: string
  isMenu: boolean
}

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

export const getProfileEditPageMeta = (
  path: string
): ProfileEditPageMeta | null => {
  const normalizedPath = normalizePath(path)

  if (normalizedPath === PROFILE_EDIT_ROOT_PATH) {
    return {
      title: 'Edit Profil',
      isMenu: true
    }
  }

  const section = PROFILE_EDIT_MENU_ITEMS.find(
    (item) => item.path === normalizedPath
  )

  if (!section) return null

  return {
    title: section.title,
    isMenu: false
  }
}

export const canShowProfileEditActions = (
  path: string,
  hasPageRef: boolean
): boolean => {
  const pageMeta = getProfileEditPageMeta(path)
  return hasPageRef && pageMeta !== null && !pageMeta.isMenu
}
