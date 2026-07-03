import { Router } from 'express'
import { fetchWalletBalance } from '../bybit'
import { getBybitCredentials, saveBybitCredentials, isBybitConfigured } from '../bybitCredentials'

const router = Router()

router.get('/bybit', (_req, res) => {
  res.json({ configured: isBybitConfigured() })
})

router.put('/bybit', async (req, res) => {
  const { apiKey, apiSecret } = req.body ?? {}
  if (typeof apiKey !== 'string' || typeof apiSecret !== 'string' || !apiKey || !apiSecret) {
    res.status(400).json({ error: 'invalid_input' })
    return
  }

  try {
    // Valida as credenciais chamando a Bybit antes de persistir — feedback
    // imediato se a chave for rejeitada, em vez de só descobrir no dashboard.
    await fetchWalletBalance(apiKey, apiSecret)
  } catch (error) {
    console.error('Bybit credential validation failed:', error)
    res.status(422).json({ error: 'invalid_credentials' })
    return
  }

  saveBybitCredentials(apiKey, apiSecret)
  res.json({ configured: true })
})

export default router
