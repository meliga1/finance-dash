import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useSessionStatus, useLogin, useSetup, useLogout } from '@/features/auth/hooks'

export type AuthStatus = 'loading' | 'error' | 'setup-required' | 'unauthenticated' | 'authenticated'

type AuthContextValue = {
  status: AuthStatus
  login: (username: string, password: string) => Promise<void>
  setup: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  retry: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function deriveStatus(
  isPending: boolean,
  isError: boolean,
  data: { authenticated: boolean; setupRequired: boolean } | undefined,
): AuthStatus {
  if (isPending) return 'loading'
  if (isError || !data) return 'error'
  if (data.setupRequired) return 'setup-required'
  if (!data.authenticated) return 'unauthenticated'
  return 'authenticated'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, isError, refetch } = useSessionStatus()
  const loginMutation = useLogin()
  const setupMutation = useSetup()
  const logoutMutation = useLogout()

  const value = useMemo<AuthContextValue>(
    () => ({
      status: deriveStatus(isPending, isError, data),
      login: (username, password) => loginMutation.mutateAsync({ username, password }),
      setup: (username, password) => setupMutation.mutateAsync({ username, password }),
      logout: () => logoutMutation.mutateAsync(),
      retry: () => refetch(),
    }),
    [isPending, isError, data, loginMutation, setupMutation, logoutMutation, refetch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
