// @flow
import type {CoinsData} from './coins'
import type {CoinSelectOption} from './coins-select'

export type PortfolioState = {
  coin: ?CoinSelectOption,
  units: string,
  initialPrice: string
}

export type Portfolio = {
  transactions: Array<Transaction>,
  totalInvested: number,
  currentTotalValue: number,
  totalMargin: number,
  totalProfit: number,
  coins: CoinsData,
  isAddNewTransactionModalOpen: boolean,
  secToNextUpdate: number,
  isUpdatingCoinsData: boolean,
  isRefreshButtonDisabled?: boolean
}

export type Transaction = {
  coinId: string,
  coinName: string,
  symbol: string,
  units: string,
  initialPrice: string,
  currentPrice: ?number,
  totalInvested: number,
  currentValue: ?number,
  margin: ?number,
  profit: ?number,
  editMode: boolean,
  isCoinValid: boolean,
  isUnitsValid: boolean,
  isInitialPriceValid: boolean
}

export type TransactionRowProps = {
  remove: () => void,
  transaction: Transaction,
  coins: CoinsData
}
