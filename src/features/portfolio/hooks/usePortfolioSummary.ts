import { useQuery } from '@tanstack/react-query'
import type { CurrencyCode } from '@/types/common'
import { getPortfolioSummary } from '@/features/portfolio/services'
import { portfolioKeys } from './keys'

export function usePortfolioSummary(currency: CurrencyCode) {
  return useQuery({
    queryKey: portfolioKeys.summary(currency),
    queryFn: () => getPortfolioSummary(currency),
  })
}
