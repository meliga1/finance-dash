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
