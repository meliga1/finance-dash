import type { PortfolioSummary, PortfolioHistoryPoint } from '@/features/portfolio/types'
import type { CurrencyCode } from '@/types/common'
import { convertFromBRL } from './rates'
import { PORTFOLIO_TOTAL_BRL } from './assets'

const SUMMARY_BRL: PortfolioSummary = {
  totalValue: PORTFOLIO_TOTAL_BRL,
  change24h: { absolute: 3120.4, percentage: 2.09 },
  estimatedProfit: { absolute: 22340.75, percentage: 17.2 },
  currency: 'BRL',
}

// 12 meses, do mais antigo ao mais recente. O último ponto casa com o total da carteira.
const HISTORY_BRL: PortfolioHistoryPoint[] = [
  { date: '2025-07', value: 96500 },
  { date: '2025-08', value: 102300 },
  { date: '2025-09', value: 99800 },
  { date: '2025-10', value: 111200 },
  { date: '2025-11', value: 118700 },
  { date: '2025-12', value: 125400 },
  { date: '2026-01', value: 121900 },
  { date: '2026-02', value: 133600 },
  { date: '2026-03', value: 141200 },
  { date: '2026-04', value: 138900 },
  { date: '2026-05', value: 146800 },
  { date: '2026-06', value: PORTFOLIO_TOTAL_BRL },
]

export function getPortfolioSummaryMock(currency: CurrencyCode): PortfolioSummary {
  if (currency === 'BRL') return SUMMARY_BRL

  return {
    totalValue: convertFromBRL(SUMMARY_BRL.totalValue, currency),
    change24h: {
      absolute: convertFromBRL(SUMMARY_BRL.change24h.absolute, currency),
      percentage: SUMMARY_BRL.change24h.percentage,
    },
    estimatedProfit: {
      absolute: convertFromBRL(SUMMARY_BRL.estimatedProfit.absolute, currency),
      percentage: SUMMARY_BRL.estimatedProfit.percentage,
    },
    currency,
  }
}

export function getPortfolioHistoryMock(
  currency: CurrencyCode,
  months: number,
): PortfolioHistoryPoint[] {
  const converted =
    currency === 'BRL'
      ? HISTORY_BRL
      : HISTORY_BRL.map((point) => ({
          date: point.date,
          value: convertFromBRL(point.value, currency),
        }))

  // Retorna os `months` mais recentes, preservando a ordem antigo → recente.
  return converted.slice(-months)
}
