import { cn } from '@/lib/cn'
import { formatCurrency, formatPercent, type Currency } from '@/lib/formatters'

type Direction = 'up' | 'down' | 'flat'

export type ChangeIndicatorProps = {
  /** Percentual da variação (ex.: 1.23 = +1,23%). Define a direção. */
  percent: number
  /** Valor absoluto da variação, no mesmo período. Opcional. */
  value?: number
  currency?: Currency
  size?: 'sm' | 'md'
  /** Exibe o valor absoluto ao lado do percentual. */
  showValue?: boolean
  className?: string
}

const directionFor = (percent: number): Direction => {
  if (percent > 0) return 'up'
  if (percent < 0) return 'down'
  return 'flat'
}

const toneClass: Record<Direction, string> = {
  up: 'text-positive',
  down: 'text-negative',
  flat: 'text-neutral',
}

const sizeClass: Record<NonNullable<ChangeIndicatorProps['size']>, string> = {
  sm: 'text-caption gap-1',
  md: 'text-body gap-1.5',
}

const arrowSizeClass: Record<NonNullable<ChangeIndicatorProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-3.5',
}

function DirectionArrow({ direction, className }: { direction: Direction; className?: string }) {
  if (direction === 'flat') {
    return (
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
        <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    )
  }

  const isUp = direction === 'up'
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path
        d={isUp ? 'M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5' : 'M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const directionLabel: Record<Direction, string> = {
  up: 'alta de',
  down: 'queda de',
  flat: 'estável em',
}

export function ChangeIndicator({
  percent,
  value,
  currency = 'BRL',
  size = 'sm',
  showValue = false,
  className,
}: ChangeIndicatorProps) {
  const direction = directionFor(percent)
  const percentText = formatPercent(percent)
  const valueText =
    value !== undefined ? formatCurrency(Math.abs(value), currency) : undefined

  const srText = `${directionLabel[direction]} ${percentText.replace(/^[+−-]/, '')}${
    valueText ? `, ${valueText}` : ''
  }`

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium tabular-nums',
        toneClass[direction],
        sizeClass[size],
        className,
      )}
    >
      <DirectionArrow direction={direction} className={arrowSizeClass[size]} />
      <span aria-hidden="true">{percentText}</span>
      {showValue && valueText && (
        <span aria-hidden="true" className="text-text-muted">
          ({direction === 'down' ? '−' : direction === 'up' ? '+' : ''}
          {valueText})
        </span>
      )}
      <span className="sr-only">{srText}</span>
    </span>
  )
}
