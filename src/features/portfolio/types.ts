import type { CurrencyCode, PriceChange } from '@/types/common'

// GET /portfolio/summary
export interface PortfolioSummary {
  totalValue: number
  change24h: PriceChange
  estimatedProfit: PriceChange
  currency: CurrencyCode
}

// GET /portfolio/history
export interface PortfolioHistoryPoint {
  date: string // "YYYY-MM"
  value: number
}
