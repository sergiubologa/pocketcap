// @flow
export type Portfolio = {
  transactions: Array<Transaction>
}

export type Transaction = {
  coinId: string,
  balance: number,
  initialPrice: number,
  currentPrice: number,
  initialTotal: number,
  currentTotal: number,
  profitMargin: number,
  profit: number
}
