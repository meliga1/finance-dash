import type { NewsItem } from '@/features/news/types'
import { formatDate } from '@/lib/formatters'

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M6 4h6v6M12 4 4.5 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-card border border-border-subtle bg-surface p-4 shadow-card transition-colors hover:border-border hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-body font-medium text-text-primary">{item.title}</h3>
        <span className="mt-0.5 shrink-0 text-text-muted transition-colors group-hover:text-accent-teal">
          <ExternalIcon />
        </span>
      </div>

      <p className="mt-1.5 line-clamp-2 text-caption text-text-secondary">{item.summary}</p>

      <div className="mt-3 flex items-center gap-2 text-caption text-text-muted">
        <span className="font-medium text-text-secondary">{item.source}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
      </div>
    </a>
  )
}
