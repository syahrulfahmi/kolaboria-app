import assert from 'node:assert/strict'
import test from 'node:test'
import { createRenderer, h, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { readFileSync } from 'node:fs'
import { compileScript, parse } from 'vue/compiler-sfc'
import ts from 'typescript'
import { mountSetup } from './helpers/frontend-runtime.mjs'

test('login and register bootstrap do not fetch a session before showing the form', async () => {
  const originalWindow = globalThis.window
  const originalAuth = globalThis.useAuth
  const originalPlugin = globalThis.defineNuxtPlugin
  globalThis.defineNuxtPlugin = plugin => plugin
  let requests = 0
  globalThis.useAuth = () => ({ fetchCurrentUser: async () => { requests++ } })
  try {
    const { default: bootstrap } = await import('../app/plugins/auth.ts')
    for (const pathname of ['/login', '/register', '/register/']) {
      globalThis.window = { location: { pathname } }
      await bootstrap()
    }
    assert.equal(requests, 0)
    globalThis.window = { location: { pathname: '/home' } }
    await bootstrap()
    assert.equal(requests, 1, 'other routes keep session hydration')
  } finally {
    globalThis.window = originalWindow
    globalThis.useAuth = originalAuth
    globalThis.defineNuxtPlugin = originalPlugin
  }
})

test('root renders without using navigation as a data-loading signal', async () => {
  const previousPopup = globalThis.usePopup
  const previousIndicator = globalThis.useLoadingIndicator
  globalThis.usePopup = () => ({ isOpen: ref(false), options: ref({}), handlePositive() {}, handleNegative() {} })
  globalThis.useLoadingIndicator = () => { throw new Error('Navigation alone must not display a loader') }
  try {
    const { default: App } = await import('../app/app.vue')
    const mounted = mountSetup(() => App.setup({}, { expose() {} }))
    mounted.unmount()
  } finally {
    globalThis.usePopup = previousPopup
    globalThis.useLoadingIndicator = previousIndicator
  }
})

test('fast requests never flash a spinner and slower requests stop immediately', async context => {
  const { useDelayedLoading } = await import('../app/composables/useDelayedLoading.ts')
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const pending = ref(false)
  const mounted = mountSetup(() => useDelayedLoading(pending))
  try {
    assert.equal(mounted.bindings.value, false)
    pending.value = true
    await nextTick()
    context.mock.timers.tick(100)
    assert.equal(mounted.bindings.value, false)
    pending.value = false
    await nextTick()
    context.mock.timers.tick(200)
    assert.equal(mounted.bindings.value, false)

    pending.value = true
    await nextTick()
    context.mock.timers.tick(150)
    assert.equal(mounted.bindings.value, true)
    pending.value = false
    await nextTick()
    assert.equal(mounted.bindings.value, false)
  } finally { mounted.unmount() }
})

test('leaving a loading page cancels its timer', async context => {
  const { useDelayedLoading } = await import('../app/composables/useDelayedLoading.ts')
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const mounted = mountSetup(() => useDelayedLoading(ref(true)))
  mounted.unmount()
  context.mock.timers.tick(1000)
  assert.equal(mounted.bindings.value, false)
})

// Compile the real template too: these checks exercise rendered branches and
// component identity rather than only reading the loading implementation.
async function renderContent(state, slot) {
  const source = readFileSync(new URL('../app/components/ui/organisms/AsyncContent.vue', import.meta.url), 'utf8')
  const compiled = compileScript(parse(source).descriptor, { id: 'async-content-test', inlineTemplate: true }).content
  const code = ts.transpileModule(compiled.replace(/from ["']vue["']/g, `from '${import.meta.resolve('vue')}'`), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText
  const { default: AsyncContent } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  const node = (tag = '') => ({ tag, text: '', props: {}, children: [], parent: null })
  const renderer = createRenderer({
    createElement: node, createText: text => ({ ...node(), text }), createComment: () => node(),
    setText: (target, text) => { target.text = text },
    setElementText: (target, text) => { target.text = text; target.children = [] },
    patchProp: (target, key, _previous, value) => { target.props[key] = value },
    parentNode: target => target.parent,
    nextSibling: target => target.parent?.children[target.parent.children.indexOf(target) + 1],
    insert(target, parent, anchor) {
      if (target.parent) target.parent.children.splice(target.parent.children.indexOf(target), 1)
      target.parent = parent
      const index = anchor ? parent.children.indexOf(anchor) : -1
      parent.children.splice(index < 0 ? parent.children.length : index, 0, target)
    },
    remove(target) {
      target.parent?.children.splice(target.parent.children.indexOf(target), 1)
      target.parent = null
    }
  })
  const container = node()
  const app = renderer.createApp({ setup: () => () => h(AsyncContent, state, { default: slot }) })
  app.component('MoleculeLoading', { setup: () => () => h('div', { role: 'status' }, 'Loading') })
  app.mount(container)
  const text = target => target.text + target.children.map(text).join('')
  return { text: () => text(container), root: () => container.children[0], unmount: () => app.unmount() }
}

test('initial loading never exposes an empty/error slot and reveals completed content immediately', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const state = reactive({ pending: true })
  const content = ref('Failed to load')
  const rendered = await renderContent(state, () => h('p', content.value))
  try {
    assert.equal(rendered.text(), '')
    context.mock.timers.tick(150)
    await nextTick()
    assert.equal(rendered.text(), 'Loading')
    content.value = 'Loaded content'
    state.pending = false
    await nextTick()
    assert.equal(rendered.text(), 'Loaded content')
    assert.equal(rendered.root().props['aria-busy'], false)
  } finally { rendered.unmount() }
})

test('background refresh preserves the mounted editor and its unsaved state', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const state = reactive({ pending: false, ready: true })
  let mounts = 0
  let unmounts = 0
  const Editor = { setup() {
    onMounted(() => { mounts++ })
    onUnmounted(() => { unmounts++ })
    const draft = ref('Unsaved reflection')
    return () => h('p', draft.value)
  } }
  const rendered = await renderContent(state, () => h(Editor))
  try {
    state.pending = true
    await nextTick()
    context.mock.timers.tick(500)
    await nextTick()
    assert.equal(rendered.text(), 'Unsaved reflection')
    assert.equal(rendered.root().props['aria-busy'], true)
    state.pending = false
    await nextTick()
    assert.equal(mounts, 1)
    assert.equal(unmounts, 0)
  } finally { rendered.unmount() }
})
