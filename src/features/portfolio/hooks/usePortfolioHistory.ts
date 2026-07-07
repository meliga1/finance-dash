import { useQuery } from '@tanstack/react-query'
import type { CurrencyCode } from '@/types/common'
import type { HistoryPeriod } from '@/features/portfolio/types'
import { getPortfolioHistory } from '@/features/portfolio/services'
import { portfolioKeys } from './keys'

const DEFAULT_LIMIT: Record<HistoryPeriod, number> = {
  daily: 30,
  weekly: 12,
  monthly: 12,
}

export function usePortfolioHistory(
  currency: CurrencyCode,
  period: HistoryPeriod = 'monthly',
  limit = DEFAULT_LIMIT[period],
) {
  return useQuery({
    queryKey: portfolioKeys.history(currency, period, limit),
    queryFn: () => getPortfolioHistory(currency, period, limit),
    staleTime: 10 * 60_000,
  })
}
