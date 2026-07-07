import type { CurrencyCode, PriceChange } from '@/types/common'

// GET /portfolio/summary
export interface PortfolioSummary {
  totalValue: number
  change24h: PriceChange
  estimatedProfit: PriceChange
  currency: CurrencyCode
}

export type HistoryPeriod = 'daily' | 'weekly' | 'monthly'

// GET /portfolio/history
export interface PortfolioHistoryPoint {
  date: string // ISO datetime
  value: number
}
