// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  FETCH_COINS_DATA: 'FETCH_COINS_DATA',
  TOGGLE_ADD_NEW_TRANSACTION_MODAL: 'TOGGLE_ADD_NEW_TRANSACTION_MODAL',
  DECREMENT_COUNTDOWN: 'DECREMENT_COUNTDOWN',
  ADD_NEW_TRANSACTION: 'ADD_NEW_TRANSACTION',
  CANCEL_NEW_TRANSACTION: 'CANCEL_NEW_TRANSACTION',
  SAVE_TRANSACTION: 'SAVE_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
  TRANSACTION_COIN_CHANGED: 'TRANSACTION_COIN_CHANGED',
  TRANSACTION_UNITS_CHANGED: 'TRANSACTION_UNITS_CHANGED',
  TRANSACTION_INITIAL_PRICE_CHANGED: 'TRANSACTION_INITIAL_PRICE_CHANGED'
}

const Actions = {
  fetchCoinsData: () => AppDispatcher.dispatch({
    type: Names.FETCH_COINS_DATA
  }),
  toggleAddNewTransactionModal: () => AppDispatcher.dispatch({
    type: Names.TOGGLE_ADD_NEW_TRANSACTION_MODAL
  }),
  addNewTransaction: () => AppDispatcher.dispatch({
    type: Names.ADD_NEW_TRANSACTION
  }),
  cancelNewTransaction: () => AppDispatcher.dispatch({
    type: Names.CANCEL_NEW_TRANSACTION
  }),
  saveTransaction: () => AppDispatcher.dispatch({
    type: Names.SAVE_TRANSACTION
  }),
  removeTransaction: (index: number) => AppDispatcher.dispatch({
    type: Names.REMOVE_TRANSACTION,
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
  })
}

export {
  Actions,
  Names
}

export default Actions
