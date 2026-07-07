import type { NewsItem } from '@/features/news/types'
import { delay, getNewsMock } from '@/mocks'

// GET /news?limit=10
export async function getNews(limit = 10): Promise<NewsItem[]> {
  // MOCK — na API real, trocar apenas o corpo desta função:
  // const { news } = await http<{ news: NewsItem[] }>(`/news?limit=${limit}`)
  // return news
  return delay(getNewsMock(limit))
}
