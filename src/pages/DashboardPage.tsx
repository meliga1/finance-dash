import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PortfolioSummaryCard } from '@/features/portfolio/components'
import { AllocationPieChart, PortfolioHistoryChart } from '@/components/charts'
import { NewsList } from '@/features/news/components'

function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-heading text-text-primary">{title}</h2>
      {action}
    </div>
  )
}

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <PortfolioSummaryCard />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AllocationPieChart />
        <PortfolioHistoryChart months={12} />
      </div>

      <section>
        <SectionHeader
          title="Notícias recentes"
          action={
            <Link
              to="/noticias"
              className="rounded text-caption font-medium text-accent-teal transition-colors hover:text-accent-teal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            >
              Ver todas
            </Link>
          }
        />
        <NewsList limit={3} />
      </section>
    </div>
  )
}
