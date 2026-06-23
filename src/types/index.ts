// Shared application types — feature-specific types live in each feature's types.ts

export type AsyncState = 'idle' | 'loading' | 'success' | 'error'

export type ApiError = {
  message: string
  status?: number
}
