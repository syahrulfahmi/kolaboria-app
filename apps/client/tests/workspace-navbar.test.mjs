import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import './helpers/frontend-runtime.mjs'

const { default: WorkspaceNavbar } = await import('../app/components/workspace/WorkspaceNavbar.vue')
const navbarSource = readFileSync(new URL('../app/components/workspace/WorkspaceNavbar.vue', import.meta.url), 'utf8')

globalThis.useAuth = () => ({
  user: { value: { name: 'Fahmi Pratama', email: 'fahmi@example.test' } },
  logout: async () => {}
})
globalThis.useProfile = () => ({ getProfile: async () => null })
globalThis.useRouter = () => ({ push: async () => {} })
globalThis.useClickOutside = () => {}

const renderNavbar = async (props) => {
  const app = createSSRApp({ render: () => h(WorkspaceNavbar, props) })
  app.component('NuxtLink', defineComponent({
    props: { to: { type: String, required: true } },
    setup(linkProps, { attrs, slots }) {
      return () => h('a', { ...attrs, href: linkProps.to }, slots.default?.())
    }
  }))
  app.component('AtomicAvatar', defineComponent({
    props: { name: { type: String, required: true }, size: { type: String } },
    setup(avatarProps) {
      return () => h('span', { 'data-avatar': avatarProps.size }, avatarProps.name)
    }
  }))
  app.component('AtomicButton', defineComponent({
    setup(_, { attrs, slots }) {
      return () => h('button', attrs, slots.default?.())
    }
  }))
  return renderToString(app)
}

test('workspace navbar shows the real project breadcrumb and links the signed-in user to their profile', async () => {
  const html = await renderNavbar({
    projectSlug: 'platform-edukasi-digital',
    projectTitle: 'Platform Edukasi Digital',
    userName: 'Fahmi Pratama',
    viewerRoleLabel: 'Project Owner'
  })

  assert.match(html, /aria-label="Breadcrumb workspace"/)
  assert.match(html, /href="\/projects\/platform-edukasi-digital"/)
  assert.match(html, /Platform Edukasi Digital/)
  assert.match(html, /aria-label="Menu pengguna Fahmi Pratama"/)
  assert.match(html, /aria-haspopup="menu"/)
  assert.match(html, /aria-expanded="false"/)
  assert.match(html, /Fahmi Pratama/)
  assert.match(html, /Project Owner/)
  assert.match(navbarSource, /Profil Saya/)
  assert.match(navbarSource, /Pusat Bantuan/)
  assert.match(navbarSource, /Keluar/)
  assert.match(navbarSource, /role="menu"/)
  assert.doesNotMatch(navbarSource, /ChevronDown/)
  assert.match(html, /shrink-0/)
  assert.doesNotMatch(html, /Demo|Skenario demo|Lihat sebagai pengguna demo/)
})

test('workspace navbar remains useful on mobile while project title can truncate beside the profile avatar', async () => {
  const html = await renderNavbar({
    projectSlug: 'platform-edukasi-digital',
    projectTitle: 'Platform Edukasi Digital',
    userName: 'Fahmi Pratama',
    viewerRoleLabel: 'Project Owner'
  })

  assert.match(html, /min-w-0/)
  assert.match(html, /truncate/)
  assert.match(html, /data-avatar="sm"/)
  assert.match(html, /hidden min-w-0 text-right sm:block/)
  assert.match(html, /aria-haspopup="menu"/)
})
