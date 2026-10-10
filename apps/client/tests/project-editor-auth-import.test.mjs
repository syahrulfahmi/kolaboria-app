import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const editorSource = await readFile(
  new URL('../app/components/project/editor/ProjectEditor.vue', import.meta.url),
  'utf8'
)

test('project editor imports the auth composable explicitly', () => {
  assert.match(
    editorSource,
    /import \{ useAuth \} from ['"]~\/composables\/useAuth['"]/
  )
})
