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
  COINS_UPDATE_INTERVAL_ON_FAILURE: number = 0.5 * 60 // 5 minutes
  portfolio: Portfolio = {
    transactions: [
      {
        coinId: 'BTC',
        coinName: 'Bitcoin',
        units: 0.465345,
        initialPrice: 10232.56,
        currentPrice: 12354.21,
        totalInvested: 5765.67,
        currentValue: 6824.98,
        margin: 11,
        profit: 1068.34,
        editMode: false
      },
      {
        coinId: 'ETH',
        coinName: 'Ethereum',
        units: 0.465345,
        initialPrice: 10232.56,
        currentPrice: 12354.21,
        totalInvested: 5765.67,
        currentValue: 6824.98,
        margin: 11,
        profit: 1068.34,
        editMode: false
      },
      {
        coinId: 'ADA',
        coinName: 'Cardano',
        units: 0.465345,
        initialPrice: 10232.56,
        currentPrice: 12354.21,
        totalInvested: 5765.67,
        currentValue: 6824.98,
        margin: 11,
        profit: 1068.34,
        editMode: false
      },
      {
        coinId: 'MON',
        coinName: 'Monero',
        units: 0.465345,
        initialPrice: 10232.56,
        currentPrice: 12354.21,
        totalInvested: 5765.67,
        currentValue: 6824.98,
        margin: 11,
        profit: 1068.34,
        editMode: false
      }
    ],
    totalInvested: 23344.56,
    currentTotalValue: 27543.33,
    totalMargin: 4268.04,
    totalProfit: 20.4,
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

    try {
      const res = await axios.get('/api/coins')
      const coins = res.data
      localStorage.setItem(this.COINS_DATA_STORAGE_KEY, JSON.stringify(coins))
      this.portfolio.secToNextUpdate = this.COINS_UPDATE_INTERVAL
    }
    catch(error) {
      this.portfolio.secToNextUpdate = this.COINS_UPDATE_INTERVAL_ON_FAILURE
    }
    finally {
      this.portfolio.isUpdatingCoinsData = false
      this.emit('change')
    }
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
