// @flow
import React, { Component } from 'react'
import moment from 'moment'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {Portfolio as State} from '../../flow-types/portfolio'
import './portfolio.css'

class Portfolio extends Component<Props, State> {
  countdownInterval: IntervalID
  enableRefreshBtnTimer: TimeoutID

  constructor(props: Props) {
    super(props)
    this.state = {
      ...PortfolioStore.getPortfolio(),
      isRefreshButtonDisabled: false
    }
    this.updateStateData = this.updateStateData.bind(this)
    this.openAddNewTransactionModal = this.openAddNewTransactionModal.bind(this)
    this.startCountDown = this.startCountDown.bind(this)
    this.getNextUpdateRemainingTime = this.getNextUpdateRemainingTime.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)
    this.refreshCoinsData = this.refreshCoinsData.bind(this)
    this.onRefreshBtnClick = this.onRefreshBtnClick.bind(this)
  }

  componentWillMount() {
    PortfolioStore.on('change', this.updateStateData)
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval)
    clearTimeout(this.enableRefreshBtnTimer)
    PortfolioStore.removeListener('change', this.updateStateData)
  }

  componentDidMount() {
    this.refreshCoinsData()
    this.startCountDown()
  }

  updateStateData = (): void => {
    this.setState(PortfolioStore.getPortfolio())
  }

  refreshCoinsData = (): void => {
    PortfolioActions.fetchCoinsData()
  }

  openAddNewTransactionModal = (): void => {
    if (!this.state.isAddNewTransactionModalOpen) {
      PortfolioActions.toggleAddNewTransactionModal()
    }
  }

  onRefreshBtnClick = (): void => {
    this.refreshCoinsData()
    this.setState({isRefreshButtonDisabled: true})
    const disableRefreshButtnInterval = 30 * 1000 // 30 sec
    this.enableRefreshBtnTimer = setTimeout(() => {
      this.setState({isRefreshButtonDisabled: false})
    }, disableRefreshButtnInterval)
  }

  startCountDown = (): void => {
    this.countdownInterval = setInterval(PortfolioActions.decrementCountdown, 1000)
  }

  getNextUpdateRemainingTime = (): any => {
    if (this.state.secToNextUpdate > 0) {
      const duration = moment.duration(this.state.secToNextUpdate, 'seconds')
      const mins = this.addLeadingZero(duration.minutes())
      const sec = this.addLeadingZero(duration.seconds())
      return `${mins}:${sec}`
    }

    return <span className="fa fa-spinner fa-pulse"></span>
  }

  addLeadingZero = (val: number): string => {
    if (val && val.toString().length > 0) {
      if (val.toString().length === 1) return `0${val}`
      return val.toString()
    }

    return '00'
  }

  getTransactionsList = (): any => {
    const {transactions} = this.state

    if (transactions && transactions.length > 0) {
      return transactions.map((transaction, i) =>
        <tr key={i}>
          <td>
            <button className="btnRemoveTransaction button is-small is-danger is-outlined">
              <span className="icon is-small"><i className="fa fa-minus"></i></span>
            </button>
            <i className={`cc defaultCoinIcon ${transaction.coinId}`}></i> {transaction.coinName}
          </td>
          <td className="has-text-centered">{transaction.units}</td>
          <td className="has-text-centered">{transaction.initialPrice}</td>
          <td className="has-text-centered">{transaction.currentPrice}</td>
          <td className="has-text-centered">{transaction.totalInvested}</td>
          <td className="has-text-centered">{transaction.currentValue}</td>
          <td className="has-text-centered">{transaction.margin}</td>
          <td className="has-text-centered">{transaction.profit}</td>
        </tr>
      )
    }
    else {
      return <p className="has-text-centered is-italic has-text-grey">No transactions. Please add a treansaction.</p>
    }
  }

  render() {
    const {
      isUpdatingCoinsData,
      isRefreshButtonDisabled,
      totalInvested,
      currentTotalValue,
      totalMargin,
      totalProfit
    } = this.state
    const nextUpdate = this.getNextUpdateRemainingTime()
    const updateButtonClass = `button is-primary ${isUpdatingCoinsData ? 'is-loading' : ''}`
    const transactionsList = this.getTransactionsList()
    return (
      <div className="portfolio">

        <div className="columns">
          <div className="column">
            Next update: <button disabled={isRefreshButtonDisabled} onClick={this.onRefreshBtnClick} className={updateButtonClass}>{nextUpdate}</button>
          </div>
          <div className="column has-text-right">
            <a href="/">Share view</a>
          </div>
        </div>

        <table className="table is-bordered is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th className="has-text-centered has-text-weight-bold">Coin</th>
              <th className="has-text-centered has-text-weight-bold">Units</th>
              <th className="has-text-centered has-text-weight-bold">Initial Price / unit</th>
              <th className="has-text-centered has-text-weight-bold">Current Price / unit</th>
              <th className="has-text-centered has-text-weight-bold">Total invested</th>
              <th className="has-text-centered has-text-weight-bold">Current value</th>
              <th className="has-text-centered has-text-weight-bold"> Profit margin (%)</th>
              <th className="has-text-centered has-text-weight-bold">Profit</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th colSpan="3" className="has-text-centered">
                <button className="button is-primary">
                  <i className="fa fa-plus"></i> &nbsp; Add new transaction
                </button>
              </th>
              <th className="has-text-centered has-text-weight-semibold">Total:</th>
              <th className="has-text-centered has-text-weight-semibold">{totalInvested}</th>
              <th className="has-text-centered has-text-weight-semibold">{currentTotalValue}</th>
              <th className="has-text-centered has-text-weight-semibold">{totalProfit}</th>
              <th className="has-text-centered has-text-weight-semibold">{totalMargin}</th>
            </tr>
          </tfoot>
          <tbody>
            {transactionsList}
          </tbody>
        </table>

      </div>
    );
  }
}

export default Portfolio
