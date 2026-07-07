import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Currency } from '@/lib/formatters'
import { Card } from './Card'
import { ChangeIndicator } from './ChangeIndicator'
import { Skeleton } from './Skeleton'

type StatChange = {
  percent: number
  value?: number
  currency?: Currency
}

export type StatCardProps = {
  label: string
  /** Valor já formatado (ex.: via formatCurrency). É o elemento dominante. */
  value: ReactNode
  change?: StatChange
  /** Legenda curta abaixo da variação (ex.: "hoje", "no mês"). */
  caption?: string
  icon?: ReactNode
  /** 'primary' destaca o valor em dourado — use no número mais importante da tela. */
  emphasis?: 'default' | 'primary'
  loading?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  caption,
  icon,
  emphasis = 'default',
  loading = false,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-overline uppercase text-text-muted">{label}</p>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton variant="text" className="w-24" />
        </div>
      ) : (
        <>
          <p
            className={cn(
              'text-display tabular-nums leading-none',
              emphasis === 'primary' ? 'text-accent-gold' : 'text-text-primary',
            )}
          >
            {value}
          </p>

          {(change || caption) && (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {change && (
                <ChangeIndicator
                  percent={change.percent}
                  value={change.value}
                  currency={change.currency}
                  showValue={change.value !== undefined}
                  size="sm"
                />
              )}
              {caption && <span className="text-caption text-text-muted">{caption}</span>}
            </div>
          )}
        </>
      )}
    </Card>
  )
}
