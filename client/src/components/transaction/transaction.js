// @flow
import React, {Component, Fragment} from 'react'
import Select from "react-virtualized-select"
import 'react-select/dist/react-select.css'
import "react-virtualized/styles.css"
import "react-virtualized-select/styles.css"
import type {TransactionRowProps as Props} from '../../flow-types/portfolio'
import type {Coin} from '../../flow-types/coins'
import type {SelectOption} from '../../flow-types/select-options'
import PortfolioActions from '../../actions/portfolio-actions'
import './transaction.css'

type State = {
  coin: ?SelectOption,
  units: ?number,
  initialPrice: ?number
}

export default class Transaction extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { coin: null, units: null, initialPrice: null }

    this.onCoinChange = this.onCoinChange.bind(this)
  }

  getCoinsDataForSelect = (): Array<SelectOption> => {
    return this.props.coins.data
      .map((coin: Coin) => ({
        id: coin.id,
        label: `${coin.name} (${coin.symbol})`,
        symbol: coin.symbol
      }))
  }

  onCoinChange = (selectedCoin: ?SelectOption): void => {
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

  coinOptionRenderer = ({
    focusedOption, focusedOptionIndex, focusOption, key, labelKey,
    option, options, selectValue, style, valueArray, valueKey }: any) => {

    const classNames = ['coinOption']

    if (option === focusedOption) {
      classNames.push('coinOptionFocused')
    }
    if (valueArray.find((val) => val.id === option.id)) {
      classNames.push('coinOptionSelected')
    }

    return (
      <div
        key={key}
        className={classNames.join(' ')}
        onClick={() => selectValue(option)}
        onMouseEnter={() => focusOption(option)}
        style={style}
      >
        <i className={`cc defaultCoinIcon ${option.symbol.toUpperCase()}`}></i>
        <label>{option.label}</label>
      </div>
    )
  }

  coinValueRenderer = ({value: coin, children}: any) => {
    return (
      <div className="Select-value" title={coin.id}>
				<span className="Select-value-label">
					<i className={`cc defaultCoinIcon ${coin.symbol.toUpperCase()}`}></i>
					{children}
				</span>
			</div>
    )
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
            <Select
              clearable
              searchable
    					onChange={this.onCoinChange}
    					options={this.getCoinsDataForSelect()}
    					placeholder={<span>&#9786; Select Coin</span>}
    					value={this.state.coin}
    					valueComponent={this.coinValueRenderer}
              optionRenderer={this.coinOptionRenderer}
              valueKey="id"
              labelKey="label"
    					/>
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
