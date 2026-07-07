import { Router } from 'express'
import * as db from '../db'
import { getBybitCredentials } from '../bybitCredentials'
import { fetchHoldings } from '../bybit'
import type { Asset } from '../types'

const router = Router()

const SYMBOL_PATTERN = /^[A-Z0-9]{1,15}$/

function toAsset(row: db.AssetRow): Asset {
  return { symbol: row.symbol, name: row.name, averageBuyPriceBRL: row.average_buy_price_brl }
}

// GET /assets — lista os ativos rastreados. Antes de responder, tenta
// descobrir automaticamente (best-effort) qualquer moeda com saldo > 0 na
// Bybit que ainda não esteja rastreada, para que o usuário não precise
// cadastrar manualmente o que já tem na carteira.
router.get('/', async (_req, res) => {
  const credentials = getBybitCredentials()
  if (credentials) {
    try {
      const holdings = await fetchHoldings(credentials.apiKey, credentials.apiSecret)
      for (const holding of holdings) {
        db.insertAssetIfMissing(holding.symbol, holding.symbol)
      }
    } catch (error) {
      console.error('Failed to auto-discover Bybit holdings:', error)
    }
  }

  res.json({ assets: db.listAssets().map(toAsset) })
})

// POST /assets — adiciona um ativo manualmente (ou atualiza nome/preço médio
// de um já existente, inclusive um descoberto automaticamente).
router.post('/', (req, res) => {
  const { symbol, name, averageBuyPriceBRL } = req.body ?? {}

  if (typeof symbol !== 'string' || !SYMBOL_PATTERN.test(symbol.trim().toUpperCase())) {
    res.status(400).json({ error: 'invalid_input' })
    return
  }
  if (
    averageBuyPriceBRL !== undefined &&
    (typeof averageBuyPriceBRL !== 'number' || !Number.isFinite(averageBuyPriceBRL) || averageBuyPriceBRL < 0)
  ) {
    res.status(400).json({ error: 'invalid_input' })
    return
  }

  const normalizedSymbol = symbol.trim().toUpperCase()
  const normalizedName = typeof name === 'string' && name.trim() ? name.trim() : normalizedSymbol

  db.upsertAsset(normalizedSymbol, normalizedName, averageBuyPriceBRL ?? 0)
  res.status(201).json(toAsset(db.getAsset(normalizedSymbol)!))
})

// DELETE /assets/:symbol
router.delete('/:symbol', (req, res) => {
  db.deleteAsset(req.params.symbol.trim().toUpperCase())
  res.status(204).end()
})

export default router
