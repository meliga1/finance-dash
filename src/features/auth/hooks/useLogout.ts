import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '@/features/auth/services/authApi'
import { authKeys } from './keys'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  })
}
