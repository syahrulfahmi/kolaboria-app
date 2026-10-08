import assert from 'node:assert/strict'
import test from 'node:test'
import { ref } from 'vue'

import '../tests/helpers/frontend-runtime.mjs'

test('useInfiniteScroll triggers onLoadMore and updates loading state', async () => {
  const { useInfiniteScroll } = await import(
    '../app/composables/useInfiniteScroll.ts'
  )

  let loadCallCount = 0
  const hasMore = ref(true)

  const { isLoading, triggerLoad } = useInfiniteScroll({
    hasMore,
    onLoadMore: async () => {
      loadCallCount++
    }
  })

  assert.equal(isLoading.value, false)
  assert.equal(loadCallCount, 0)

  await triggerLoad()

  assert.equal(loadCallCount, 1)
  assert.equal(isLoading.value, false)
})

test('useInfiniteScroll respects disabled and hasMore guards', async () => {
  const { useInfiniteScroll } = await import(
    '../app/composables/useInfiniteScroll.ts'
  )

  let loadCallCount = 0
  const hasMore = ref(false)
  const disabled = ref(false)

  const { triggerLoad } = useInfiniteScroll({
    hasMore,
    disabled,
    onLoadMore: async () => {
      loadCallCount++
    }
  })

  // Should not trigger when hasMore is false
  await triggerLoad()
  assert.equal(loadCallCount, 0)

  // Turn hasMore true, but disabled true
  hasMore.value = true
  disabled.value = true
  await triggerLoad()
  assert.equal(loadCallCount, 0)

  // Enable and trigger
  disabled.value = false
  await triggerLoad()
  assert.equal(loadCallCount, 1)
})
