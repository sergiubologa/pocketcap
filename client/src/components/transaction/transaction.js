// @flow
import React, {Component, Fragment} from 'react'
import PortfolioActions from '../../actions/portfolio-actions'
import CoinsSelect from '../coins-select/coins-select'
import type {TransactionRowProps as Props} from '../../flow-types/portfolio'
import type {PortfolioState as State} from '../../flow-types/portfolio'
import type {Coin} from '../../flow-types/coins'
import type {CoinSelectOption} from '../../flow-types/coins-select'
import './transaction.css'

export default class Transaction extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { coin: null, units: null, initialPrice: null }
    this.onCoinChange = this.onCoinChange.bind(this)
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
      PortfolioActions.inEditTransactionCoinChanged(coinId)
      const newCoin: ?Coin = this.props.coins.data.find(c => c.id === coinId)
      if (newCoin) {
        this.setState({coin: selectedCoin})
      }
    } else {
      PortfolioActions.inEditTransactionCoinChanged(null)
      this.setState({coin: null})
    }
  }

  render() {
    const {
      remove,
      transaction: {
        coinId, coinName, units, initialPrice, currentPrice, totalInvested,
        currentValue, margin, profit, editMode
      }
    } = this.props
    return (
      <tr>
        <td width="300">
          { editMode ? (
            <CoinsSelect
    					onChange={this.onCoinChange}
    					coins={this.getCoinsDataForSelect()}
    					value={this.state.coin} />
          ) : (
            <Fragment>
              <button
                className="btnRemoveTransaction button is-small is-danger is-outlined"
                onClick={remove}>
                <span className="icon is-small"><i className="fa fa-minus"></i></span>
              </button>
              <i className={`cc defaultCoinIcon ${coinId}`}></i> {coinName}
            </Fragment>
          )}
        </td>
        <td className="has-text-centered">
          { editMode ? (
            <input type="text" className="input" />
          ) : (
            <Fragment>{units}</Fragment>
          )}
        </td>
        <td className="has-text-centered">
          { editMode ? (
            <input type="text" className="input" />
          ) : (
            <Fragment>{initialPrice}</Fragment>
          )}
        </td>
        <td className="has-text-centered">{currentPrice}</td>
        <td className="has-text-centered">{totalInvested}</td>
        <td className="has-text-centered">{currentValue}</td>
        <td className="has-text-centered">{margin}</td>
        <td className="has-text-centered">{profit}</td>
      </tr>
    )
  }
}
