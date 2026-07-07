import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTrackedAsset, type NewAsset } from '@/features/assets/services/assetsApi'
import { assetsKeys } from './keys'
import { portfolioKeys } from '@/features/portfolio/hooks'

export function useAddAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewAsset) => addTrackedAsset(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetsKeys.all })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}
