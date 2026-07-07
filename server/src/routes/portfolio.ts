import { Router } from 'express'
import { fetchWalletBalance } from '../bybit'
import { getCached } from '../cache'
import { getBybitCredentials } from '../bybitCredentials'
import type { HoldingsResponse } from '../types'

const router = Router()

const HOLDINGS_CACHE_KEY = 'bybit:wallet-balance'
const HOLDINGS_CACHE_TTL_MS = 20_000

router.get('/holdings', async (_req, res) => {
  const credentials = getBybitCredentials()
  if (!credentials) {
    res.status(409).json({ error: 'not_configured' })
    return
  }

  try {
    const data = await getCached(HOLDINGS_CACHE_KEY, HOLDINGS_CACHE_TTL_MS, () =>
      fetchWalletBalance(credentials.apiKey, credentials.apiSecret),
    )

    const coins = data.result.list[0]?.coin ?? []
    const holdings = coins
      .map((coin) => ({ symbol: coin.coin, quantity: Number(coin.walletBalance) }))
      .filter((holding) => holding.quantity > 0)

    const payload: HoldingsResponse = { holdings }
    res.json(payload)
  } catch (error) {
    // Detalhe completo só no log do servidor — nunca na resposta, que pode
    // vazar dicas sobre permissões/validade da chave.
    console.error('Failed to fetch Bybit holdings:', error)
    res.status(502).json({ error: 'Unable to fetch holdings' })
  }
})

export default router
