// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  FETCH_COINS_DATA: 'FETCH_COINS_DATA',
  TOGGLE_ADD_NEW_TRANSACTION_MODAL: 'TOGGLE_ADD_NEW_TRANSACTION_MODAL',
  DECREMENT_COUNTDOWN: 'DECREMENT_COUNTDOWN',
  ADD_NEW_TRANSACTION: 'ADD_NEW_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION'
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
  removeTransaction: (index: number) => AppDispatcher.dispatch({
    type: Names.REMOVE_TRANSACTION,
    data: index
  }),
  decrementCountdown: () => AppDispatcher.dispatch({
    type: Names.DECREMENT_COUNTDOWN
  }),
}

export {
  Actions,
  Names
}

export default Actions
