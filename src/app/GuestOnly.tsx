import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'
import { AuthErrorScreen } from './AuthErrorScreen'

type GuestOnlyProps = {
  variant: 'login' | 'setup'
}

export function GuestOnly({ variant }: GuestOnlyProps) {
  const { status, retry } = useAuth()

  if (status === 'loading') return null
  if (status === 'error') return <AuthErrorScreen onRetry={retry} />
  if (status === 'authenticated') return <Navigate to="/" replace />

  if (variant === 'setup' && status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (variant === 'login' && status === 'setup-required') {
    return <Navigate to="/setup" replace />
  }

  return <Outlet />
}
