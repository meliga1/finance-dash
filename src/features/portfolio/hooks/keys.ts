import type { CurrencyCode } from '@/types/common'
import type { HistoryPeriod } from '@/features/portfolio/types'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  summary: (currency: CurrencyCode) => [...portfolioKeys.all, 'summary', currency] as const,
  history: (currency: CurrencyCode, period: HistoryPeriod, limit: number) =>
    [...portfolioKeys.all, 'history', currency, period, limit] as const,
}
