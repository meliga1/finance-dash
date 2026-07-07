import { NewsList } from '@/features/news/components'

export function NewsPage() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-body text-text-secondary">
        Notícias e movimentos de mercado relevantes para a sua carteira.
      </p>

      <NewsList limit={10} />
    </div>
  )
}
