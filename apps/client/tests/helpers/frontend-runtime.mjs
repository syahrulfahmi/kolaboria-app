import { registerHooks } from 'node:module'
import { readFileSync } from 'node:fs'
import { parse, compileScript } from 'vue/compiler-sfc'
import { createRenderer } from 'vue'
import ts from 'typescript'

registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context) } catch (error) {
      if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
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
    source = source.replaceAll('import.meta.client', 'true')
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

export function mountSetup(setup) {
  let bindings
  const app = renderer.createApp({ setup() { bindings = setup(); return () => null } })
  app.mount({})
  return { bindings, unmount: () => app.unmount() }
}
