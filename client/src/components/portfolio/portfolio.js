// @flow
import React, { Component } from 'react'
import qs from 'qs'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import * as Utils from '../../utils/utils'
import AnimatedStyledNumber from '../elements/animated-styled-number/animated-styled-number'
import TrendIcon from '../elements/trend-icon/trend-icon'
import NoTransactions from './components/no-transactions/no-transactions'
import Transaction from './components/transaction/transaction'
import Toolbar from './components/toolbar/toolbar'
import {URL_PARAM_NAMES} from '../../constants/common'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {PortfolioState as State} from '../../flow-types/portfolio'
import './portfolio.css'

export default class Portfolio extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      ...PortfolioStore.getPortfolio()
    }
    this.updateStateData = this.updateStateData.bind(this)
    this.onAddNewTransaction = this.onAddNewTransaction.bind(this)
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
    PortfolioStore.removeListener('change', this.updateStateData)
    PortfolioActions.clearPortfolio()
  }

  componentDidMount() {
    PortfolioActions.fetchCoinsData()
  }

  updateStateData = (): void => {
    this.setState(PortfolioStore.getPortfolio())
  }

  onAddNewTransaction = (): void => {
    PortfolioActions.addNewTransaction()
  }

  render() {
    const {
      totalInvested, currentTotalValue, totalMargin, totalProfit,
      transactions
    } = this.state
    const displayTotalInvested = Utils.toDecimals(totalInvested)
    const displayCurrentTotalValue = Utils.toDecimals(currentTotalValue)
    const displayTotalMargin = Utils.toDecimals(totalMargin)
    const displayTotalProfit = Utils.toDecimals(totalProfit)
    const inEditTransaction = this.state.transactions.find((t) => t.editMode)
    const isEditMode = !!inEditTransaction
    const hasTransactions = transactions && transactions.length > 0

    return (
      <div className="portfolio">

        {hasTransactions && <Toolbar />}

        {hasTransactions && (
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
            <tbody>
              {transactions.map((transaction, i) =>
                <Transaction
                  key={i}
                  index={i}
                  transaction={transaction}/>
              )}
            </tbody>
          </table>
        )}

        {!hasTransactions &&
          <NoTransactions onAddNewTransaction={this.onAddNewTransaction} />
        }

      </div>
    )
  }
}
