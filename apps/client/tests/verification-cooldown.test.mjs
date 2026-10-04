import assert from 'node:assert/strict'
import { test } from 'node:test'
import { computed, ref } from 'vue'
import { mountSetup } from './helpers/frontend-runtime.mjs'

const cooldown = await import('../app/composables/useVerificationCooldown.ts')
const registerForm = (await import('../app/components/auth/RegisterForm.vue')).default
const loginForm = (await import('../app/components/auth/LoginForm.vue')).default
const noticePage = (await import('../app/pages/verify-email-notice.vue')).default

test('registration immediately starts the backend deadline and resend uses the next deadline', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: Date.parse('2026-10-04T12:00:00Z') })
  const storage = new Map()
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value)
  }
  globalThis.computed = computed
  globalThis.ref = ref
  globalThis.definePageMeta = () => {}
  globalThis.useHead = () => {}
  globalThis.useVerificationCooldown = cooldown.useVerificationCooldown
  const navigations = []
  globalThis.useRouter = () => ({ push: route => navigations.push(route), replace: route => navigations.push(route) })
  globalThis.useRoute = () => ({ query: { email: 'first@example.com' } })
  let resends = 0
  globalThis.useToast = () => ({ add() {} })
  globalThis.useAuth = () => ({
    user: ref(null),
    register: async () => ({ data: { verification_resend_available_at: '2026-10-04T12:01:15Z' } }),
    resendVerification: async () => {
      resends++
      return { data: { verification_resend_available_at: new Date(Date.now() + 105_000).toISOString() } }
    }
  })
  const mounted = []
  const mountComponent = component => {
    const instance = mountSetup(() => component.setup({}, { expose() {} }))
    mounted.push(instance)
    return instance.bindings
  }
  try {
    const form = mountComponent(registerForm)
    Object.assign(form.form.value, { fullName: 'Pengguna Baru', email: 'first@example.com', password: 'Password123!', confirmPassword: 'Password123!' })
    await form.handleRegister()
    assert.equal(cooldown.getAvailableAt('first@example.com'), '2026-10-04T12:01:15Z')
    assert.equal(navigations[0].path, '/verify-email-notice')
    const notice = mountComponent(noticePage)
    assert.equal(notice.remainingSeconds.value, 75)
    assert.equal(notice.isCoolingDown.value, true)
    await notice.handleResend()
    assert.equal(resends, 0)
    t.mock.timers.tick(75_000)
    assert.equal(notice.isCoolingDown.value, false)
    await notice.handleResend()
    assert.equal(resends, 1)
    assert.equal(notice.remainingSeconds.value, 105)
  } finally {
    mounted.forEach(instance => instance.unmount())
    for (const key of ['localStorage', 'computed', 'ref', 'definePageMeta', 'useHead', 'useVerificationCooldown', 'useRouter', 'useRoute', 'useToast', 'useAuth']) delete globalThis[key]
  }
})

test('login of an unverified account continues the stored timer instead of restarting it', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: Date.parse('2026-10-04T12:00:00Z') })
  const storage = new Map()
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
  globalThis.ref = ref
  globalThis.computed = computed
  globalThis.definePageMeta = () => {}
  globalThis.useHead = () => {}
  globalThis.useVerificationCooldown = cooldown.useVerificationCooldown
  globalThis.useRoute = () => ({ query: { email: 'returning@example.com' } })
  const navigations = []
  globalThis.useRouter = () => ({ replace: route => navigations.push(route) })
  globalThis.useToast = () => ({ add() {} })
  globalThis.useAuth = () => ({
    user: ref(null),
    login: async () => ({ data: { email: 'returning@example.com', email_verified_at: null } })
  })
  cooldown.setAvailableAt('returning@example.com', '2026-10-04T12:01:15Z')
  t.mock.timers.tick(20_000)
  const login = mountSetup(() => loginForm.setup({}, { expose() {} }))
  let notice
  try {
    Object.assign(login.bindings.form.value, { email: 'returning@example.com', password: 'Password123!' })
    await login.bindings.handleLogin()
    assert.deepEqual(navigations[0], { path: '/verify-email-notice', query: { email: 'returning@example.com' } })
    notice = mountSetup(() => noticePage.setup({}, { expose() {} }))
    assert.equal(notice.bindings.remainingSeconds.value, 55)
    t.mock.timers.tick(55_000)
    assert.equal(notice.bindings.isCoolingDown.value, false)
    assert.equal(cooldown.getAvailableAt('returning@example.com'), null)
  } finally {
    login.unmount()
    notice?.unmount()
    for (const key of ['localStorage', 'computed', 'ref', 'definePageMeta', 'useHead', 'useVerificationCooldown', 'useRoute', 'useRouter', 'useToast', 'useAuth']) delete globalThis[key]
  }
})
