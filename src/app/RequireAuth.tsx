import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'
import { AuthErrorScreen } from './AuthErrorScreen'

export function RequireAuth() {
  const { status, retry } = useAuth()

  if (status === 'loading') return null
  if (status === 'error') return <AuthErrorScreen onRetry={retry} />
  if (status === 'setup-required') return <Navigate to="/setup" replace />
  if (status === 'unauthenticated') return <Navigate to="/login" replace />

  return <Outlet />
}
