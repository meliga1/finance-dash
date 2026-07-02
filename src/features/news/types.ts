// GET /news
export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string // ISO datetime UTC
}
