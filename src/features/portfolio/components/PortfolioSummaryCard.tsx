import { useLayout } from '@/components/layout/layout-context'
import { usePortfolioSummary } from '@/features/portfolio/hooks'
import { Card, ChangeIndicator, EmptyState, ErrorState, Skeleton, StatCard } from '@/components/ui'
import { formatCurrency } from '@/lib/formatters'
import { isErrorCode } from '@/services/http'
import { ConnectBybitPrompt } from '@/features/portfolio/components/ConnectBybitPrompt'

function HeroSkeleton() {
  return (
    <Card className="flex flex-col gap-4 md:col-span-2">
      <Skeleton variant="text" className="w-28" />
      <Skeleton className="h-11 w-64" />
      <Skeleton variant="text" className="w-40" />
    </Card>
  )
}

export function PortfolioSummaryCard() {
  const { currency } = useLayout()
  const { data, error, isPending, isError, refetch } = usePortfolioSummary(currency)

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <HeroSkeleton />
        <StatCard label="Lucro/prejuízo estimado" value="" loading />
      </div>
    )
  }

  if (isError) {
    if (isErrorCode(error, 'not_configured')) {
      return (
        <div className="rounded-card border border-border-subtle bg-surface shadow-card">
          <ConnectBybitPrompt />
        </div>
      )
    }

    return (
      <div className="rounded-card border border-border-subtle bg-surface shadow-card">
        <ErrorState
          description="Não foi possível carregar o resumo da carteira."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-card border border-border-subtle bg-surface shadow-card">
        <EmptyState
          title="Sem dados de patrimônio"
          description="O resumo da sua carteira aparecerá aqui."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="flex flex-col gap-3 md:col-span-2">
        <p className="text-overline uppercase text-text-muted">Patrimônio total</p>
        <p className="text-display-lg tabular-nums leading-none text-text-primary">
          {formatCurrency(data.totalValue, currency)}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <ChangeIndicator
            percent={data.change24h.percentage}
            value={data.change24h.absolute}
            currency={currency}
            showValue
            size="md"
          />
          <span className="text-caption text-text-muted">nas últimas 24h</span>
        </div>
      </Card>

      <StatCard
        label="Lucro/prejuízo estimado"
        value={formatCurrency(data.estimatedProfit.absolute, currency)}
        change={{ percent: data.estimatedProfit.percentage }}
        caption="vs. total aportado"
      />
    </div>
  )
}
