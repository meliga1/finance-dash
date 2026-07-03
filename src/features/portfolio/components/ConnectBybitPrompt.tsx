import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui'

function PlugIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-6">
      <path
        d="M6.5 8.5V3.5M13.5 8.5V3.5M5 8.5h10v2a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5v-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 15.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function ConnectBybitPrompt({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      icon={<PlugIcon />}
      title="Conecte sua conta Bybit"
      description="Adicione sua API key da Bybit para ver seu saldo real aqui."
      action={
        <Link
          to="/configuracoes"
          className="inline-flex h-8 items-center justify-center rounded-card border border-border bg-surface-raised px-3 text-caption font-medium text-text-primary transition-colors hover:bg-surface-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
        >
          Ir para Configurações
        </Link>
      }
    />
  )
}
