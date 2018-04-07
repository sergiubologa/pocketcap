// @flow
import axios from 'axios'
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as PortfolioActionsNames} from '../actions/portfolio-actions'
import type {Portfolio, Transaction} from '../flow-types/portfolio'
import type {CoinsData} from '../flow-types/coins'

class PortfolioStore extends EventEmitter {
  COINS_DATA_STORAGE_KEY: string = 'COINS_DATA'
  COINS_UPDATE_INTERVAL: number = 5 * 60 // 5 minutes
  portfolio: Portfolio = {
    transactions: [],
    coins: this.getCoinsData(),
    secToNextUpdate: this.COINS_UPDATE_INTERVAL,
    isAddNewTransactionModalOpen: false,
    isUpdatingCoinsData: false
  }

  addTransaction(transaction: Transaction) {
    this.portfolio.transactions = this.portfolio.transactions.concat(transaction)
    this.emit('change')
  }

  removeTransaction(index) {
    this.portfolio.transactions = this.portfolio.transactions.filter((item, i) => i !== index)
    this.emit('change')
  }

  async fetchCoinsData() {
    this.portfolio.isUpdatingCoinsData = true
    this.emit('change')

    const res = await axios.get('/api/coins')
    const coins = res.data
    localStorage.setItem(this.COINS_DATA_STORAGE_KEY, JSON.stringify(coins))
    this.portfolio.isUpdatingCoinsData = false
    this.portfolio.secToNextUpdate = this.COINS_UPDATE_INTERVAL
    this.emit('change')
  }

  toggleAddNewTransactionModal() {
    this.portfolio.isAddNewTransactionModalOpen = !this.portfolio.isAddNewTransactionModalOpen
    this.emit('change')
  }

  decrementCountdown() {
    this.portfolio.secToNextUpdate--

    if (this.portfolio.secToNextUpdate === 0) {
      this.fetchCoinsData()
    }

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
      case PortfolioActionsNames.DECREMENT_COUNTDOWN:
        this.decrementCountdown()
        break
      default:
        break
    }
  }
}

const portfolioStore = new PortfolioStore()
AppDispatcher.register(portfolioStore.handleActions.bind(portfolioStore))

export default portfolioStore
