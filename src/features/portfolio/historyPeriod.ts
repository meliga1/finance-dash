import { formatDate, formatMonthLabel, formatWeekRangeLabel } from '@/lib/formatters'
import type { HistoryPeriod } from '@/features/portfolio/types'

export const PERIOD_OPTIONS: { value: HistoryPeriod; label: string }[] = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
]

export const PERIOD_LIMIT: Record<HistoryPeriod, number> = { daily: 30, weekly: 12, monthly: 12 }

export const PERIOD_EYEBROW: Record<HistoryPeriod, string> = {
  daily: 'Últimos 30 dias',
  weekly: 'Últimas 12 semanas',
  monthly: 'Últimos 12 meses',
}

export const PERIOD_COLUMN_LABEL: Record<HistoryPeriod, string> = {
  daily: 'Dia',
  weekly: 'Semana',
  monthly: 'Mês',
}

export function formatPointLabel(period: HistoryPeriod, iso: string): string {
  if (period === 'monthly') return formatMonthLabel(iso)
  if (period === 'weekly') return formatWeekRangeLabel(iso)
  return formatDate(iso)
}
