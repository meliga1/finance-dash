import { useQuery } from '@tanstack/react-query'
import { getBybitSettingsStatus } from '@/features/settings/services/settingsApi'
import { settingsKeys } from './keys'

export function useBybitSettingsStatus() {
  return useQuery({
    queryKey: settingsKeys.bybit(),
    queryFn: getBybitSettingsStatus,
  })
}
