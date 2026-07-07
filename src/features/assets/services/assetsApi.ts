import { http } from '@/services/http'
import type { AssetMetadata } from '@/features/assets/holdings'

interface AssetDto {
  symbol: string
  name: string
  averageBuyPriceBRL: number
}

function toMetadata(dto: AssetDto): AssetMetadata {
  return { id: dto.symbol.toLowerCase(), ...dto }
}

// GET /assets — ativos rastreados: os que o usuário adicionou manualmente +
// os que a Bybit reporta saldo (descobertos automaticamente pelo back-end).
export async function fetchTrackedAssets(): Promise<AssetMetadata[]> {
  const { assets } = await http<{ assets: AssetDto[] }>('/assets')
  return assets.map(toMetadata)
}

export interface NewAsset {
  symbol: string
  name?: string
  averageBuyPriceBRL: number
}

// POST /assets — adiciona (ou atualiza) um ativo rastreado manualmente.
export async function addTrackedAsset(input: NewAsset): Promise<AssetMetadata> {
  const dto = await http<AssetDto>('/assets', { method: 'POST', body: input })
  return toMetadata(dto)
}

// DELETE /assets/:symbol
export async function removeTrackedAsset(symbol: string): Promise<void> {
  await http(`/assets/${symbol}`, { method: 'DELETE' })
}
