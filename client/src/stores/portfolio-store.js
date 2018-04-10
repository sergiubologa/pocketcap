// @flow
import axios from 'axios'
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as PortfolioActionsNames} from '../actions/portfolio-actions'
import type {Portfolio, Transaction} from '../flow-types/portfolio'
import type {CoinsData, Coin} from '../flow-types/coins'

class PortfolioStore extends EventEmitter {
  COINS_DATA_STORAGE_KEY: string = 'COINS_DATA'
  COINS_UPDATE_INTERVAL: number = 5 * 60 // 5 minutes
  COINS_UPDATE_INTERVAL_ON_FAILURE: number = 0.5 * 60 // 30 seconds

  portfolio: Portfolio = {
    transactions: [],
    totalInvested: 0,
    currentTotalValue: 0,
    totalMargin: 0,
    totalProfit: 0,
    coins: this.getCoinsData(),
    secToNextUpdate: this.COINS_UPDATE_INTERVAL,
    isAddNewTransactionModalOpen: false,
    isUpdatingCoinsData: false
  }

  addNewTransaction() {
    const newTransaction: Transaction = {
      coinId: '',
      coinName: null,
      units: null,
      initialPrice: null,
      currentPrice: null,
      totalInvested: 0,
      currentValue: 0,
      margin: 0,
      profit: 0,
      editMode: true
    }
    this.portfolio.transactions.push(newTransaction)
    this.emit('change')
  }

  saveNewTransaction() {
    // this.portfolio.transactions = this.portfolio.transactions.concat(transaction)
    // this.emit('change')
  }

  cancelNewTransaction() {
    const newTransactionIndex = this.portfolio.transactions
      .findIndex((t) => t.editMode)

    if (newTransactionIndex > -1) {
      this.portfolio.transactions.splice(newTransactionIndex, 1)
      this.emit('change')
    }
  }

  removeTransaction(index) {
    const transaction = this.portfolio.transactions[index]
    if (transaction) {
        this.portfolio.transactions.splice(index, 1)
    }

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

  inEditTransactionCoinChanged(newCoinId: ?string) {
    const inEditTransaction: ?Transaction = this.portfolio.transactions.find(t => t.editMode)

    if (inEditTransaction) {
      if (!newCoinId) {
        inEditTransaction.coinId = ''
        inEditTransaction.coinName = ''
        inEditTransaction.currentPrice = null
        this.emit('change')
      } else {
        const newCoin: ?Coin = this.portfolio.coins.data.find(c => c.id === newCoinId)

        if (newCoin) {
          inEditTransaction.coinId = newCoin.id
          inEditTransaction.coinName = newCoin.name
          inEditTransaction.currentPrice = newCoin.price_usd
          this.emit('change')
        }
      }
    }
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
      case PortfolioActionsNames.ADD_NEW_TRANSACTION:
        this.addNewTransaction()
        break
      case PortfolioActionsNames.SAVE_NEW_TRANSACTION:
        this.saveNewTransaction()
        break
      case PortfolioActionsNames.CANCEL_NEW_TRANSACTION:
        this.cancelNewTransaction()
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
      case PortfolioActionsNames.IN_EDIT_TRANSACTION_COIN_CHANGED:
        this.inEditTransactionCoinChanged(action.data)
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
