// @flow
import type {CoinsData} from './coins'

export type Portfolio = {
  transactions: Array<Transaction>,
  coins: CoinsData,
  isAddNewTransactionModalOpen: boolean
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
