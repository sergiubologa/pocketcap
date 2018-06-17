// @flow
import React, {PureComponent} from 'react'
import type {State} from '../../../flow-types/react-generic'
import './coin-icon.css'
type Props = {
  symbol: string,
  showDefault?: boolean
}

export default class CoinIcon extends PureComponent<Props, State> {
  render() {
    const {symbol, showDefault = true} = this.props
    const classes = ['cc']

    if (showDefault) {
      classes.push('defaultCoinIcon')
    }
    classes.push(symbol)

    return (
      <i className={classes.join(' ')}></i>
    )
  }
}
