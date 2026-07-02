import type { CurrencyCode } from '@/types/common'
import type { PortfolioSummary, PortfolioHistoryPoint } from '@/features/portfolio/types'
import { delay, getPortfolioSummaryMock, getPortfolioHistoryMock } from '@/mocks'

// GET /portfolio/summary?currency=BRL
export async function getPortfolioSummary(
  currency: CurrencyCode,
): Promise<PortfolioSummary> {
  // MOCK — na API real, trocar apenas o corpo desta função:
  // return http<PortfolioSummary>(`/portfolio/summary?currency=${currency}`)
  return delay(getPortfolioSummaryMock(currency))
}

// GET /portfolio/history?currency=BRL&months=12
export async function getPortfolioHistory(
  currency: CurrencyCode,
  months = 12,
): Promise<PortfolioHistoryPoint[]> {
  // MOCK — na API real:
  // const { history } = await http<{ history: PortfolioHistoryPoint[] }>(
  //   `/portfolio/history?currency=${currency}&months=${months}`,
  // )
  // return history
  return delay(getPortfolioHistoryMock(currency, months))
}
