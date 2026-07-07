import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTrackedAsset } from '@/features/assets/services/assetsApi'
import { assetsKeys } from './keys'
import { portfolioKeys } from '@/features/portfolio/hooks'

export function useRemoveAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (symbol: string) => removeTrackedAsset(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetsKeys.all })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}
