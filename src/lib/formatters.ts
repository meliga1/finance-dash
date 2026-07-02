export type Currency = 'BRL' | 'USD'

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
