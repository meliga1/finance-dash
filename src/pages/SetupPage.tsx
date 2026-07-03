import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/features/auth/auth-context'
import { Button, Card } from '@/components/ui'

export function SetupPage() {
  const { setup } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 8) {
      setError('Use uma senha com pelo menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      await setup(username, password)
    } catch {
      setError('Não foi possível criar a conta. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Card className="w-full max-w-sm" padding="lg">
        <p className="text-overline uppercase text-text-muted">Patrimônio</p>
        <h1 className="mb-1 text-heading text-text-primary">Criar sua conta</h1>
        <p className="mb-6 text-caption text-text-secondary">
          Primeiro acesso — defina o usuário e a senha que protegerão o painel.
        </p>

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
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-caption text-text-secondary">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            />
          </div>

          {error && <p className="text-caption text-negative">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando…' : 'Criar conta'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
