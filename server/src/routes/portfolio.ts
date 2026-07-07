import { Router } from 'express'
import { fetchHoldings } from '../bybit'
import { getBybitCredentials } from '../bybitCredentials'
import type { HoldingsResponse } from '../types'

const router = Router()

router.get('/holdings', async (_req, res) => {
  const credentials = getBybitCredentials()
  if (!credentials) {
    res.status(409).json({ error: 'not_configured' })
    return
  }

  try {
    const holdings = await fetchHoldings(credentials.apiKey, credentials.apiSecret)
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
