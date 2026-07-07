import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setup } from '@/features/auth/services/authApi'
import { authKeys } from './keys'

export function useSetup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      setup(username, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  })
}
