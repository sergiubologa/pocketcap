// @flow
import React, {Component, Fragment} from 'react'
import PortfolioActions from '../../actions/portfolio-actions'
import CoinsSelect from '../coins-select/coins-select'
import Textbox from '../textbox/textbox'
import * as Utils from '../../utils/utils'
import type {TransactionRowProps as Props} from '../../flow-types/portfolio'
import type {PortfolioState as State} from '../../flow-types/portfolio'
import type {Coin} from '../../flow-types/coins'
import type {CoinSelectOption} from '../../flow-types/coins-select'
import './transaction.css'

export default class Transaction extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { coin: null, units: '', initialPrice: '' }
    this.onCoinChange = this.onCoinChange.bind(this)
    this.onUnitsChange = this.onUnitsChange.bind(this)
    this.onInitialPriceChange = this.onInitialPriceChange.bind(this)
  }

  getCoinsDataForSelect = (): Array<CoinSelectOption> => {
    return this.props.coins.data
      .map((coin: Coin) => ({
        id: coin.id,
        label: `${coin.name} (${coin.symbol})`,
        symbol: coin.symbol
      }))
  }

  onCoinChange = (selectedCoin: ?CoinSelectOption): void => {
    if (selectedCoin) {
      const {id: coinId} = selectedCoin
      PortfolioActions.transactionCoinChanged(coinId)
      const newCoin: ?Coin = this.props.coins.data.find(c => c.id === coinId)
      if (newCoin) {
        this.setState({coin: selectedCoin})
      }
    } else {
      PortfolioActions.transactionCoinChanged(null)
      this.setState({coin: null})
    }
  }

  onUnitsChange = (units: string): void => {
    PortfolioActions.transactionUnitsChanged(units)
    this.setState({units})
  }

  onInitialPriceChange = (initialPrice: string): void => {
    PortfolioActions.transactionInitialPriceChanged(initialPrice)
    this.setState({initialPrice})
  }

  render() {
    const {
      remove,
      transaction: {
        symbol, coinName, units, initialPrice, currentPrice, totalInvested,
        currentValue, margin, profit, editMode,
        isCoinValid, isUnitsValid, isInitialPriceValid
      }
    } = this.props

    return (
      <tr>
        <td width="300">
          { editMode ? (
            <CoinsSelect
              clearable={false}
              isValid={isCoinValid}
    					onChange={this.onCoinChange}
    					coins={this.getCoinsDataForSelect()}
    					value={this.state.coin}
              placeholder=""
              icon={<i className={`fa fa-${isCoinValid ? 'check' : 'ban'}`}></i>} />
          ) : (
            <Fragment>
              <button
                className="btnRemoveTransaction button is-small is-danger is-outlined"
                onClick={remove}>
                <span className="icon is-small"><i className="fa fa-minus"></i></span>
              </button>
              <i className={`cc defaultCoinIcon ${symbol}`}></i> {coinName}
            </Fragment>
          )}
        </td>
        <td className="has-text-centered">
          { editMode ? (
            <Textbox
              value={this.state.units}
              isValid={isUnitsValid}
              onChange={this.onUnitsChange} />
          ) : (
            <Fragment>{units}</Fragment>
          )}
        </td>
        <td className="has-text-centered">
          { editMode ? (
            <Textbox
              value={this.state.initialPrice}
              isValid={isInitialPriceValid}
              onChange={this.onInitialPriceChange} />
          ) : (
            <Fragment>{initialPrice}</Fragment>
          )}
        </td>
        <td className="has-text-centered">{Utils.toDecimals(currentPrice, 6)}</td>
        <td className="has-text-centered">{Utils.toDecimals(totalInvested)}</td>
        <td className="has-text-centered">{Utils.toDecimals(currentValue)}</td>
        <td className="has-text-centered">{Utils.toDecimals(margin)}</td>
        <td className="has-text-centered">{Utils.toDecimals(profit)}</td>
      </tr>
    )
  }
}
