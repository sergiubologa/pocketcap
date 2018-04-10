// @flow
import * as React from 'react'

export type CoinsSelectProps = {
  coins: Array<CoinSelectOption>,
  clearable?: boolean,
  searchable?: boolean,
  onChange?: (selectedCoin: ?CoinSelectOption) => void,
  placeholder?: React.Node,
  value: ?CoinSelectOption
}

export type CoinSelectOption = {
  id: string,
  label: string,
  symbol: string
}
