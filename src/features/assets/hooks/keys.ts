import type { CurrencyCode } from '@/types/common'

export const assetsKeys = {
  all: ['assets'] as const,
  list: (currency: CurrencyCode) => [...assetsKeys.all, 'list', currency] as const,
}
