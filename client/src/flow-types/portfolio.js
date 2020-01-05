// @flow
import type {CoinsData} from './coins'
import type {CoinSelectOption} from './coins-select'

export type PortfolioState = {
  transactions: Array<Transaction>,
  totalInvested: number,
  currentTotalValue: number,
  totalMargin: number,
  totalProfit: number,
  secToNextUpdate: number,
  isUpdatingCoinsData: boolean,
  urlHash: ?string,
  isRefreshButtonDisabled?: boolean,
  urlCopiedToClipboard?: boolean,
  shakeCopyToClipboardButton: boolean,
  previousTransactions: Array<Transaction>
}

export type Transaction = {
  coin: CoinSelectOption,
  units: string,
  initialPrice: string,
  currentPrice: ?number,
  totalInvested: number,
  currentValue: ?number,
  margin: ?number,
  profit: ?number,
  editMode: boolean,
  isNew: boolean,
  isCoinValid: boolean,
  isUnitsValid: boolean,
  isInitialPriceValid: boolean
}

export type TransactionState = {
  fieldToFocus: string,
  isCoinMenuOpen: boolean,
  isInDeleteConfirmation: boolean
}

export type TransactionRowProps = {
  transaction: Transaction,
  index: number
}

// Array of arrays with 3 elements: coindId, units and initialPrice in USD
// e.g.: [['ADA', 140, 0.07], ['BTC', 0.433121, 14382]]
export type URLPortfolio = Array<[string, string, string]>
