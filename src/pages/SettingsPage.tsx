import { useState } from 'react'
import type { FormEvent } from 'react'
import { useBybitSettingsStatus, useSaveBybitSettings } from '@/features/settings/hooks'
import { Badge, Button, Card, CardHeader, Skeleton } from '@/components/ui'
import { HttpError } from '@/services/http'

function errorMessage(error: unknown): string {
  if (error instanceof HttpError && error.code === 'invalid_credentials') {
    return 'A Bybit rejeitou essas credenciais. Confira a chave/segredo e as permissões da API key.'
  }
  return 'Não foi possível salvar. Tente novamente.'
}

export function SettingsPage() {
  const { data, isPending } = useBybitSettingsStatus()
  const saveMutation = useSaveBybitSettings()

  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      await saveMutation.mutateAsync({ apiKey, apiSecret })
      setApiKey('')
      setApiSecret('')
      setSuccess(true)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <p className="text-body text-text-secondary">
        Conecte sua conta Bybit (Unified Trading Account) para que o painel mostre seu saldo real.
        Sua chave secreta nunca é enviada ao navegador depois de salva.
      </p>

      <Card>
        <CardHeader
          eyebrow="Bybit"
          title="Credenciais da API"
          action={
            isPending ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <Badge variant={data?.configured ? 'positive' : 'neutral'}>
                {data?.configured ? 'Conectado' : 'Não conectado'}
              </Badge>
            )
          }
        />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="apiKey" className="mb-1 block text-caption text-text-secondary">
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              autoComplete="off"
              required
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              className="h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            />
          </div>

          <div>
            <label htmlFor="apiSecret" className="mb-1 block text-caption text-text-secondary">
              API Secret
            </label>
            <input
              id="apiSecret"
              type="password"
              autoComplete="off"
              required
              value={apiSecret}
              onChange={(event) => setApiSecret(event.target.value)}
              className="h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            />
          </div>

          {error && <p className="text-caption text-negative">{error}</p>}
          {success && <p className="text-caption text-positive">Credenciais salvas com sucesso.</p>}

          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Validando…' : 'Salvar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
