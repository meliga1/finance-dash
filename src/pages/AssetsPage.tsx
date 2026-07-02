import type { ReactNode } from 'react'
import { useLayout } from '@/components/layout/layout-context'
import { useAssets } from '@/features/assets/hooks'
import { AssetsTable, AssetsTableSkeleton } from '@/components/tables/AssetsTable'
import { EmptyState, ErrorState } from '@/components/ui'

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="4" y="8.5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="13.5" r="1.25" fill="currentColor" />
    </svg>
  )
}

function StatePanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-border-subtle bg-surface shadow-card">
      {children}
    </div>
  )
}

export function AssetsPage() {
  const { currency } = useLayout()
  const { data, isPending, isError, refetch } = useAssets(currency)

  function renderContent() {
    if (isPending) {
      return <AssetsTableSkeleton />
    }

    if (isError) {
      return (
        <StatePanel>
          <ErrorState
            description="Não conseguimos carregar seus ativos agora."
            onRetry={() => refetch()}
          />
        </StatePanel>
      )
    }

    const assets = data ?? []

    if (assets.length === 0) {
      return (
        <StatePanel>
          <EmptyState
            icon={<WalletIcon />}
            title="Nenhum ativo na carteira"
            description="Quando você tiver posições, elas aparecerão aqui com preços e variação."
          />
        </StatePanel>
      )
    }

    return <AssetsTable assets={assets} currency={currency} />
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-body text-text-secondary">
        Carteira de ativos com posições, preços e participação de cada um no total.
      </p>
      {renderContent()}
    </div>
  )
}
