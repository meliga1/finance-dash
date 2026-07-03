import { useEffect, useState } from 'react'
import { useLayout, type Currency } from '@/components/layout/layout-context'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatRelativeTime } from '@/lib/formatRelativeTime'
import { useAuth } from '@/features/auth/auth-context'

const CURRENCIES: Currency[] = ['BRL', 'USD']

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CurrencySelector() {
  const { currency, setCurrency } = useLayout()

  return (
    <div
      role="group"
      aria-label="Moeda de exibição"
      className="inline-flex rounded-card border border-border-subtle bg-surface-raised p-0.5"
    >
      {CURRENCIES.map((option) => {
        const isActive = currency === option

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => setCurrency(option)}
            className={[
              'rounded-[0.45rem] px-2.5 py-1 text-caption font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal',
              isActive
                ? 'bg-surface-overlay text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary',
            ].join(' ')}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button
      type="button"
      onClick={() => logout()}
      aria-label="Sair"
      title="Sair"
      className={[
        'inline-flex size-9 items-center justify-center rounded-card border border-border-subtle bg-surface text-text-secondary',
        'transition-colors hover:bg-surface-raised hover:text-text-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal',
      ].join(' ')}
    >
      <LogoutIcon />
    </button>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.5 13.5 16 10l-3.5-3.5M16 10H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UpdatedIndicator() {
  const { lastUpdated } = useLayout()
  const [label, setLabel] = useState(() => formatRelativeTime(lastUpdated))

  useEffect(() => {
    setLabel(formatRelativeTime(lastUpdated))
    const interval = window.setInterval(() => {
      setLabel(formatRelativeTime(lastUpdated))
    }, 30_000)

    return () => window.clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-caption text-text-muted">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive opacity-40 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-positive" />
      </span>
      <span>
        Atualizado <span className="text-text-secondary">{label}</span>
      </span>
    </div>
  )
}

export function Topbar() {
  const title = usePageTitle()
  const { toggleSidebar } = useLayout()

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className={[
              'inline-flex size-9 items-center justify-center rounded-card border border-border-subtle bg-surface text-text-secondary lg:hidden',
              'transition-colors hover:bg-surface-raised hover:text-text-primary',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal',
            ].join(' ')}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </button>

          <div className="min-w-0">
            <p className="truncate text-heading text-text-primary">{title}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <UpdatedIndicator />
          <CurrencySelector />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
