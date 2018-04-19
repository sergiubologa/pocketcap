// @flow
import React, { Component, Fragment } from 'react'
import moment from 'moment'
import qs from 'qs'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {PortfolioState as State} from '../../flow-types/portfolio'
import Transaction from '../transaction/transaction'
import * as Utils from '../../utils/utils'
import {URL_PARAM_NAMES} from '../../constants/common'
import './portfolio.css'

export default class Portfolio extends Component<Props, State> {
  countdownInterval: IntervalID
  enableRefreshBtnTimer: TimeoutID
  resetClipboardButtonTimer: TimeoutID

  constructor(props: Props) {
    super(props)
    this.state = {
      ...PortfolioStore.getPortfolio(),
      isRefreshButtonDisabled: false,
      urlCopiedToClipboard: false
    }
    this.updateStateData = this.updateStateData.bind(this)
    this.openAddNewTransactionModal = this.openAddNewTransactionModal.bind(this)
    this.startCountDown = this.startCountDown.bind(this)
    this.getNextUpdateRemainingTime = this.getNextUpdateRemainingTime.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)
    this.refreshCoinsData = this.refreshCoinsData.bind(this)
    this.onRefreshBtnClick = this.onRefreshBtnClick.bind(this)
    this.onAddNewTransaction = this.onAddNewTransaction.bind(this)
    this.onSaveTransaction = this.onSaveTransaction.bind(this)
    this.onCancelTransaction = this.onCancelTransaction.bind(this)
    this.onCopyUrlToClipboard = this.onCopyUrlToClipboard.bind(this)
  }

  componentWillMount() {
    PortfolioStore.on('change', this.updateStateData)
    const urlParams: Object = qs.parse(Utils.getUrlHash())
    if (urlParams) {
      const portfolio: ?string = urlParams[URL_PARAM_NAMES.PORTFOLIO]
      PortfolioActions.setPortfolioFromEncodedUrlParam(portfolio)
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval)
    clearTimeout(this.enableRefreshBtnTimer)
    clearTimeout(this.resetClipboardButtonTimer)
    PortfolioStore.removeListener('change', this.updateStateData)
    PortfolioActions.clearPortfolio()
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

  onSaveTransaction = (): void => {
    PortfolioActions.saveTransaction()
  }

  onCancelTransaction = (): void => {
    PortfolioActions.cancelTransaction()
  }

  onCopyUrlToClipboard = (): void => {
    this.setState({urlCopiedToClipboard: true})
    const resetButtonSeconds: number = 5
    clearTimeout(this.resetClipboardButtonTimer)
    this.resetClipboardButtonTimer = setTimeout(() => {
      this.setState({urlCopiedToClipboard: false})
    }, resetButtonSeconds * 1000)
  }

  getTransactionsList = (): any => {
    const {transactions} = this.state

    if (transactions && transactions.length > 0) {
      return transactions.map((transaction, i) =>
        <Transaction
          key={i}
          index={i}
          transaction={transaction}/>
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
      isUpdatingCoinsData, isRefreshButtonDisabled, urlCopiedToClipboard,
      totalInvested, currentTotalValue, totalMargin, totalProfit
    } = this.state
    const inEditTransaction = this.state.transactions.find((t) => t.editMode)
    const isEditMode = !!inEditTransaction
    let isSaveEnabled = false
    if (inEditTransaction) {
      const {isCoinValid, isUnitsValid, isInitialPriceValid} = inEditTransaction
      isSaveEnabled = isCoinValid && isUnitsValid && isInitialPriceValid
    }
    const nextUpdate = this.getNextUpdateRemainingTime()
    const updateButtonClass = `button is-info is-outlined is-small ${isUpdatingCoinsData ? 'is-loading' : ''}`
    const footerButtons = isEditMode ?
      <Fragment>
        <button
          className="button is-light"
          onClick={this.onCancelTransaction}>
          <i className="fa fa-cancel"></i>&nbsp;Cancel
        </button>
        <button
          className="button is-primary"
          onClick={this.onSaveTransaction}
          disabled={!isSaveEnabled}>
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

        <div className="columns is-vcentered is-marginless has-background-light">
          <div className="column has-text-info">
            Prices update in: <button
              disabled={isRefreshButtonDisabled}
              onClick={this.onRefreshBtnClick}
              className={updateButtonClass}>{nextUpdate}
            </button>
          </div>
          <div className="column has-text-right">
            <CopyToClipboard
              onCopy={this.onCopyUrlToClipboard}
              text={window.location.href}>
              <a className="button is-info is-outlined is-small">
                <span>{urlCopiedToClipboard ? 'Copied to clipboard!' : 'Get sharable link'}</span>
                <span className="icon">
                  <i className={'fa fa-' + (urlCopiedToClipboard ? 'check' : 'link')}></i>
                </span>
              </a>
            </CopyToClipboard>
          </div>
        </div>

        <table className="table is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th className="has-text-weight-bold">Coin / Token</th>
              <th className="has-text-centered has-text-weight-bold">Units</th>
              <th className="has-text-centered has-text-weight-bold">
                Initial Price<br/>
                <span className="is-size-7 has-text-weight-light">(per unit)</span>
              </th>
              <th className="has-text-centered has-text-weight-bold">
                Current Price<br/>
                <span className="is-size-7 has-text-weight-light">(per unit)</span>
              </th>
              <th className="has-text-centered has-text-weight-bold">Total invested</th>
              <th className="has-text-centered has-text-weight-bold">Current value</th>
              <th className="has-text-centered has-text-weight-bold">Profit</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th colSpan="3" className="has-text-centered">{footerButtons}</th>
              <th className="has-text-centered has-text-weight-semibold is-size-4">Total:</th>
              <th className="has-text-centered has-text-weight-semibold has-background-light">${Utils.toDecimals(totalInvested)}</th>
              <th className="has-text-centered has-text-weight-semibold has-background-light">${Utils.toDecimals(currentTotalValue)}</th>
              <th className="has-text-centered has-text-weight-semibold has-background-light">
                ${Utils.toDecimals(totalProfit)}<br/>
                <span className="is-size-7">{Utils.toDecimals(totalMargin)}%</span>
              </th>
            </tr>
          </tfoot>
          <tbody>{this.getTransactionsList()}</tbody>
        </table>

      </div>
    )
  }
}
