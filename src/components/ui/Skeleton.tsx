import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Renderiza como bloco de texto arredondado com altura de linha. */
  variant?: 'block' | 'text' | 'circle'
}

const variantClass: Record<NonNullable<SkeletonProps['variant']>, string> = {
  block: 'rounded-card',
  text: 'rounded h-4',
  circle: 'rounded-full',
}

export function Skeleton({ variant = 'block', className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-surface-overlay/70 motion-reduce:animate-none',
        variantClass[variant],
        className,
      )}
      {...rest}
    />
  )
}
