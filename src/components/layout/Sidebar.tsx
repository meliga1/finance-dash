import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { NAV_ICONS, NAV_ITEMS } from '@/app/navigation'
import { useLayout } from '@/components/layout/layout-context'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação principal">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.icon]

          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    'group relative flex items-center gap-3 rounded-card px-3 py-2.5 text-body transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal',
                    isActive
                      ? 'bg-surface-overlay text-text-primary'
                      : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent-gold"
                      />
                    )}
                    <Icon className="size-5 shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-card border border-border bg-surface-raised shadow-card"
      >
        <span className="font-mono text-caption font-semibold text-accent-gold">FD</span>
      </div>
      <div>
        <p className="text-overline uppercase tracking-widest text-text-muted">Patrimônio</p>
        <p className="text-heading text-text-primary">Finance Dash</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useLayout()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const location = useLocation()

  useEffect(() => {
    if (!isDesktop) closeSidebar()
  }, [location.pathname, isDesktop, closeSidebar])

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSidebar()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [sidebarOpen, isDesktop, closeSidebar])

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [sidebarOpen, isDesktop])

  const panel = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border-subtle bg-surface px-4 py-6">
      <Brand />
      <div className="mt-8 flex-1">
        <p className="mb-3 px-3 text-overline uppercase text-text-muted">Menu</p>
        <NavLinks onNavigate={isDesktop ? undefined : closeSidebar} />
      </div>
      <p className="px-3 text-caption text-text-muted">Dados ilustrativos · v0.1</p>
    </aside>
  )

  if (isDesktop) {
    return panel
  }

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden={!sidebarOpen}
        onClick={closeSidebar}
      />

      <div
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-out motion-reduce:transition-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!sidebarOpen}
      >
        {panel}
      </div>
    </>
  )
}
