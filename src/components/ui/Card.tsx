import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardVariant = 'default' | 'raised' | 'outline'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
  padding?: CardPadding
  interactive?: boolean
}

const variantClass: Record<CardVariant, string> = {
  default: 'bg-surface border border-border-subtle shadow-card',
  raised: 'bg-surface-raised border border-border shadow-elevated',
  outline: 'bg-transparent border border-border',
}

const paddingClass: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card',
        variantClass[variant],
        paddingClass[padding],
        interactive &&
          'transition-colors hover:border-border hover:bg-surface-raised focus-within:border-border',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  title: ReactNode
  action?: ReactNode
  eyebrow?: ReactNode
  className?: string
}

export function CardHeader({ title, action, eyebrow, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-overline uppercase text-text-muted">{eyebrow}</p>
        )}
        <h2 className="truncate text-heading text-text-primary">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
