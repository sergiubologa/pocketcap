// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  FETCH_COINS_DATA: 'FETCH_COINS_DATA',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION'
}

const Actions = {
  fetchCoinsData: () => {
    AppDispatcher.dispatch({
      type: Names.FETCH_COINS_DATA
    })
  },
  addTransaction: () => {
    AppDispatcher.dispatch({
      type: Names.ADD_TRANSACTION
    })
  },
  removeTransaction: () => {
    AppDispatcher.dispatch({
      type: Names.REMOVE_TRANSACTION
    })
  }
}

export {
  Actions,
  Names
}

export default Actions
