// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  FETCH_COINS_DATA: 'FETCH_COINS_DATA'
}

const Actions = {
  fetchCoinsData: () => {
    AppDispatcher.dispatch({
      type: Names.FETCH_COINS_DATA
    })
  }
}

export {
  Actions,
  Names
}

export default Actions
