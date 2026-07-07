import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveBybitSettings } from '@/features/settings/services/settingsApi'
import { settingsKeys } from './keys'
import { assetsKeys } from '@/features/assets/hooks'
import { portfolioKeys } from '@/features/portfolio/hooks'

export function useSaveBybitSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }) =>
      saveBybitSettings(apiKey, apiSecret),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.bybit() })
      queryClient.invalidateQueries({ queryKey: assetsKeys.all })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}
