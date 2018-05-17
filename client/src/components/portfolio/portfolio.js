// @flow
import React, { Component } from 'react'
import moment from 'moment'
import qs from 'qs'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faLink from '@fortawesome/fontawesome-free-solid/faLink'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import * as Utils from '../../utils/utils'
import AnimatedStyledNumber from '../animated-styled-number/animated-styled-number'
import TrendIcon from '../trend-icon/trend-icon'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {PortfolioState as State} from '../../flow-types/portfolio'
import Transaction from '../transaction/transaction'
import AnimatedCheckIcon from '../animated-check-icon/animated-check-icon'
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
    this.onCopyUrlToClipboard = this.onCopyUrlToClipboard.bind(this)
  }

  componentWillMount() {
    PortfolioStore.on('change', this.updateStateData)
    const urlParams: Object = qs.parse(Utils.getHashFromUrl())
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

    return ""
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
            No transactions yet.<br />Add some transactions to track your profit.
            <br/><br/>
            <button
              className="btn-add-new-transaction button is-primary"
              onClick={this.onAddNewTransaction}>
              <FontAwesomeIcon icon={faPlus} />&nbsp;Add my first transaction
            </button>
            </p>
          </td>
        </tr>
      )
    }
  }

  render() {
    const {
      isUpdatingCoinsData, isRefreshButtonDisabled, urlCopiedToClipboard,
      totalInvested, currentTotalValue, totalMargin, totalProfit,
      transactions, shakeCopyToClipboardButton
    } = this.state
    const displayTotalInvested = Utils.toDecimals(totalInvested)
    const displayCurrentTotalValue = Utils.toDecimals(currentTotalValue)
    const displayTotalMargin = Utils.toDecimals(totalMargin)
    const displayTotalProfit = Utils.toDecimals(totalProfit)
    const inEditTransaction = this.state.transactions.find((t) => t.editMode)
    const isEditMode = !!inEditTransaction
    const nextUpdate = this.getNextUpdateRemainingTime()
    const hasTransactions = transactions && transactions.length > 0
    const updateButtonClass = `button is-info is-outlined ${isUpdatingCoinsData ? 'is-loading' : ''}`

    return (
      <div className="portfolio">

        {hasTransactions && (
          <div className="card portfolio-actions has-background-white-bis">
            <div className="card-content">
              <div className="columns is-vcentered">
                <div className="column has-text-info" id="nextRefreshContainer">
                  <div className="refreshMessage">Prices update in:</div>
                  <div className="refreshButtonContainer">
                    <button
                      disabled={isRefreshButtonDisabled}
                      onClick={this.onRefreshBtnClick}
                      className={updateButtonClass}>{nextUpdate}
                    </button>
                  </div>
                </div>
                <div className="column has-text-right">
                  <CopyToClipboard
                    onCopy={this.onCopyUrlToClipboard}
                    text={window.location.href}>
                    <a className={`button is-info btnCopyToClipboard
                      ${urlCopiedToClipboard ? 'copied' : ''}
                      ${shakeCopyToClipboardButton ? 'shake-it' : ''}`}>
                      <span>Get bookmarkable link</span>
                      <span>Copied to clipboard!</span>
                      <span className="icon">
                        {
                          urlCopiedToClipboard
                            ? <AnimatedCheckIcon />
                            : <FontAwesomeIcon icon={faLink} />
                        }
                      </span>
                    </a>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className={`table is-fullwidth ${isEditMode ? 'is-edit-mode' : 'is-hoverable'}`}>
          <thead className="has-background-light">
            <tr>
              <th style={{width: "25%"}} className="coin has-text-weight-bold">Coin / Token</th>
              <th style={{width: "15%"}} className="has-text-right has-text-weight-bold">Units</th>
              <th style={{width: "12%"}} className="has-text-right has-text-weight-bold">
                Initial Price<br/>
                <span className="is-size-7 has-text-weight-light">(per unit)</span>
              </th>
              <th style={{width: "12%"}} className="has-text-right has-text-weight-bold">
                Current Price<br/>
                <span className="is-size-7 has-text-weight-light">(per unit)</span>
              </th>
              <th style={{width: "12%"}} className="has-text-right has-text-weight-bold">Total invested</th>
              <th style={{width: "12%"}} className="has-text-right has-text-weight-bold">Current value</th>
              <th style={{width: "12%"}} className="has-text-right has-text-weight-bold">Profit</th>
            </tr>
          </thead>
          {hasTransactions && (
            <tfoot>
              <tr>
                <th colSpan="3" className="has-text-centered">
                  <button
                    className="btn-add-new-transaction button is-primary"
                    onClick={this.onAddNewTransaction}>
                    <FontAwesomeIcon icon={faPlus} />&nbsp;Add new transaction
                  </button>
                </th>
                <th className="has-text-right has-text-weight-semibold is-size-4">Total:</th>
                <th className="has-text-right has-text-weight-semibold has-background-light">
                  $<AnimatedStyledNumber value={displayTotalInvested} />
                </th>
                <th className="has-text-right has-text-weight-semibold has-background-light">
                  $<AnimatedStyledNumber value={displayCurrentTotalValue} />
                </th>
                <th className={`has-text-right has-text-weight-semibold has-background-light ${Utils.colorClassForNumbers(displayTotalProfit)}`}>
                  $<AnimatedStyledNumber value={displayTotalProfit} /><br/>
                  <TrendIcon value={displayTotalProfit} />&nbsp;
                  <span className="is-size-7">
                    <AnimatedStyledNumber value={displayTotalMargin} />%
                  </span>
                </th>
              </tr>
            </tfoot>
          )}
          <tbody>{this.getTransactionsList()}</tbody>
        </table>

      </div>
    )
  }
}
