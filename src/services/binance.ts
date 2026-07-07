const BINANCE_API_URL = 'https://api.binance.com/api/v3'

export interface Ticker24hr {
  symbol: string
  lastPrice: string
  priceChangePercent: string
}

// GET https://api.binance.com/api/v3/ticker/24hr?symbol=... — um símbolo por
// vez (em vez do parâmetro batch `symbols=[...]`) porque os ativos rastreados
// podem incluir moedas sem par direto na Binance; aqui a falha de uma não
// derruba a cotação das demais. Retorna null nesse caso.
export async function fetchTicker(symbol: string): Promise<Ticker24hr | null> {
  try {
    const response = await fetch(`${BINANCE_API_URL}/ticker/24hr?symbol=${symbol}`)
    if (!response.ok) return null
    return (await response.json()) as Ticker24hr
  } catch {
    return null
  }
}

export interface KlinePoint {
  openTime: number
  close: number
}

export type KlineInterval = '1d' | '1w' | '1M'

// GET https://api.binance.com/api/v3/klines?symbol=...&interval=...
export async function fetchKlines(
  symbol: string,
  interval: KlineInterval,
  limit: number,
): Promise<KlinePoint[]> {
  const params = new URLSearchParams({
    symbol,
    interval,
    limit: String(limit),
  })

  const response = await fetch(`${BINANCE_API_URL}/klines?${params}`)

  if (!response.ok) {
    throw new Error(`Binance klines request failed: ${response.status}`)
  }

  const candles = (await response.json()) as unknown[][]
  return candles.map((candle) => ({
    openTime: candle[0] as number,
    close: Number(candle[4]),
  }))
}
