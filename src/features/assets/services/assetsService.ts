import type { CurrencyCode } from '@/types/common'
import type { Asset } from '@/features/assets/types'
import { fetchTicker } from '@/services/binance'
import { fetchLiveHoldings } from '@/services/portfolioApi'
import { fetchTrackedAssets } from './assetsApi'

const round2 = (value: number) => Math.round(value * 100) / 100
const round1 = (value: number) => Math.round(value * 10) / 10

// USDT é pareado ao dólar 1:1 — a Binance não lista um par USDT/USDT.
const USDT_USD_PRICE = 1

function pairSymbol(baseSymbol: string, currency: CurrencyCode): string {
  return currency === 'BRL' ? `${baseSymbol}BRL` : `${baseSymbol}USDT`
}

// GET /assets?currency=BRL — ativos rastreados (cadastrados manualmente ou
// descobertos via saldo na Bybit) + quantidade real via Bybit + cotações
// reais via Binance (ticker/24hr)
export async function getAssets(currency: CurrencyCode): Promise<Asset[]> {
  const trackedAssets = await fetchTrackedAssets()

  const pairsToFetch = trackedAssets
    .filter((metadata) => !(metadata.symbol === 'USDT' && currency === 'USD'))
    .map((metadata) => pairSymbol(metadata.symbol, currency))

  const [liveHoldings, tickers] = await Promise.all([
    fetchLiveHoldings(),
    Promise.all(pairsToFetch.map((symbol) => fetchTicker(symbol))),
  ])

  const quantityBySymbol = new Map(liveHoldings.map((holding) => [holding.symbol, holding.quantity]))
  const bySymbol = new Map(
    tickers.filter((ticker) => ticker !== null).map((ticker) => [ticker.symbol, ticker]),
  )

  const withValue = trackedAssets.flatMap((metadata) => {
    let currentPrice: number
    let changePercentage: number

    if (metadata.symbol === 'USDT' && currency === 'USD') {
      currentPrice = USDT_USD_PRICE
      changePercentage = 0
    } else {
      const ticker = bySymbol.get(pairSymbol(metadata.symbol, currency))
      if (!ticker) {
        // Ativo rastreado sem par correspondente na Binance (ex.: moeda sem
        // par BRL/USDT direto) — não dá pra precificar, então fica de fora
        // em vez de derrubar a lista inteira.
        console.warn(`Sem cotação disponível para ${metadata.symbol} — ignorado.`)
        return []
      }
      currentPrice = Number(ticker.lastPrice)
      changePercentage = round2(Number(ticker.priceChangePercent))
    }

    const quantity = quantityBySymbol.get(metadata.symbol) ?? 0
    const totalValue = round2(quantity * currentPrice)
    const changeAbsolute = round2(totalValue * (changePercentage / 100))

    return [{ ...metadata, quantity, currentPrice, totalValue, changePercentage, changeAbsolute }]
  })

  const total = round2(withValue.reduce((sum, item) => sum + item.totalValue, 0))

  const allocations = withValue.map((item) =>
    total === 0 ? 0 : round1((item.totalValue / total) * 100),
  )

  // Corrige o desvio de arredondamento no maior ativo para somar exatamente 100%.
  if (total !== 0 && withValue.length > 0) {
    const largestIndex = withValue.reduce(
      (maxIndex, item, index, arr) =>
        item.totalValue > arr[maxIndex].totalValue ? index : maxIndex,
      0,
    )
    const allocationSum = allocations.reduce((sum, value) => sum + value, 0)
    allocations[largestIndex] = round1(allocations[largestIndex] + (100 - allocationSum))
  }

  return withValue.map((item, index) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    quantity: item.quantity,
    currentPrice: item.currentPrice,
    totalValue: item.totalValue,
    change24h: {
      absolute: item.changeAbsolute,
      percentage: item.changePercentage,
    },
    allocation: allocations[index],
  }))
}
