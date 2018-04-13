// @flow
import React, {Component, Fragment} from 'react'
import PortfolioActions from '../../actions/portfolio-actions'
import PortfolioStore from '../../stores/portfolio-store'
import CoinsSelect from '../coins-select/coins-select'
import Textbox from '../textbox/textbox'
import * as Utils from '../../utils/utils'
import type {
  TransactionRowProps as Props,
  TransactionState as State} from '../../flow-types/portfolio'
import type {Coin, CoinsData} from '../../flow-types/coins'
import type {CoinSelectOption} from '../../flow-types/coins-select'
import './transaction.css'

export default class Transaction extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { coin: null, units: '', initialPrice: '', fieldToFocus: '' }
    this.onCoinChange = this.onCoinChange.bind(this)
    this.onUnitsChange = this.onUnitsChange.bind(this)
    this.onInitialPriceChange = this.onInitialPriceChange.bind(this)
    this.onCellClick = this.onCellClick.bind(this)
    this.onRemoveTransaction = this.onRemoveTransaction.bind(this)
  }

  onCoinChange = (selectedCoin: ?CoinSelectOption): void => {
    if (selectedCoin) {
      const {id: coinId} = selectedCoin
      PortfolioActions.transactionCoinChanged(coinId)

      const coins: CoinsData = PortfolioStore.getCoinsData()
      const newCoin: ?Coin = coins.data.find(c => c.id === coinId)
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

  onCellClick = (e: Event): void => {
    const {editMode} = this.props.transaction

    if (!editMode && e.target instanceof HTMLTableCellElement) {
      const field = e.target.attributes.getNamedItem('data-field').value
      PortfolioActions.editTransaction(this.props.index)
      this.setState({ fieldToFocus: field })
    }
  }

  onRemoveTransaction = (): void => {
    PortfolioActions.removeTransaction(this.props.index)
  }

  getCoinsDataForSelect = (): Array<CoinSelectOption> => {
    const coins: CoinsData = PortfolioStore.getCoinsData()
    return coins.data
      .map((coin: Coin) => ({
        id: coin.id,
        label: `${coin.name} (${coin.symbol})`,
        symbol: coin.symbol
      }))
  }

  render() {
    const {
      transaction: {
        symbol, coinName, units, initialPrice, currentPrice, totalInvested,
        currentValue, margin, profit, editMode,
        isCoinValid, isUnitsValid, isInitialPriceValid
      }
    } = this.props
    const {fieldToFocus} = this.state

    return (
      <tr className="trTransaction">
        <td
          className={editMode ? '' : 'editable'}
          onClick={this.onCellClick}
          data-field="coin"
          width="300">
          { editMode ? (
            <CoinsSelect
              clearable={false}
              autoFocus={fieldToFocus === 'coin'}
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
                onClick={this.onRemoveTransaction}>
                <span className="icon is-small"><i className="fa fa-minus"></i></span>
              </button>
              <i className={`cc defaultCoinIcon ${symbol}`}></i> {coinName}
            </Fragment>
          )}
        </td>
        <td
          className={`has-text-centered ${editMode ? '' : 'editable'}`}
          onClick={this.onCellClick}
          data-field="units">
          { editMode ? (
            <Textbox
              value={this.state.units}
              isValid={isUnitsValid}
              autoFocus={fieldToFocus === 'units'}
              onChange={this.onUnitsChange} />
          ) : (
            <Fragment>{units}</Fragment>
          )}
        </td>
        <td
          className={`has-text-centered ${editMode ? '' : 'editable'}`}
          onClick={this.onCellClick}
          data-field="initial-price">
          { editMode ? (
            <Textbox
              value={this.state.initialPrice}
              isValid={isInitialPriceValid}
              autoFocus={fieldToFocus === 'initial-price'}
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
