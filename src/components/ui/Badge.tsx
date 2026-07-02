import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'neutral' | 'positive' | 'negative' | 'accent' | 'outline'
type BadgeSize = 'sm' | 'md'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-neutral-muted text-text-secondary',
  positive: 'bg-positive-muted text-positive',
  negative: 'bg-negative-muted text-negative',
  accent: 'bg-surface-overlay text-accent-gold',
  outline: 'border border-border text-text-secondary',
}

const sizeClass: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-overline uppercase tracking-wide',
  md: 'px-2.5 py-1 text-caption',
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
