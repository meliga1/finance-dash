// Metadados por ativo rastreado: nome de exibição e preço médio de compra
// (BRL). Isso é dado próprio do usuário que nenhuma API pública expõe.
// Persistido no back-end (`server/src/routes/assets.ts`, via `assetsApi.ts`
// abaixo): o usuário pode adicionar ativos manualmente, e o back-end também
// descobre automaticamente qualquer moeda com saldo > 0 na Bybit. A
// quantidade em si vem sempre ao vivo da Bybit (ver `src/services/portfolioApi.ts`).
export interface AssetMetadata {
  id: string
  symbol: string
  name: string
  averageBuyPriceBRL: number
}
