import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 flex size-12 items-center justify-center rounded-card border border-border bg-surface-raised text-text-muted"
        >
          {icon}
        </div>
      )}
      <p className="text-body font-medium text-text-primary">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-caption text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
