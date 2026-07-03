import type { ReactNode } from 'react'
import { useNews } from '@/features/news/hooks'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui'
import { NewsCard } from './NewsCard'

function NewsListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-card border border-border-subtle bg-surface p-4 shadow-card"
        >
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="mt-2 w-full" />
          <Skeleton variant="text" className="mt-3 h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

function NewsPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-border-subtle bg-surface shadow-card">
      {children}
    </div>
  )
}

export function NewsList({ limit = 10 }: { limit?: number }) {
  const { data, isPending, isError, refetch } = useNews(limit)

  if (isPending) return <NewsListSkeleton count={Math.min(limit, 4)} />

  if (isError) {
    return (
      <NewsPanel>
        <ErrorState
          description="Não foi possível carregar as notícias."
          onRetry={() => refetch()}
        />
      </NewsPanel>
    )
  }

  const items = data ?? []
  if (items.length === 0) {
    return (
      <NewsPanel>
        <EmptyState
          title="Nenhuma notícia por enquanto"
          description="Quando houver novidades de mercado, elas aparecerão aqui."
        />
      </NewsPanel>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}
