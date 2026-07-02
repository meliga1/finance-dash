export const MOCK_LATENCY_MS = 600

/** Resolve com o valor após um atraso, imitando a latência de rede. */
export function delay<T>(value: T, ms: number = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}
