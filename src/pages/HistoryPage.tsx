import { useLayout } from '@/components/layout/layout-context'
import { usePortfolioHistory } from '@/features/portfolio/hooks'
import { PortfolioHistoryChart } from '@/components/charts'
import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/components/ui'
import { formatCurrency, formatMonthLabel } from '@/lib/formatters'

function MonthlyTableSkeleton({ rows = 6 }: { rows?: number }) {
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

function MonthlyHistoryTable() {
  const { currency } = useLayout()
  const { data, isPending, isError, refetch } = usePortfolioHistory(currency, 12)

  const renderBody = () => {
    if (isPending) return <MonthlyTableSkeleton />

    if (isError) {
      return (
        <ErrorState
          description="Não foi possível carregar o histórico mensal."
          onRetry={() => refetch()}
        />
      )
    }

    const rows = data ?? []
    if (rows.length === 0) {
      return (
        <EmptyState
          title="Sem histórico mensal"
          description="Os valores por mês aparecerão aqui quando houver dados."
        />
      )
    }

    // Mais recente primeiro na tabela.
    const ordered = [...rows].reverse()

    return (
      <table className="w-full border-collapse text-body">
        <caption className="sr-only">Valor da carteira por mês</caption>
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="px-5 py-3 text-left text-overline uppercase text-text-muted"
            >
              Mês
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
                {formatMonthLabel(point.date)}
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
        <CardHeader title="Histórico mensal" eyebrow="Detalhamento" />
      </div>
      {renderBody()}
    </Card>
  )
}

export function HistoryPage() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-body text-text-secondary">
        Evolução do patrimônio mês a mês, com o detalhamento dos valores de fechamento.
      </p>

      <PortfolioHistoryChart months={12} />
      <MonthlyHistoryTable />
    </div>
  )
}
