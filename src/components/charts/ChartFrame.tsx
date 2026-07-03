import type { ReactNode } from 'react'
import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/components/ui'

export type ChartFrameProps = {
  title: string
  eyebrow?: string
  action?: ReactNode
  isPending: boolean
  isError: boolean
  isEmpty: boolean
  onRetry?: () => void
  /** Altura da área do gráfico (px). Usada também pelo skeleton. */
  height?: number
  emptyTitle?: string
  emptyDescription?: string
  errorDescription?: string
  /** Conteúdo renderizado apenas no estado de sucesso (o gráfico). */
  children: ReactNode
  /** Rodapé opcional no sucesso (ex.: legenda). */
  footer?: ReactNode
}

export function ChartFrame({
  title,
  eyebrow,
  action,
  isPending,
  isError,
  isEmpty,
  onRetry,
  height = 300,
  emptyTitle = 'Sem dados para exibir',
  emptyDescription = 'Assim que houver dados, o gráfico aparecerá aqui.',
  errorDescription = 'Não foi possível carregar o gráfico.',
  children,
  footer,
}: ChartFrameProps) {
  const renderBody = () => {
    if (isPending) {
      return <Skeleton className="w-full" style={{ height }} />
    }

    if (isError) {
      return <ErrorState description={errorDescription} onRetry={onRetry} />
    }

    if (isEmpty) {
      return <EmptyState title={emptyTitle} description={emptyDescription} />
    }

    return (
      <>
        <div style={{ height }}>{children}</div>
        {footer}
      </>
    )
  }

  return (
    <Card>
      <CardHeader title={title} eyebrow={eyebrow} action={action} />
      {renderBody()}
    </Card>
  )
}
