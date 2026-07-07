// Tipos compartilhados da aplicação — tipos por feature vivem no types.ts de cada feature

export type { CurrencyCode, PriceChange } from './common'

export type AsyncState = 'idle' | 'loading' | 'success' | 'error'

export type ApiError = {
  message: string
  status?: number
}
