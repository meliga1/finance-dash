import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AssetsPage } from '@/pages/AssetsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { NewsPage } from '@/pages/NewsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LoginPage } from '@/pages/LoginPage'
import { SetupPage } from '@/pages/SetupPage'
import { RequireAuth } from './RequireAuth'
import { GuestOnly } from './GuestOnly'

const router = createBrowserRouter([
  {
    element: <GuestOnly variant="login" />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
  {
    element: <GuestOnly variant="setup" />,
    children: [{ path: 'setup', element: <SetupPage /> }],
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
            handle: { title: 'Dashboard' },
          },
          {
            path: 'ativos',
            element: <AssetsPage />,
            handle: { title: 'Ativos' },
          },
          {
            path: 'historico',
            element: <HistoryPage />,
            handle: { title: 'Histórico' },
          },
          {
            path: 'noticias',
            element: <NewsPage />,
            handle: { title: 'Notícias' },
          },
          {
            path: 'configuracoes',
            element: <SettingsPage />,
            handle: { title: 'Configurações' },
          },
        ],
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
