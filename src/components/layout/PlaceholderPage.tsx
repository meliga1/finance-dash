import type { ReactNode } from 'react'

type PlaceholderPageProps = {
  description: string
  children?: ReactNode
}

export function PlaceholderPage({ description, children }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-body text-text-secondary">{description}</p>

      <div className="rounded-card border border-border-subtle bg-surface p-8 shadow-card sm:p-10">
        <div className="mx-auto max-w-md text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-card border border-border bg-surface-raised"
          >
            <span className="font-mono text-caption text-accent-teal">···</span>
          </div>
          <p className="text-body text-text-primary">Conteúdo em desenvolvimento</p>
          <p className="mt-2 text-caption text-text-muted">
            Esta seção receberá os componentes de domínio na próxima etapa.
          </p>
          {children}
        </div>
      </div>
    </div>
  )
}
