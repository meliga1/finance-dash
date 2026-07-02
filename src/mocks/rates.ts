import type { CurrencyCode } from '@/types/common'

/**
 * Câmbio fixo só para o mock. No mundo real o back-end retorna os valores já
 * convertidos conforme `?currency=`; aqui simulamos isso a partir da base BRL.
 */
export const BRL_PER_USD = 5.4

const round2 = (value: number) => Math.round(value * 100) / 100

export function convertFromBRL(valueBRL: number, currency: CurrencyCode): number {
  if (currency === 'BRL') return valueBRL
  return round2(valueBRL / BRL_PER_USD)
}
