import { useQuery } from '@tanstack/react-query'
import type { CurrencyCode } from '@/types/common'
import { getAssets } from '@/features/assets/services'
import { assetsKeys } from './keys'

export function useAssets(currency: CurrencyCode) {
  return useQuery({
    queryKey: assetsKeys.list(currency),
    queryFn: () => getAssets(currency),
  })
}
