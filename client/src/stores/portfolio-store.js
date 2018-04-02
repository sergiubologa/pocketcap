// @flow
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as PortfolioActionsNames} from '../actions/portfolio-actions'
import type {Portfolio, Transaction} from '../flow-types/portfolio'
import type {CoinsData} from '../flow-types/coins'

class PortfolioStore extends EventEmitter {
  COINS_DATA_STORAGE_KEY: string = 'COINS_DATA'
  portfolio: Portfolio = {
    transactions: [],
    coins: this.getCoinsData(),
    isAddNewTransactionModalOpen: false
  }

  addTransaction(transaction: Transaction) {
    this.portfolio.transactions = this.portfolio.transactions.concat(transaction)
    this.emit('change')
  }

  removeTransaction(index) {
    this.portfolio.transactions = this.portfolio.transactions.filter((item, i) => i !== index)
    this.emit('change')
  }

  fetchCoinsData() {
    fetch('/api/coins')
      .then(res => res.json())
      .then(coins => {
        localStorage.setItem(this.COINS_DATA_STORAGE_KEY, JSON.stringify(coins))
        this.emit('change')
      })
      .catch((err) => console.log(err))
  }

  toggleAddNewTransactionModal() {
    this.portfolio.isAddNewTransactionModalOpen = !this.portfolio.isAddNewTransactionModalOpen
    this.emit('change')
  }

  getPortfolio(): Portfolio {
    this.portfolio.coins = this.getCoinsData()
    return this.portfolio
  }

  getCoinsData(): CoinsData {
    const coins: ?string = localStorage.getItem(this.COINS_DATA_STORAGE_KEY)
    const defaultCoinsData: CoinsData = { added_at: undefined, data: [] }
    return coins ? JSON.parse(coins) : defaultCoinsData
  }

  handleActions(action) {
    switch (action.type) {
      case PortfolioActionsNames.ADD_TRANSACTION:
        this.addTransaction(action.data)
        break
      case PortfolioActionsNames.REMOVE_TRANSACTION:
        this.removeTransaction(action.data)
        break
      case PortfolioActionsNames.FETCH_COINS_DATA:
        this.fetchCoinsData()
        break
      case PortfolioActionsNames.TOGGLE_ADD_NEW_TRANSACTION_MODAL:
        this.toggleAddNewTransactionModal()
        break
      default:
        break
    }
  }
}

const portfolioStore = new PortfolioStore()
AppDispatcher.register(portfolioStore.handleActions.bind(portfolioStore))

export default portfolioStore
