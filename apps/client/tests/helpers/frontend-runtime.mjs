import { createRequire, registerHooks } from 'node:module'
import { pathToFileURL } from 'node:url'
import { readFileSync } from 'node:fs'
import { parse, compileScript } from 'vue/compiler-sfc'
import { createRenderer } from 'vue'
import ts from 'typescript'
const nuxtRequire = createRequire(import.meta.resolve('nuxt/package.json'))

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('~/')) {
      const target = specifier.slice(2)
      return nextResolve(new URL(`../../app/${target}${/\.(?:ts|vue|mjs|cjs|js|json)$/i.test(target) ? '' : '.ts'}`, import.meta.url).href, context)
    }
    try { return nextResolve(specifier, context) } catch (error) {
      if (specifier === 'defu') return nextResolve(pathToFileURL(nuxtRequire.resolve(specifier)).href, context)
      if (specifier.startsWith('.') && !/\.(?:ts|vue|mjs|cjs|js|json)$/i.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context)
      }
      throw error
    }
  },
  load(url, context, nextLoad) {
    if (!/\.(ts|vue)$/.test(url)) return nextLoad(url, context)
    let source = readFileSync(new URL(url), 'utf8')
    if (url.endsWith('.vue')) {
      source = compileScript(parse(source).descriptor, { id: url }).content
    }
    source = source.replaceAll('import.meta.client', 'true').replaceAll('import.meta.env.PROD', 'false')
    return { format: 'module', shortCircuit: true, source: ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
    }).outputText }
  }
})

// Mount real Vue setup/lifecycle/computed logic without a DOM or component mocks.
const renderer = createRenderer({
  insert() {}, remove() {}, patchProp() {}, setText() {}, setElementText() {},
  createElement: () => ({}), createText: () => ({}), createComment: () => ({}),
  parentNode: () => null, nextSibling: () => null
})

export function mountSetup(setup, provides = []) {
  let bindings
  const app = renderer.createApp({ setup() { bindings = setup(); return () => null } })
  for (const [key, value] of provides) app.provide(key, value)
  app.mount({})
  return { bindings, unmount: () => app.unmount() }
}

export function mountComponent(component, props) {
  const app = renderer.createApp({ ...component, render: () => null }, props)
  app.mount({})
  return { bindings: app._instance.setupState, unmount: () => app.unmount() }
}
