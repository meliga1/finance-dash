import crypto from 'node:crypto'
import { config } from './config'
import { getCached } from './cache'
import type { BybitWalletBalanceResponse, Holding } from './types'

const RECV_WINDOW = '5000'

function sign(timestamp: string, queryString: string, apiKey: string, apiSecret: string): string {
  const payload = timestamp + apiKey + RECV_WINDOW + queryString
  return crypto.createHmac('sha256', apiSecret).update(payload).digest('hex')
}

// Bybit rejeita timestamps à frente do relógio do servidor mesmo dentro do
// recv_window — compensamos o desvio do relógio local em vez de exigir que
// o host esteja sincronizado via NTP.
async function getServerTimeOffset(): Promise<number> {
  return getCached('bybit:time-offset', 60_000, async () => {
    const response = await fetch(`${config.bybitBaseUrl}/v5/market/time`)
    const data = (await response.json()) as { time: number }
    return data.time - Date.now()
  })
}

// GET /v5/account/wallet-balance — saldo real da conta (Unified Trading Account)
export async function fetchWalletBalance(
  apiKey: string,
  apiSecret: string,
): Promise<BybitWalletBalanceResponse> {
  const queryString = 'accountType=UNIFIED'
  const offset = await getServerTimeOffset()
  const timestamp = (Date.now() + offset).toString()
  const signature = sign(timestamp, queryString, apiKey, apiSecret)

  const response = await fetch(`${config.bybitBaseUrl}/v5/account/wallet-balance?${queryString}`, {
    headers: {
      'X-BAPI-API-KEY': apiKey,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': RECV_WINDOW,
      'X-BAPI-SIGN': signature,
    },
  })

  if (!response.ok) {
    throw new Error(`Bybit request failed: ${response.status}`)
  }

  const data = (await response.json()) as BybitWalletBalanceResponse

  // Bybit responde HTTP 200 mesmo em erros de autenticação/permissão —
  // o erro real vem no corpo.
  if (data.retCode !== 0) {
    throw new Error(`Bybit error ${data.retCode}: ${data.retMsg}`)
  }

  return data
}

const HOLDINGS_CACHE_KEY = 'bybit:wallet-balance'
const HOLDINGS_CACHE_TTL_MS = 20_000

// Saldo real por moeda (walletBalance > 0), cacheado — usado tanto para
// mostrar quantidades (rota /portfolio/holdings) quanto para descobrir
// automaticamente quais moedas rastrear (rota /assets).
export async function fetchHoldings(apiKey: string, apiSecret: string): Promise<Holding[]> {
  return getCached(HOLDINGS_CACHE_KEY, HOLDINGS_CACHE_TTL_MS, async () => {
    const data = await fetchWalletBalance(apiKey, apiSecret)
    const coins = data.result.list[0]?.coin ?? []
    return coins
      .map((coin) => ({ symbol: coin.coin, quantity: Number(coin.walletBalance) }))
      .filter((holding) => holding.quantity > 0)
  })
}
