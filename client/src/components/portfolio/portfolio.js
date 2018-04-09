// @flow
import React, { Component, Fragment } from 'react'
import moment from 'moment'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {Portfolio as State} from '../../flow-types/portfolio'
import Transaction from '../transaction/transaction'
import './portfolio.css'

export default class Portfolio extends Component<Props, State> {
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
    this.onAddNewTransaction = this.onAddNewTransaction.bind(this)
    this.onSaveNewTransaction = this.onSaveNewTransaction.bind(this)
    this.onCancelNewTransaction = this.onCancelNewTransaction.bind(this)
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

  onAddNewTransaction = (): void => {
    PortfolioActions.addNewTransaction()
  }

  onRemoveTransaction = (index: number): void => {
    PortfolioActions.removeTransaction(index)
  }

  onSaveNewTransaction = (): void => {
    PortfolioActions.saveNewTransaction()
  }

  onCancelNewTransaction = (): void => {
    PortfolioActions.cancelNewTransaction()
  }

  getTransactionsList = (): any => {
    const {transactions} = this.state

    if (transactions && transactions.length > 0) {
      return transactions.map((transaction, i) =>
        <Transaction
          key={i}
          remove={this.onRemoveTransaction.bind(this, i)}
          transaction={transaction}
          coins={this.state.coins}/>
      )
    }
    else {
      return (
        <tr>
          <td colSpan="8">
            <p className="has-text-centered is-italic has-text-grey">
            No transactions. Please add a transaction.
            </p>
          </td>
        </tr>
      )
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
    const isEditMode = this.state.transactions.findIndex((t) => t.editMode) > -1
    const nextUpdate = this.getNextUpdateRemainingTime()
    const updateButtonClass = `button is-primary ${isUpdatingCoinsData ? 'is-loading' : ''}`
    const transactionsList = this.getTransactionsList()
    const footerButtons = isEditMode ?
      <Fragment>
        <button
          className="button is-light"
          onClick={this.onCancelNewTransaction}>
          <i className="fa fa-cancel"></i>&nbsp;Cancel
        </button>
        <button
          className="button is-primary"
          onClick={this.onSaveNewTransaction}>
          <i className="fa fa-check"></i>&nbsp;Save
        </button>
      </Fragment>
    :
      <button
        className="button is-primary"
        onClick={this.onAddNewTransaction}>
        <i className="fa fa-plus"></i>&nbsp;Add new transaction
      </button>
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
              <th colSpan="3" className="has-text-centered">{footerButtons}</th>
              <th className="has-text-centered has-text-weight-semibold">Total:</th>
              <th className="has-text-centered has-text-weight-semibold">{totalInvested}</th>
              <th className="has-text-centered has-text-weight-semibold">{currentTotalValue}</th>
              <th className="has-text-centered has-text-weight-semibold">{totalProfit}</th>
              <th className="has-text-centered has-text-weight-semibold">{totalMargin}</th>
            </tr>
          </tfoot>
          <tbody>{transactionsList}</tbody>
        </table>

      </div>
    );
  }
}
