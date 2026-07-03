import type { CurrencyCode } from '@/types/common'
import type { PortfolioSummary, PortfolioHistoryPoint } from '@/features/portfolio/types'
import { getAssets } from '@/features/assets/services'
import { ASSET_METADATA } from '@/features/assets/holdings'
import { fetchLiveHoldings } from '@/services/portfolioApi'
import { fetchMonthlyKlines } from '@/services/binance'
import { fetchUsdToBrlRate } from '@/services/exchangeRate'

const round2 = (value: number) => Math.round(value * 100) / 100

// GET /portfolio/summary?currency=BRL — agregado a partir dos preços e
// quantidades reais dos ativos
export async function getPortfolioSummary(
  currency: CurrencyCode,
): Promise<PortfolioSummary> {
  const assets = await getAssets(currency)

  const totalValue = round2(assets.reduce((sum, asset) => sum + asset.totalValue, 0))
  const changeAbsolute = round2(
    assets.reduce((sum, asset) => sum + asset.change24h.absolute, 0),
  )
  const previousValue = totalValue - changeAbsolute
  const changePercentage =
    previousValue !== 0 ? round2((changeAbsolute / previousValue) * 100) : 0

  const averageBuyPriceBySymbol = new Map(
    ASSET_METADATA.map((metadata) => [metadata.symbol, metadata.averageBuyPriceBRL]),
  )
  const costBasisBRL = assets.reduce(
    (sum, asset) => sum + asset.quantity * (averageBuyPriceBySymbol.get(asset.symbol) ?? 0),
    0,
  )
  const costBasis =
    currency === 'USD' ? round2(costBasisBRL / (await fetchUsdToBrlRate())) : round2(costBasisBRL)

  const profitAbsolute = round2(totalValue - costBasis)
  const profitPercentage = costBasis !== 0 ? round2((profitAbsolute / costBasis) * 100) : 0

  return {
    totalValue,
    change24h: { absolute: changeAbsolute, percentage: changePercentage },
    estimatedProfit: { absolute: profitAbsolute, percentage: profitPercentage },
    currency,
  }
}

function monthLabel(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// GET /portfolio/history?currency=BRL&months=12 — reconstruído a partir dos
// candles mensais (Binance klines, 1M) de cada ativo multiplicados pela
// quantidade real atual em carteira (Bybit). Assume que a quantidade de hoje
// foi mantida ao longo de todo o período — mesma simplificação de antes,
// só que agora com a quantidade vinda ao vivo em vez de fixa.
export async function getPortfolioHistory(
  currency: CurrencyCode,
  months = 12,
): Promise<PortfolioHistoryPoint[]> {
  const [liveHoldings, klinesByAsset] = await Promise.all([
    fetchLiveHoldings(),
    Promise.all(ASSET_METADATA.map((metadata) => fetchMonthlyKlines(`${metadata.symbol}BRL`, months))),
  ])

  const quantityBySymbol = new Map(liveHoldings.map((holding) => [holding.symbol, holding.quantity]))

  const pointCount = Math.min(...klinesByAsset.map((klines) => klines.length))

  const historyBRL: PortfolioHistoryPoint[] = Array.from({ length: pointCount }, (_, index) => {
    const value = klinesByAsset.reduce((sum, klines, assetIndex) => {
      const point = klines[klines.length - pointCount + index]
      const quantity = quantityBySymbol.get(ASSET_METADATA[assetIndex].symbol) ?? 0
      return sum + point.close * quantity
    }, 0)

    const referenceKlines = klinesByAsset[0]
    const label = monthLabel(referenceKlines[referenceKlines.length - pointCount + index].openTime)

    return { date: label, value: round2(value) }
  })

  if (currency === 'BRL') return historyBRL

  const rate = await fetchUsdToBrlRate()
  return historyBRL.map((point) => ({ date: point.date, value: round2(point.value / rate) }))
}
