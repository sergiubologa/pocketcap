// @flow
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as PortfolioActionsNames} from '../actions/portfolio-actions'
import type {Portfolio, Transaction} from '../flow-types/portfolio'

class PortfolioStore extends EventEmitter {
  portfolio: Portfolio = {
    transactions: []
  }

  addTransaction(transaction: Transaction) {
    this.portfolio.transactions = this.portfolio.transactions.concat(transaction)
    this.emit('change')
  }

  removeTransaction(index) {
    this.portfolio.transactions = this.portfolio.transactions.filter((item, i) => i != index)
    this.emit('change')
  }

  getPortfolio(): Portfolio {
    return this.portfolio
  }

  handleActions(action) {
    switch (action.type) {
      case PortfolioActionsNames.ADD_TRANSACTION:
        this.addTransaction(action.data)
        break
      case PortfolioActionsNames.REMOVE_TRANSACTION:
        this.removeTransaction(action.data)
        break
      default:
        break
    }
  }
}

const portfolioStore = new PortfolioStore()
AppDispatcher.register(portfolioStore.handleActions.bind(portfolioStore))

export default portfolioStore
