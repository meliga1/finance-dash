import { useQuery } from '@tanstack/react-query'
import { getSessionStatus } from '@/features/auth/services/authApi'
import { authKeys } from './keys'

export function useSessionStatus() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: getSessionStatus,
    staleTime: 60_000,
    retry: false,
  })
}
