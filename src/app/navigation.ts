import type { ComponentType, SVGProps } from 'react'

export type NavIconName = 'dashboard' | 'assets' | 'history' | 'news'

export type NavItem = {
  to: string
  label: string
  icon: NavIconName
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/ativos', label: 'Ativos', icon: 'assets' },
  { to: '/historico', label: 'Histórico', icon: 'history' },
  { to: '/noticias', label: 'Notícias', icon: 'news' },
]

type IconProps = SVGProps<SVGSVGElement>

const DashboardIcon: ComponentType<IconProps> = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const AssetsIcon: ComponentType<IconProps> = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="M4 14.5V8.75L10 5.5l6 3.25V14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 11.25h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const HistoryIcon: ComponentType<IconProps> = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="M10 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10 7.25V10l2 1.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 5.5 3.75 3.75M3.75 3.75V6.5M3.75 3.75H6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const NewsIcon: ComponentType<IconProps> = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="M4.5 5.5h11M4.5 9.5h11M4.5 13.5H11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect x="3" y="3.5" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const NAV_ICONS: Record<NavIconName, ComponentType<IconProps>> = {
  dashboard: DashboardIcon,
  assets: AssetsIcon,
  history: HistoryIcon,
  news: NewsIcon,
}
