// Metadados estáticos por ativo: nome de exibição e preço médio de compra
// (BRL). Isso é dado próprio do usuário que nenhuma API pública expõe — em
// um back-end real isso viria de um histórico de transações. A quantidade
// (o quanto você realmente tem) NÃO está aqui: ela vem ao vivo da Bybit via
// o back-end (ver `src/services/portfolioApi.ts`).
export interface AssetMetadata {
  id: string
  symbol: string
  name: string
  averageBuyPriceBRL: number
}

export const ASSET_METADATA: AssetMetadata[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', averageBuyPriceBRL: 298000 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', averageBuyPriceBRL: 15800 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', averageBuyPriceBRL: 5.35 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', averageBuyPriceBRL: 165 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', averageBuyPriceBRL: 0.95 },
]
