import crypto from 'node:crypto'
import { config } from './config'
import type { BybitWalletBalanceResponse } from './types'

const RECV_WINDOW = '5000'

function sign(timestamp: string, queryString: string): string {
  const payload = timestamp + config.bybitApiKey + RECV_WINDOW + queryString
  return crypto.createHmac('sha256', config.bybitApiSecret).update(payload).digest('hex')
}

// GET /v5/account/wallet-balance — saldo real da conta (Unified Trading Account)
export async function fetchWalletBalance(): Promise<BybitWalletBalanceResponse> {
  const queryString = 'accountType=UNIFIED'
  const timestamp = Date.now().toString()
  const signature = sign(timestamp, queryString)

  const response = await fetch(`${config.bybitBaseUrl}/v5/account/wallet-balance?${queryString}`, {
    headers: {
      'X-BAPI-API-KEY': config.bybitApiKey,
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
