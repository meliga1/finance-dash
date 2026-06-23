const MINUTE_MS = 60_000
const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

export function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = Math.max(0, now.getTime() - date.getTime())

  if (diffMs < MINUTE_MS) return 'agora'

  const minutes = Math.floor(diffMs / MINUTE_MS)
  if (diffMs < HOUR_MS) return `há ${minutes} min`

  const hours = Math.floor(diffMs / HOUR_MS)
  if (diffMs < DAY_MS) return `há ${hours} h`

  const days = Math.floor(diffMs / DAY_MS)
  return `há ${days} d`
}
