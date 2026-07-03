import { http } from '@/services/http'

export interface LiveHolding {
  symbol: string
  quantity: number
}

// GET /portfolio/holdings — saldo real da conta Bybit, via nosso back-end
// (nunca chamado direto do browser: exigiria expor a chave secreta).
export async function fetchLiveHoldings(): Promise<LiveHolding[]> {
  const { holdings } = await http<{ holdings: LiveHolding[] }>('/portfolio/holdings')
  return holdings
}
