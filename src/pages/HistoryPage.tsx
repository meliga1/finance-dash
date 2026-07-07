import { useState } from 'react'
import { useLayout } from '@/components/layout/layout-context'
import { usePortfolioHistory } from '@/features/portfolio/hooks'
import { PortfolioHistoryChart } from '@/components/charts'
import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/components/ui'
import { formatCurrency } from '@/lib/formatters'
import type { HistoryPeriod } from '@/features/portfolio/types'
import { PERIOD_LIMIT, PERIOD_COLUMN_LABEL, formatPointLabel } from '@/features/portfolio/historyPeriod'

function HistoryTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border-subtle">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center justify-between px-5 py-3">
          <Skeleton variant="text" className="w-20" />
          <Skeleton variant="text" className="w-28" />
        </div>
      ))}
    </div>
  )
}

function HistoryTable({ period }: { period: HistoryPeriod }) {
  const { currency } = useLayout()
  const { data, isPending, isError, refetch } = usePortfolioHistory(
    currency,
    period,
    PERIOD_LIMIT[period],
  )

  const renderBody = () => {
    if (isPending) return <HistoryTableSkeleton />

    if (isError) {
      return (
        <ErrorState
          description="Não foi possível carregar o histórico."
          onRetry={() => refetch()}
        />
      )
    }

    const rows = data ?? []
    if (rows.length === 0) {
      return (
        <EmptyState
          title="Sem histórico disponível"
          description="Os valores aparecerão aqui quando houver dados."
        />
      )
    }

    // Mais recente primeiro na tabela.
    const ordered = [...rows].reverse()

    return (
      <table className="w-full border-collapse text-body">
        <caption className="sr-only">Valor da carteira ao longo do tempo</caption>
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="px-5 py-3 text-left text-overline uppercase text-text-muted"
            >
              {PERIOD_COLUMN_LABEL[period]}
            </th>
            <th
              scope="col"
              className="px-5 py-3 text-right text-overline uppercase text-text-muted"
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((point) => (
            <tr
              key={point.date}
              className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-raised"
            >
              <td className="px-5 py-3 text-left text-text-secondary">
                {formatPointLabel(period, point.date)}
              </td>
              <td className="px-5 py-3 text-right tabular-nums font-medium text-text-primary">
                {formatCurrency(point.value, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <Card padding="none">
      <div className="px-5 pt-5">
        <CardHeader title="Histórico" eyebrow="Detalhamento" />
      </div>
      {renderBody()}
    </Card>
  )
}

export function HistoryPage() {
  const [period, setPeriod] = useState<HistoryPeriod>('monthly')

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-body text-text-secondary">
        Evolução do patrimônio ao longo do tempo, com o detalhamento dos valores de fechamento.
      </p>

      <PortfolioHistoryChart period={period} onPeriodChange={setPeriod} />
      <HistoryTable period={period} />
    </div>
  )
}
