// @flow
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as CoinsActionsNames} from '../actions/coins-actions'
import type {CoinsData} from '../flow-types/coins'

class CoinsStore extends EventEmitter {
  coinsData: CoinsData = { coins: { added_at: undefined, data: [] } }

  fetchCoinsData() {
    fetch('/api/coins', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(coins => {
      this.coinsData = {coins}
      this.emit('change')
    })
    .catch((err) => {
      console.log(err)
    })
  }

  getCoinsData(): CoinsData {
    return this.coinsData
  }

  handleActions(action) {
    switch (action.type) {
      case CoinsActionsNames.FETCH_COINS_DATA:
        this.fetchCoinsData()
        break
      default:
        break
    }
  }
}

const coinsStore = new CoinsStore()
AppDispatcher.register(coinsStore.handleActions.bind(coinsStore))

export default coinsStore
