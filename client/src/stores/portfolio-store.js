// @flow
import axios from 'axios'
import JsonUrl from 'json-url/dist/browser/json-url'
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as PortfolioActionsNames} from '../actions/portfolio-actions'
import * as Utils from '../utils/utils'
import type {PortfolioState, Transaction} from '../flow-types/portfolio'
import type {CoinsData, Coin} from '../flow-types/coins'

class PortfolioStore extends EventEmitter {
  COINS_DATA_STORAGE_KEY: string = 'COINS_DATA'
  COINS_UPDATE_INTERVAL: number = 5 * 60 // 5 minutes
  COINS_UPDATE_INTERVAL_ON_FAILURE: number = 0.5 * 60 // 30 seconds

  previousPortfolio: ?PortfolioState = null
  portfolio: PortfolioState = {
    transactions: [],
    totalInvested: 0,
    currentTotalValue: 0,
    totalMargin: 0,
    totalProfit: 0,
    secToNextUpdate: this.COINS_UPDATE_INTERVAL,
    isAddNewTransactionModalOpen: false,
    isUpdatingCoinsData: false
  }

  async fetchCoinsData() {
    this.portfolio.isUpdatingCoinsData = true
    this.emit('change')

    try {
      const res = await axios.get('/api/coins')
      const coins = res.data
      localStorage.setItem(this.COINS_DATA_STORAGE_KEY, JSON.stringify(coins))
      this.portfolio.secToNextUpdate = this.COINS_UPDATE_INTERVAL
      this.updateTransactionsInitialPrices()
    }
    catch(error) {
      this.portfolio.secToNextUpdate = this.COINS_UPDATE_INTERVAL_ON_FAILURE
    }
    finally {
      this.portfolio.isUpdatingCoinsData = false
      this.emit('change')
    }
  }

  addNewTransaction() {
    const newTransaction: Transaction = {
      coin: {
        id: '', label: '', symbol: ''
      },
      units: '',
      initialPrice: '',
      currentPrice: null,
      totalInvested: 0,
      currentValue: 0,
      margin: 0,
      profit: 0,
      editMode: true, isNew: true,
      isCoinTouched: false, isCoinValid: false,
      isUnitsTouched: false, isUnitsValid: false,
      isInitialPriceTouched: false, isInitialPriceValid: false
    }
    this.portfolio.transactions.push(newTransaction)
    this.emit('change')
  }

  saveTransaction() {
    const inEditTransaction: ?Transaction = this.portfolio.transactions
      .find(t => t.editMode)

    if (inEditTransaction) {
      const {isCoinValid, isUnitsValid, isInitialPriceValid} = inEditTransaction
      if (isCoinValid && isUnitsValid && isInitialPriceValid) {
        inEditTransaction.editMode = false
        inEditTransaction.isNew = false
        this.calculateTotalValues()
        //this.updateUrl()
        this.emit('change')
      }
    }
  }

  updateUrl() {
    const {transactions} = this.portfolio

    if (transactions && transactions.length > 0) {
      const codecLzw = JsonUrl('lzw')
      // const codecLzma= jsonUrl('lzma')
      // const codecLzString = jsonUrl('lzstring')
      // const codecPack = jsonUrl('pack')
      const urlData = transactions.reduce((result: Array<any>, t) => {
        result.push([t.coin.id, t.units, t.initialPrice])
        return result
      }, [])

      console.log('URL data: ', urlData, codecLzw)

      codecLzw.stats(urlData).then(({ rawencoded, compressedencoded, compression }) => {
        console.log('LZW:')
  			console.log(`Raw URI-encoded JSON string length: ${rawencoded}`)
  			console.log(`Compressed URI-encoded JSON string length: ${compressedencoded}`)
  			console.log(`Compression ratio (raw / compressed): ${compression}`)
        console.log('\r\n', '\r\n')
  		})
    }
  }

  cancelTransaction() {
    const transaction = this.portfolio.transactions
      .find(t => t.editMode)

    if (transaction) {
      if (transaction.isNew) {
        const index = this.portfolio.transactions.findIndex(t => t.editMode)
        this.portfolio.transactions.splice(index, 1)
      } else {
        this.portfolio = JSON.parse(JSON.stringify(this.previousPortfolio))
        this.previousPortfolio = undefined
      }

      this.emit('change')
    }
  }

  removeTransaction(index: number) {
    const transaction = this.portfolio.transactions[index]
    if (transaction) {
        this.portfolio.transactions.splice(index, 1)
        this.calculateTotalValues()
        this.emit('change')
    }
  }

  editTransaction(index: number) {
    this.cancelTransaction()
    this.previousPortfolio = JSON.parse(JSON.stringify(this.portfolio))
    const transaction = this.portfolio.transactions[index]
    if (transaction && !transaction.editMode) {
        transaction.editMode = true
        this.emit('change')
    }
  }

  toggleAddNewTransactionModal() {
    this.portfolio.isAddNewTransactionModalOpen = !this.portfolio.isAddNewTransactionModalOpen
    this.emit('change')
  }

  transactionCoinChanged(newCoinId: ?string) {
    const inEditTransaction: ?Transaction = this.portfolio.transactions.find(t => t.editMode)

    if (inEditTransaction) {
      if (!newCoinId) {
        inEditTransaction.coin.id = ''
        inEditTransaction.coin.label = ''
        inEditTransaction.coin.symbol = ''
        inEditTransaction.currentPrice = null
        inEditTransaction.isCoinValid = false
        this.calculateTransactionValues(inEditTransaction)
        this.emit('change')
      } else {
        const coins: CoinsData = this.getCoinsData()
        const newCoin: ?Coin = coins.data.find(c => c.id === newCoinId)

        if (newCoin) {
          inEditTransaction.coin.id = newCoin.id
          inEditTransaction.coin.label = newCoin.name
          inEditTransaction.coin.symbol = newCoin.symbol
          inEditTransaction.currentPrice = newCoin.price_usd
          inEditTransaction.isCoinValid = true
          this.calculateTransactionValues(inEditTransaction)
          this.emit('change')
        }
      }
    }
  }

  transactionUnitsChanged(units: string) {
    const inEditTransaction: ?Transaction = this.portfolio.transactions.find(t => t.editMode)

    if (inEditTransaction) {
      inEditTransaction.units = units
      inEditTransaction.isUnitsValid = Utils.isValidDecimal(units)
      this.calculateTransactionValues(inEditTransaction)
      this.emit('change')
    }
  }

  transactionInitialPriceChanged(price: string) {
    const inEditTransaction: ?Transaction = this.portfolio.transactions.find(t => t.editMode)

    if (inEditTransaction) {
      inEditTransaction.initialPrice = price
      inEditTransaction.isInitialPriceValid = Utils.isValidDecimal(price)
      this.calculateTransactionValues(inEditTransaction)
      this.emit('change')
    }
  }

  decrementCountdown() {
    this.portfolio.secToNextUpdate--

    if (this.portfolio.secToNextUpdate === 0) {
      this.fetchCoinsData()
    }

    this.emit('change')
  }

  getPortfolio(): PortfolioState {
    return this.portfolio
  }

  calculateTransactionValues(transaction: Transaction) {
    if (transaction) {
      const {isCoinValid, isUnitsValid, isInitialPriceValid} = transaction
      const isValid: boolean = isCoinValid && isUnitsValid && isInitialPriceValid
      transaction.totalInvested = 0
      transaction.currentValue = 0
      transaction.margin = transaction.profit = 0

      if (isValid) {
        const units: number = parseFloat(transaction.units)
        const initialPrice: number = parseFloat(transaction.initialPrice)
        const {currentPrice} = transaction
        transaction.totalInvested = units * initialPrice
        transaction.currentValue = units * (currentPrice || 0)
        transaction.profit = transaction.currentValue - transaction.totalInvested
        transaction.margin = transaction.profit / transaction.totalInvested * 100
      }
    }
  }

  calculateTotalValues() {
    const transactions: Array<Transaction> = this.portfolio.transactions
      .filter(t => !t.editMode)

    this.portfolio.totalInvested = 0
    this.portfolio.currentTotalValue = 0
    this.portfolio.totalMargin = 0
    this.portfolio.totalProfit = 0
    if (transactions && transactions.length > 0) {
      transactions.forEach(t => {
        this.portfolio.totalInvested += t.totalInvested
        this.portfolio.currentTotalValue += t.currentValue
      })
      this.portfolio.totalProfit = this.portfolio.currentTotalValue - this.portfolio.totalInvested
      this.portfolio.totalMargin = this.portfolio.totalProfit / this.portfolio.totalInvested * 100
    }
  }

  updateTransactionsInitialPrices() {
    const coins: CoinsData = this.getCoinsData()
    this.portfolio.transactions.forEach(transaction => {
      const coin: ?Coin = coins.data.find(c => c.id === transaction.coin.id)
      if (coin) {
        transaction.currentPrice = coin.price_usd
        this.calculateTransactionValues(transaction)
      }
    })

    this.calculateTotalValues()
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
      case PortfolioActionsNames.SAVE_TRANSACTION:
        this.saveTransaction()
        break
      case PortfolioActionsNames.CANCEL_TRANSACTION:
        this.cancelTransaction()
        break
      case PortfolioActionsNames.REMOVE_TRANSACTION:
        this.removeTransaction(action.data)
        break
      case PortfolioActionsNames.EDIT_TRANSACTION:
        this.editTransaction(action.data)
        break
      case PortfolioActionsNames.FETCH_COINS_DATA:
        this.fetchCoinsData()
        break
      case PortfolioActionsNames.TOGGLE_ADD_NEW_TRANSACTION_MODAL:
        this.toggleAddNewTransactionModal()
        break
      case PortfolioActionsNames.TRANSACTION_COIN_CHANGED:
        this.transactionCoinChanged(action.data)
        break
      case PortfolioActionsNames.TRANSACTION_UNITS_CHANGED:
        this.transactionUnitsChanged(action.data)
        break
      case PortfolioActionsNames.TRANSACTION_INITIAL_PRICE_CHANGED:
        this.transactionInitialPriceChanged(action.data)
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
