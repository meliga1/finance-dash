export interface BybitWalletBalanceResponse {
  retCode: number
  retMsg: string
  result: {
    list: Array<{
      accountType: string
      coin: Array<{
        coin: string
        walletBalance: string
      }>
    }>
  }
}

export interface Holding {
  symbol: string
  quantity: number
}

export interface HoldingsResponse {
  holdings: Holding[]
}

export interface Asset {
  symbol: string
  name: string
  averageBuyPriceBRL: number
}
