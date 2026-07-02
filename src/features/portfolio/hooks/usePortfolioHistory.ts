import { useQuery } from '@tanstack/react-query'
import type { CurrencyCode } from '@/types/common'
import { getPortfolioHistory } from '@/features/portfolio/services'
import { portfolioKeys } from './keys'

export function usePortfolioHistory(currency: CurrencyCode, months = 12) {
  return useQuery({
    queryKey: portfolioKeys.history(currency, months),
    queryFn: () => getPortfolioHistory(currency, months),
  })
}
