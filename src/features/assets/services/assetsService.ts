import type { CurrencyCode } from '@/types/common'
import type { Asset } from '@/features/assets/types'
import { delay, getAssetsMock } from '@/mocks'

// GET /assets?currency=BRL
export async function getAssets(currency: CurrencyCode): Promise<Asset[]> {
  // MOCK — na API real, trocar apenas o corpo desta função:
  // const { assets } = await http<{ assets: Asset[] }>(`/assets?currency=${currency}`)
  // return assets
  return delay(getAssetsMock(currency))
}
