// @flow
import React, {Component} from 'react'
import type {State} from '../../flow-types/react-generic'
import type {TransactionRowProps as Props} from '../../flow-types/portfolio'

export default class Transaction extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const {
      remove,
      data: {
        coinId, coinName, units, initialPrice, currentPrice, totalInvested,
        currentValue, margin, profit
      }
    } = this.props
    return (
      <tr>
        <td>
          <button
            className="btnRemoveTransaction button is-small is-danger is-outlined"
            onClick={remove}
          >
            <span className="icon is-small"><i className="fa fa-minus"></i></span>
          </button>
          <i className={`cc defaultCoinIcon ${coinId}`}></i> {coinName}
        </td>
        <td className="has-text-centered">{units}</td>
        <td className="has-text-centered">{initialPrice}</td>
        <td className="has-text-centered">{currentPrice}</td>
        <td className="has-text-centered">{totalInvested}</td>
        <td className="has-text-centered">{currentValue}</td>
        <td className="has-text-centered">{margin}</td>
        <td className="has-text-centered">{profit}</td>
      </tr>
    )
  }
}
