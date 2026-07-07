interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

// Memoização simples em memória — processo único, usuário único, sem
// necessidade de nada mais sofisticado que isso.
export async function getCached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const cached = store.get(key) as CacheEntry<T> | undefined
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  const value = await fn()
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
  return value
}
