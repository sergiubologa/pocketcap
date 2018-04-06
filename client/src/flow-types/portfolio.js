// @flow
import type {CoinsData} from './coins'

export type Portfolio = {
  transactions: Array<Transaction>,
  coins: CoinsData,
  isAddNewTransactionModalOpen: boolean,
  secToNextUpdate: number,
  isUpdatingCoinsData: boolean,
  isRefreshButtonDisabled?: boolean
}

export type Transaction = {
  coinId: string,
  balance: number,
  initialPrice: number,
  currentPrice: number,
  totalInvested: number,
  total: number,
  margin: number,
  profit: number,
  editMode: boolean
}
