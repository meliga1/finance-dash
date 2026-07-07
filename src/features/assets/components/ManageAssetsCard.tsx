import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTrackedAssets, useAddAsset, useRemoveAsset } from '@/features/assets/hooks'
import { Button, Card, CardHeader, Skeleton } from '@/components/ui'
import { formatCurrency } from '@/lib/formatters'

const inputClass =
  'h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal'

export function ManageAssetsCard() {
  const { data: trackedAssets, isPending } = useTrackedAssets()
  const addMutation = useAddAsset()
  const removeMutation = useRemoveAsset()

  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [averageBuyPrice, setAverageBuyPrice] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    try {
      await addMutation.mutateAsync({
        symbol: symbol.trim(),
        name: name.trim() || undefined,
        averageBuyPriceBRL: averageBuyPrice ? Number(averageBuyPrice) : 0,
      })
      setSymbol('')
      setName('')
      setAverageBuyPrice('')
    } catch {
      setError('Não foi possível adicionar. Confira o símbolo (ex.: BTC, ETH) e tente de novo.')
    }
  }

  return (
    <Card>
      <CardHeader
        eyebrow="Ativos rastreados"
        title="Adicionar uma moeda"
      />

      <p className="mb-4 text-caption text-text-secondary">
        Moedas com saldo na sua conta Bybit aparecem aqui automaticamente. Adicione manualmente
        outra moeda para acompanhá-la mesmo sem posição, ou para definir o preço médio de compra.
      </p>

      <form className="mb-6 flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
        <div className="w-28">
          <label htmlFor="assetSymbol" className="mb-1 block text-caption text-text-secondary">
            Símbolo
          </label>
          <input
            id="assetSymbol"
            type="text"
            placeholder="BTC"
            required
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            className={inputClass}
          />
        </div>

        <div className="w-40">
          <label htmlFor="assetName" className="mb-1 block text-caption text-text-secondary">
            Nome (opcional)
          </label>
          <input
            id="assetName"
            type="text"
            placeholder="Bitcoin"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="w-40">
          <label htmlFor="assetAvgPrice" className="mb-1 block text-caption text-text-secondary">
            Preço médio (BRL)
          </label>
          <input
            id="assetAvgPrice"
            type="number"
            step="any"
            min="0"
            placeholder="0"
            value={averageBuyPrice}
            onChange={(event) => setAverageBuyPrice(event.target.value)}
            className={inputClass}
          />
        </div>

        <Button type="submit" disabled={addMutation.isPending}>
          {addMutation.isPending ? 'Adicionando…' : 'Adicionar'}
        </Button>
      </form>

      {error && <p className="mb-4 text-caption text-negative">{error}</p>}

      {isPending ? (
        <Skeleton className="h-24 w-full" />
      ) : trackedAssets && trackedAssets.length > 0 ? (
        <ul className="divide-y divide-border-subtle">
          {trackedAssets.map((asset) => (
            <li key={asset.symbol} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-body text-text-primary">
                  {asset.name}{' '}
                  <span className="text-text-muted">{asset.symbol}</span>
                </p>
                <p className="text-caption text-text-secondary">
                  Preço médio: {formatCurrency(asset.averageBuyPriceBRL)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(asset.symbol)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-caption text-text-secondary">Nenhuma moeda rastreada ainda.</p>
      )}
    </Card>
  )
}
