import { useQuery } from '@tanstack/react-query'
import { fetchTrackedAssets } from '@/features/assets/services/assetsApi'
import { assetsKeys } from './keys'

export function useTrackedAssets() {
  return useQuery({
    queryKey: assetsKeys.tracked(),
    queryFn: fetchTrackedAssets,
    staleTime: 30_000,
  })
}
