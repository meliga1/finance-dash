import { useEffect, useRef, useState } from 'react'
import { useTrackedAssets, useAvailableCoins, useAddAsset } from '@/features/assets/hooks'
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

// Botão de "moeda" que vira campo de busca com sugestões ao ser clicado.
// Selecionar uma moeda já a adiciona (sem passo extra de confirmação) — se
// ela já estiver rastreada, não sobrescreve o preço médio existente.
export function CoinPicker() {
  const { data: trackedAssets } = useTrackedAssets()
  const { data: coins, isPending } = useAvailableCoins()
  const addMutation = useAddAsset()

  const [isEditing, setIsEditing] = useState(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const trackedSymbols = new Set((trackedAssets ?? []).map((asset) => asset.symbol))
  const suggestions = (coins ?? [])
    .filter((coin) => coin.includes(query.toUpperCase()))
    .slice(0, MAX_SUGGESTIONS)

  async function select(symbol: string) {
    setIsEditing(false)
    setError(null)

    if (trackedSymbols.has(symbol)) return

    try {
      await addMutation.mutateAsync({ symbol, averageBuyPriceBRL: 0 })
    } catch {
      setError('Não foi possível adicionar essa moeda.')
    }
  }

  if (!isEditing) {
    return (
      <div className="w-48">
        <button
          type="button"
          onClick={() => {
            setQuery('')
            setIsEditing(true)
          }}
          className={cn(inputClass, 'flex items-center justify-between gap-2 text-left')}
        >
          <span className="text-text-muted">
            {addMutation.isPending ? 'Adicionando…' : 'Selecionar moeda'}
          </span>
          <ChevronDownIcon />
        </button>
        {error && <p className="mt-1 text-caption text-negative">{error}</p>}
      </div>
    )
  }

  return (
    <div className="relative w-48">
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
