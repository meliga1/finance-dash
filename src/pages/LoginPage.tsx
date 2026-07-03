import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/features/auth/auth-context'
import { HttpError } from '@/services/http'
import { Button, Card } from '@/components/ui'

function errorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.code === 'invalid_credentials') return 'Usuário ou senha incorretos.'
    if (error.code === 'locked_out') return 'Muitas tentativas. Aguarde um minuto e tente novamente.'
    if (error.code === 'setup_required') return 'Nenhuma conta configurada ainda.'
  }
  return 'Não foi possível entrar. Tente novamente.'
}

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(username, password)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Card className="w-full max-w-sm" padding="lg">
        <p className="text-overline uppercase text-text-muted">Patrimônio</p>
        <h1 className="mb-6 text-heading text-text-primary">Entrar</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="mb-1 block text-caption text-text-secondary">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-caption text-text-secondary">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            />
          </div>

          {error && <p className="text-caption text-negative">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
