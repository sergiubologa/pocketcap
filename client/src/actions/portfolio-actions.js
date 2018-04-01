// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION'
}

const Actions = {
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
