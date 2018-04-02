// @flow
import AppDispatcher from '../app-dispatcher'
import type {Transaction} from '../flow-types/portfolio'

const Names = {
  FETCH_COINS_DATA: 'FETCH_COINS_DATA',
  TOGGLE_ADD_NEW_TRANSACTION_MODAL: 'TOGGLE_ADD_NEW_TRANSACTION_MODAL',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION'
}

const Actions = {
  fetchCoinsData: () => {
    AppDispatcher.dispatch({
      type: Names.FETCH_COINS_DATA
    })
  },
  toggleAddNewTransactionModal: () => {
    AppDispatcher.dispatch({
      type: Names.TOGGLE_ADD_NEW_TRANSACTION_MODAL
    })
  },
  addTransaction: (transaction: Transaction) => {
    AppDispatcher.dispatch({
      type: Names.ADD_TRANSACTION,
      data: transaction
    })
  },
  removeTransaction: (index: number) => {
    AppDispatcher.dispatch({
      type: Names.REMOVE_TRANSACTION,
      data: index
    })
  }
}

export {
  Actions,
  Names
}

export default Actions
