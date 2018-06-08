// @flow
import axios from 'axios'
import qs from 'qs'
import JsonUrl from 'json-url'
import 'json-url/dist/browser/json-url-msgpack'
import 'json-url/dist/browser/json-url-lzw'
import 'json-url/dist/browser/json-url-lzma'
import 'json-url/dist/browser/json-url-lzstring'
import 'json-url/dist/browser/json-url-safe64'
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as PortfolioActionsNames} from '../actions/portfolio-actions'
import * as Utils from '../utils/utils'
import {URL_PARAM_NAMES} from '../constants/common'
import type {PortfolioState, Transaction, URLPortfolio} from '../flow-types/portfolio'
import type {CoinsData, Coin} from '../flow-types/coins'
import type {Codec} from '../flow-types/vendors'

class PortfolioStore extends EventEmitter {
  COINS_DATA_STORAGE_KEY: string = 'COINS_DATA'
  COINS_UPDATE_INTERVAL: number = 5 * 60 // 5 minutes
  COINS_UPDATE_INTERVAL_ON_FAILURE: number = 0.5 * 60 // 30 seconds
  SECONDS_TO_SHAKE_BUTTON: number = 1
  SHAKE_BUTTON_TIMEOUT: TimeoutID

  previousPortfolio: ?PortfolioState = null
  portfolio: PortfolioState = this.defaultPortfolio()

  async fetchCoinsData() {
    this.portfolio.isUpdatingCoinsData = true
    this.emit('change')

    try {
      const res = await axios.get('/api/coins')
      const coins = res.data
      localStorage.setItem(this.COINS_DATA_STORAGE_KEY, JSON.stringify(coins))
      this.portfolio.secToNextUpdate = this.COINS_UPDATE_INTERVAL
      this.updateTransactionsCurrentPrices()
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
    this.portfolio.transactions.push(this.newTransaction())
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
        this.updateUrlHashForPortfolio()
        this.emit('change')
      }
    }
  }

  updateUrlHashForPortfolio() {
    const {transactions} = this.portfolio
    const codec: Codec = JsonUrl('lzstring')

    if (transactions && transactions.length > 0) {
      const formatForCompression = (result: URLPortfolio, t: Transaction) => {
        result.push([t.coin.id, t.units, t.initialPrice])
        return result
      }
      const urlData: URLPortfolio = transactions.reduce(formatForCompression, [])
      codec.compress(urlData).then((result: string) => {
        this.setPortfolioHashInUrl(result)
        this.emit('change')
      })
    } else {
      this.setPortfolioHashInUrl(null)
      this.emit('change')
    }
  }

  setPortfolioHashInUrl(portfolioHash: ?string) {
    const parsedParams: Object = qs.parse(Utils.getHashFromUrl())
    parsedParams[URL_PARAM_NAMES.PORTFOLIO] = portfolioHash
    const hash: string = qs.stringify(parsedParams, { skipNulls: true })
    Utils.setHashInUrl(hash)
    if (this.portfolio.urlHash !== null) {
      this.setButtonToShake()
    }
    this.portfolio.urlHash = Utils.getHashFromUrl(false)
  }

  setButtonToShake() {
    this.portfolio.shakeCopyToClipboardButton = true
    clearTimeout(this.SHAKE_BUTTON_TIMEOUT)

    this.SHAKE_BUTTON_TIMEOUT = setTimeout(() => {
      this.portfolio.shakeCopyToClipboardButton = false;
      this.emit('change')
    }, this.SECONDS_TO_SHAKE_BUTTON * 1000)
  }

  setPortfolioFromEncodedUrlParam(encodedPortfolio: ?string) {
    if (encodedPortfolio && encodedPortfolio.length > 0) {
      // If coins data is not available, trigger a fetch and wait until is available
      // We don't want to load the portfolio until coins data is not available
      const coinsData: CoinsData = this.getCoinsData()
      if (coinsData.data.length <= 0) {
        if (!this.portfolio.isUpdatingCoinsData) {
          this.fetchCoinsData().then(() => {
            this.setPortfolioFromEncodedUrlParam(encodedPortfolio)
          })
        } else {
          setTimeout(() => this.setPortfolioFromEncodedUrlParam(encodedPortfolio), 200)
        }
        return;
      }

      const codec: Codec = JsonUrl('lzstring')
      codec.decompress(encodedPortfolio).then((transactions) => {
        if (transactions && transactions.length > 0) {
          transactions.forEach(t => {
            const [coinId, units, initialPrice] = t
            const coin: ?Coin = coinsData.data.find(c => c.id === coinId)
            if (coin) {
              const transaction: Transaction = this.newTransaction({
                coin: {id: coinId, label: coin.name, symbol: coin.symbol},
                units, initialPrice, isValid: true, editMode: false, isNew: false,
                isCoinValid: true, isUnitsValid: true, isInitialPriceValid: true
              })
              this.portfolio.transactions.push(transaction)
              this.calculateTransactionValues(transaction)
            }
          })
          this.calculateTotalValues()
          this.emit('change')
          this.updateUrlHashForPortfolio()
        }
      })
    }
  }

  clearPortfolio() {
    const {
      transactions, totalInvested, currentTotalValue, totalMargin, totalProfit,
      secToNextUpdate, isAddNewTransactionModalOpen
    } = this.defaultPortfolio()
    this.portfolio = {
      ...this.portfolio,
      transactions,
      totalInvested, currentTotalValue, totalMargin, totalProfit,
      secToNextUpdate, isAddNewTransactionModalOpen
    }
    this.emit('change')
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
        this.updateUrlHashForPortfolio()
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
      inEditTransaction.isUnitsValid = Utils.isValidDecimal(units) && parseFloat(units) > 0
      this.calculateTransactionValues(inEditTransaction)
      this.emit('change')
    }
  }

  transactionInitialPriceChanged(price: string) {
    const inEditTransaction: ?Transaction = this.portfolio.transactions.find(t => t.editMode)

    if (inEditTransaction) {
      inEditTransaction.initialPrice = price
      inEditTransaction.isInitialPriceValid = Utils.isValidDecimal(price) && parseFloat(price) > 0
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

      if (isValid && transaction.currentPrice) {
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

  updateTransactionsCurrentPrices() {
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

  defaultPortfolio(): PortfolioState {
    return {
      transactions: [],
      totalInvested: 0,
      currentTotalValue: 0,
      totalMargin: 0,
      totalProfit: 0,
      secToNextUpdate: this.COINS_UPDATE_INTERVAL,
      isAddNewTransactionModalOpen: false,
      isUpdatingCoinsData: false,
      urlHash: null,
      shakeCopyToClipboardButton: false
    }
  }

  newTransaction(details?: Object): Transaction {
    return {
      coin: { id: '', label: '', symbol: '' },
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
      isInitialPriceTouched: false, isInitialPriceValid: false,
      ...details
    }
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
      case PortfolioActionsNames.SET_PORTFOLIO_FROM_ENCODED_URL_PARAM:
        this.setPortfolioFromEncodedUrlParam(action.data)
        break
      case PortfolioActionsNames.CLEAR_PORTFOLIO:
        this.clearPortfolio()
        break
      default:
        break
    }
  }
}

const portfolioStore = new PortfolioStore()
AppDispatcher.register(portfolioStore.handleActions.bind(portfolioStore))

export default portfolioStore
