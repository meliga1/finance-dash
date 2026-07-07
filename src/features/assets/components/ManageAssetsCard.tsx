import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  useTrackedAssets,
  useAvailableCoins,
  useAddAsset,
  useRemoveAsset,
} from '@/features/assets/hooks'
import { Button, Card, CardHeader, Skeleton } from '@/components/ui'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/cn'

const inputClass =
  'h-10 w-full rounded-card border border-border-subtle bg-surface-raised px-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal'

const MAX_SUGGESTIONS = 8

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4 shrink-0">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Botão de "moeda" que vira campo de busca com sugestões ao ser clicado —
// fecha de volta ao selecionar uma moeda ou ao perder o foco.
function CoinPicker({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (symbol: string) => void
}) {
  const { data: coins, isPending } = useAvailableCoins()
  const [isEditing, setIsEditing] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const suggestions = (coins ?? [])
    .filter((coin) => coin.includes(query.toUpperCase()))
    .slice(0, MAX_SUGGESTIONS)

  function select(symbol: string) {
    onSelect(symbol)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <button
        id="assetSymbol"
        type="button"
        onClick={() => {
          setQuery('')
          setIsEditing(true)
        }}
        className={cn(inputClass, 'flex items-center justify-between gap-2 text-left')}
      >
        <span className={selected ? 'text-text-primary' : 'text-text-muted'}>
          {selected || 'Selecionar moeda'}
        </span>
        <ChevronDownIcon />
      </button>
    )
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar moeda (ex.: BTC)"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onBlur={() => setIsEditing(false)}
        className={inputClass}
      />

      <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-card border border-border bg-surface-raised shadow-elevated">
        {isPending ? (
          <li className="px-3 py-2 text-caption text-text-secondary">Carregando…</li>
        ) : suggestions.length === 0 ? (
          <li className="px-3 py-2 text-caption text-text-secondary">Nenhuma moeda encontrada</li>
        ) : (
          suggestions.map((coin) => (
            <li key={coin}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(coin)}
                className="block w-full px-3 py-2 text-left text-body text-text-primary hover:bg-surface-overlay"
              >
                {coin}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

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

    if (!symbol) {
      setError('Escolha uma moeda na busca antes de adicionar.')
      return
    }

    try {
      await addMutation.mutateAsync({
        symbol,
        name: name.trim() || undefined,
        averageBuyPriceBRL: averageBuyPrice ? Number(averageBuyPrice) : 0,
      })
      setSymbol('')
      setName('')
      setAverageBuyPrice('')
    } catch {
      setError('Não foi possível adicionar. Tente de novo.')
    }
  }

  return (
    <Card>
      <CardHeader eyebrow="Ativos rastreados" title="Adicionar uma moeda" />

      <p className="mb-4 text-caption text-text-secondary">
        Moedas com saldo na sua conta Bybit aparecem aqui automaticamente. Adicione manualmente
        outra moeda para acompanhá-la mesmo sem posição, ou para definir o preço médio de compra.
      </p>

      <form className="mb-6 flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
        <div className="w-48">
          <label htmlFor="assetSymbol" className="mb-1 block text-caption text-text-secondary">
            Moeda
          </label>
          <CoinPicker selected={symbol} onSelect={setSymbol} />
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
                  {asset.name} <span className="text-text-muted">{asset.symbol}</span>
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
