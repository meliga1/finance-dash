import type { CurrencyCode } from '@/types/common'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  summary: (currency: CurrencyCode) => [...portfolioKeys.all, 'summary', currency] as const,
  history: (currency: CurrencyCode, months: number) =>
    [...portfolioKeys.all, 'history', currency, months] as const,
}
