import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '@/features/auth/services/authApi'
import { authKeys } from './keys'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  })
}
