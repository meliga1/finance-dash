import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Currency = 'BRL' | 'USD'

type LayoutContextValue = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  lastUpdated: Date
  touchLastUpdated: () => void
  sidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

type LayoutProviderProps = {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [currency, setCurrency] = useState<Currency>('BRL')
  const [lastUpdated, setLastUpdated] = useState(() => new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const touchLastUpdated = useCallback(() => {
    setLastUpdated(new Date())
  }, [])

  const openSidebar = useCallback(() => setSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), [])

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      lastUpdated,
      touchLastUpdated,
      sidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
    }),
    [
      currency,
      lastUpdated,
      touchLastUpdated,
      sidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
    ],
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider')
  }
  return context
}
