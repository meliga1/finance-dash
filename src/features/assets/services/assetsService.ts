import type { CurrencyCode } from '@/types/common'
import type { Asset } from '@/features/assets/types'
import { delay, getAssetsMock } from '@/mocks'

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE-TEMPLATE (molde para os demais services)
//
// Endpoint do contrato:  GET /assets?currency=BRL   → { assets: Asset[] }
//
// A migração mock → API real é APENAS trocar o corpo desta função. A assinatura
// (params + Promise<Asset[]>) não muda, então hook (useAssets) e componentes
// (AssetsTable, AllocationPieChart) continuam idênticos.
//
// Versão real (descomentar e remover o mock abaixo):
//
//   import { http } from '@/services/http'
//
//   export async function getAssets(currency: CurrencyCode): Promise<Asset[]> {
//     // Desembrulha o envelope { assets: [...] } do contrato para Asset[]:
//     const { assets } = await http<{ assets: Asset[] }>(`/assets?currency=${currency}`)
//     return assets
//   }
// ─────────────────────────────────────────────────────────────────────────────

// GET /assets?currency=BRL
export async function getAssets(currency: CurrencyCode): Promise<Asset[]> {
  // MOCK — remover ao ativar a versão real acima.
  return delay(getAssetsMock(currency))
}
