// Tipos comuns — espelham a seção "Contrato de tipos" do API_CONTRACT.md

export type CurrencyCode = 'BRL' | 'USD'

export interface PriceChange {
  absolute: number
  percentage: number
}
