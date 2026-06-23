import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AssetsPage } from '@/pages/AssetsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { NewsPage } from '@/pages/NewsPage'

const router = createBrowserRouter([
  {
    path: '/',
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
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
