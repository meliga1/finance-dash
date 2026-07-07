import type { CurrencyCode } from '@/types/common'

/** Alias para o tipo canônico do contrato (`CurrencyCode`). */
export type Currency = CurrencyCode

const LOCALE = 'pt-BR'

const currencyFormatters: Record<Currency, Intl.NumberFormat> = {
  BRL: new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  USD: new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
}

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 8,
})

const compactFormatters: Record<Currency, Intl.NumberFormat> = {
  BRL: new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }),
  USD: new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }),
}

export function formatCurrency(value: number, currency: Currency = 'BRL'): string {
  if (!Number.isFinite(value)) return '—'
  return currencyFormatters[currency].format(value)
}

export function formatCurrencyCompact(value: number, currency: Currency = 'BRL'): string {
  if (!Number.isFinite(value)) return '—'
  return compactFormatters[currency].format(value)
}

/** Formata quantidades (não-monetárias), ex.: 0,23 BTC ou 9.000 ADA. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return numberFormatter.format(value)
}

const monthFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  timeZone: 'UTC',
})

/** Converte "YYYY-MM" em rótulo curto, ex.: "jan/25". */
export function formatMonthLabel(yyyymm: string): string {
  const [year, month] = yyyymm.split('-').map(Number)
  if (!year || !month) return yyyymm

  const date = new Date(Date.UTC(year, month - 1, 1))
  const label = monthFormatter.format(date).replace('.', '').toLowerCase()
  return `${label}/${String(year).slice(-2)}`
}

/** Formata datetime ISO em data curta pt-BR, ex.: "28 jun 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.getUTCDate()
  const month = monthFormatter.format(date).replace('.', '').toLowerCase()
  return `${day} ${month} ${date.getUTCFullYear()}`
}

/** Formata o início de uma semana (candle 1w da Binance) como intervalo, ex.: "01–07 jul". */
export function formatWeekRangeLabel(iso: string): string {
  const start = new Date(iso)
  if (Number.isNaN(start.getTime())) return iso

  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 6)

  const startMonth = monthFormatter.format(start).replace('.', '').toLowerCase()
  const endMonth = monthFormatter.format(end).replace('.', '').toLowerCase()

  if (startMonth === endMonth) {
    return `${start.getUTCDate()}–${end.getUTCDate()} ${startMonth}`
  }
  return `${start.getUTCDate()} ${startMonth}–${end.getUTCDate()} ${endMonth}`
}

type FormatPercentOptions = {
  signed?: boolean
}

export function formatPercent(value: number, options: FormatPercentOptions = {}): string {
  const { signed = true } = options
  if (!Number.isFinite(value)) return '—'

  const formatted = percentFormatter.format(Math.abs(value))
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''

  return `${signed ? sign : ''}${formatted}%`
}
