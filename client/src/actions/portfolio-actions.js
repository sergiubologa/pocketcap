// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  FETCH_COINS_DATA: 'FETCH_COINS_DATA',
  DECREMENT_COUNTDOWN: 'DECREMENT_COUNTDOWN',
  ADD_NEW_TRANSACTION: 'ADD_NEW_TRANSACTION',
  CANCEL_TRANSACTION: 'CANCEL_TRANSACTION',
  SAVE_TRANSACTION: 'SAVE_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
  EDIT_TRANSACTION: 'EDIT_TRANSACTION',
  TRANSACTION_COIN_CHANGED: 'TRANSACTION_COIN_CHANGED',
  TRANSACTION_UNITS_CHANGED: 'TRANSACTION_UNITS_CHANGED',
  TRANSACTION_INITIAL_PRICE_CHANGED: 'TRANSACTION_INITIAL_PRICE_CHANGED',
  SET_PORTFOLIO_FROM_ENCODED_URL_PARAM: 'SET_PORTFOLIO_FROM_ENCODED_URL_PARAM',
  CLEAR_PORTFOLIO: 'CLEAR_PORTFOLIO'
}

const Actions = {
  fetchCoinsData: () => AppDispatcher.dispatch({
    type: Names.FETCH_COINS_DATA
  }),
  addNewTransaction: () => AppDispatcher.dispatch({
    type: Names.ADD_NEW_TRANSACTION
  }),
  cancelTransaction: () => AppDispatcher.dispatch({
    type: Names.CANCEL_TRANSACTION
  }),
  saveTransaction: () => AppDispatcher.dispatch({
    type: Names.SAVE_TRANSACTION
  }),
  removeTransaction: (index: number) => AppDispatcher.dispatch({
    type: Names.REMOVE_TRANSACTION,
    data: index
  }),
  editTransaction: (index: number) => AppDispatcher.dispatch({
    type: Names.EDIT_TRANSACTION,
    data: index
  }),
  transactionCoinChanged: (coinId: ?string) => AppDispatcher.dispatch({
    type: Names.TRANSACTION_COIN_CHANGED,
    data: coinId
  }),
  transactionUnitsChanged: (units: ?string) => AppDispatcher.dispatch({
    type: Names.TRANSACTION_UNITS_CHANGED,
    data: units
  }),
  transactionInitialPriceChanged: (price: ?string) => AppDispatcher.dispatch({
    type: Names.TRANSACTION_INITIAL_PRICE_CHANGED,
    data: price
  }),
  decrementCountdown: () => AppDispatcher.dispatch({
    type: Names.DECREMENT_COUNTDOWN
  }),
  setPortfolioFromEncodedUrlParam: (encodedPortfolio: ?string) => AppDispatcher.dispatch({
    type: Names.SET_PORTFOLIO_FROM_ENCODED_URL_PARAM,
    data: encodedPortfolio
  }),
  clearPortfolio: () => AppDispatcher.dispatch({
    type: Names.CLEAR_PORTFOLIO
  })
}

export {
  Actions,
  Names
}

export default Actions
