import { useQuery } from '@tanstack/react-query'
import { getNews } from '@/features/news/services'
import { newsKeys } from './keys'

export function useNews(limit = 10) {
  return useQuery({
    queryKey: newsKeys.list(limit),
    queryFn: () => getNews(limit),
  })
}
