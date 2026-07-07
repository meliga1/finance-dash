import type { PriceChange } from '@/types/common'

// GET /assets
export interface Asset {
  id: string // slug estável: "bitcoin"
  symbol: string // ticker de exibição: "BTC"
  name: string
  quantity: number
  currentPrice: number
  totalValue: number // quantity * currentPrice
  change24h: PriceChange
  allocation: number // % da carteira (0–100)
}
