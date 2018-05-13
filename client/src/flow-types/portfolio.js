// @flow
import type {CoinsData} from './coins'
import type {CoinSelectOption} from './coins-select'

export type PortfolioState = {
  transactions: Array<Transaction>,
  totalInvested: number,
  currentTotalValue: number,
  totalMargin: number,
  totalProfit: number,
  isAddNewTransactionModalOpen: boolean,
  secToNextUpdate: number,
  isUpdatingCoinsData: boolean,
  urlHash: ?string,
  isRefreshButtonDisabled?: boolean,
  urlCopiedToClipboard?: boolean,
  shakeCopyToClipboardButton: boolean
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
  fieldToFocus: string
}

export type TransactionRowProps = {
  transaction: Transaction,
  index: number
}

export type URLPortfolio = Array<[string, string, string]>
