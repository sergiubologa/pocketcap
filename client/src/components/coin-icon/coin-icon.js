// @flow
import React from 'react'
import './coin-icon.css'
type Props = {
  symbol: string,
  showDefault?: boolean
}

const CoinIcon = (props: Props) => {
  const {symbol, showDefault = true} = props
  const classes = ['cc']

  if (showDefault) {
    classes.push('defaultCoinIcon')
  }
  classes.push(symbol)

  return (
    <i className={classes.join(' ')}></i>
  )
}

export default CoinIcon
