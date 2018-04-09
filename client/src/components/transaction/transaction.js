// @flow
import React, {Component, Fragment} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import type {TransactionRowProps as Props} from '../../flow-types/portfolio'
import type {Coin} from '../../flow-types/coins'
import type {SelectOption} from '../../flow-types/select-options'
import PortfolioActions from '../../actions/portfolio-actions'

type State = {
  coin: string,
  units: ?number,
  initialPrice: ?number
}

export default class Transaction extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { coin: '', units: null, initialPrice: null }

    this.onCoinChange = this.onCoinChange.bind(this)
  }

  getCoinsDataForSelect = (): Array<SelectOption> => {
    return this.props.coins.data
      .map((coin: Coin) => ({value: coin.id, label: `${coin.name} (${coin.symbol})`}))
  }

  onCoinChange = ({value: coinId}: SelectOption): void => {
    PortfolioActions.inEditTransactionCoinChanged(coinId)
    const newCoin: ?Coin = this.props.coins.data.find(c => c.id === coinId)
    if (newCoin) {
      this.setState({coin: newCoin.name})
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
            <Select
    					arrowRenderer={() => <span>+</span>}
    					onChange={this.onCoinChange}
    					//optionComponent={GravatarOption}
    					options={this.getCoinsDataForSelect()}
    					//placeholder={placeholder}
    					value={this.state.coin}
    					//valueComponent={GravatarValue}
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
