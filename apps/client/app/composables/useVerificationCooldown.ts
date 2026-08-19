import { ref, computed, onMounted, onBeforeUnmount, unref, watch, type MaybeRef } from 'vue'

const STORAGE_KEY = 'kolaboria:verification-resend-cooldowns'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function loadCooldownMap(): Record<string, string> {
  if (!import.meta.client) return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveCooldownMap(map: Record<string, string>): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignore storage quota or disabled errors
  }
}

export function getAvailableAt(email: string): string | null {
  if (!email) return null
  const normalized = normalizeEmail(email)
  const map = loadCooldownMap()
  const timestamp = map[normalized]
  if (!timestamp) return null

  const parsedTime = Date.parse(timestamp)
  if (isNaN(parsedTime) || parsedTime <= Date.now()) {
    clearAvailableAt(email)
    return null
  }

  return timestamp
}

export function setAvailableAt(email: string, availableAtIso: string): void {
  if (!email || !availableAtIso) return
  const parsedTime = Date.parse(availableAtIso)
  if (isNaN(parsedTime) || parsedTime <= Date.now()) return

  const normalized = normalizeEmail(email)
  const map = loadCooldownMap()
  map[normalized] = availableAtIso
  saveCooldownMap(map)
}

export function clearAvailableAt(email: string): void {
  if (!email) return
  const normalized = normalizeEmail(email)
  const map = loadCooldownMap()
  if (map[normalized]) {
    delete map[normalized]
    saveCooldownMap(map)
  }
}

export function useVerificationCooldown(emailInput?: MaybeRef<string | undefined | null>) {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | null = null

  const targetEmail = computed(() => {
    const val = unref(emailInput)
    return val ? normalizeEmail(val) : ''
  })

  const availableAt = ref<string | null>(null)

  const syncAvailableAt = () => {
    if (!targetEmail.value) {
      availableAt.value = null
      return
    }
    availableAt.value = getAvailableAt(targetEmail.value)
  }

  const remainingSeconds = computed(() => {
    if (!availableAt.value) return 0
    const diff = Date.parse(availableAt.value) - now.value
    const remaining = Math.max(0, Math.ceil(diff / 1000))
    if (remaining === 0 && availableAt.value && targetEmail.value) {
      clearAvailableAt(targetEmail.value)
    }
    return remaining
  })

  const isCoolingDown = computed(() => remainingSeconds.value > 0)

  const updateAvailableAt = (timestamp: string) => {
    if (!targetEmail.value) return
    setAvailableAt(targetEmail.value, timestamp)
    syncAvailableAt()
    now.value = Date.now()
  }

  const startTimer = () => {
    if (timer) return
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  watch(targetEmail, () => {
    syncAvailableAt()
    now.value = Date.now()
  }, { immediate: true })

  onMounted(() => {
    syncAvailableAt()
    startTimer()
  })

  onBeforeUnmount(() => {
    stopTimer()
  })

  return {
    availableAt,
    remainingSeconds,
    isCoolingDown,
    setAvailableAt: updateAvailableAt,
    getAvailableAt: (email: string) => getAvailableAt(email),
    clearAvailableAt: (email: string) => {
      clearAvailableAt(email)
      syncAvailableAt()
    }
  }
}
