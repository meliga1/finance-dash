import type { Asset } from '@/features/assets/types'
import type { CurrencyCode } from '@/types/common'
import { convertFromBRL } from './rates'

const round2 = (value: number) => Math.round(value * 100) / 100
const round1 = (value: number) => Math.round(value * 10) / 10

type RawHolding = {
  id: string
  symbol: string
  name: string
  quantity: number
  currentPriceBRL: number
  change24hPercentage: number
}

// Preços em BRL (base canônica do mock). Coerentes com os exemplos do contrato.
const RAW_HOLDINGS: RawHolding[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', quantity: 0.23, currentPriceBRL: 358695.65, change24hPercentage: 2.08 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', quantity: 1.45, currentPriceBRL: 18620.69, change24hPercentage: -1.4 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', quantity: 3302.75, currentPriceBRL: 5.45, change24hPercentage: 0.02 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', quantity: 62, currentPriceBRL: 217.74, change24hPercentage: 4.3 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', quantity: 9000, currentPriceBRL: 1, change24hPercentage: -0.8 },
]

function buildBrlAssets(): { assets: Asset[]; totalBRL: number } {
  const withValue = RAW_HOLDINGS.map((holding) => {
    const totalValue = round2(holding.quantity * holding.currentPriceBRL)
    const change24hAbsolute = round2(totalValue * (holding.change24hPercentage / 100))
    return { ...holding, totalValue, change24hAbsolute }
  })

  const totalBRL = round2(withValue.reduce((sum, item) => sum + item.totalValue, 0))

  const allocations = withValue.map((item) => round1((item.totalValue / totalBRL) * 100))

  // Corrige o desvio de arredondamento no maior ativo para somar exatamente 100%.
  const largestIndex = withValue.reduce(
    (maxIndex, item, index, arr) =>
      item.totalValue > arr[maxIndex].totalValue ? index : maxIndex,
    0,
  )
  const allocationSum = allocations.reduce((sum, value) => sum + value, 0)
  allocations[largestIndex] = round1(allocations[largestIndex] + (100 - allocationSum))

  const assets: Asset[] = withValue.map((item, index) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    quantity: item.quantity,
    currentPrice: item.currentPriceBRL,
    totalValue: item.totalValue,
    change24h: {
      absolute: item.change24hAbsolute,
      percentage: item.change24hPercentage,
    },
    allocation: allocations[index],
  }))

  return { assets, totalBRL }
}

const { assets: ASSETS_BRL, totalBRL: PORTFOLIO_TOTAL_BRL } = buildBrlAssets()

export { PORTFOLIO_TOTAL_BRL }

export function getAssetsMock(currency: CurrencyCode): Asset[] {
  if (currency === 'BRL') return ASSETS_BRL

  // quantity e allocation não dependem da moeda; percentuais também não.
  return ASSETS_BRL.map((asset) => ({
    ...asset,
    currentPrice: convertFromBRL(asset.currentPrice, currency),
    totalValue: convertFromBRL(asset.totalValue, currency),
    change24h: {
      absolute: convertFromBRL(asset.change24h.absolute, currency),
      percentage: asset.change24h.percentage,
    },
  }))
}
