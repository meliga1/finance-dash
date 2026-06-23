import { Outlet } from 'react-router-dom'
import { LayoutProvider } from '@/components/layout/layout-context'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function AppLayout() {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen bg-canvas">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  )
}
