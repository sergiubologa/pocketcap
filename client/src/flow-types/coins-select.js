// @flow
import * as React from 'react'

export type CoinsSelectProps = {
  coins: Array<CoinSelectOption>,
  clearable?: boolean,
  searchable?: boolean,
  autoFocus?: boolean,
  onChange?: (selectedCoin: ?CoinSelectOption) => void,
  onBlur?: () => void,
  onOpen?: () => void,
  onClose?: () => void,
  value: ?CoinSelectOption,
  placeholder?: React.Node,
  icon?: React.Node,
  isValid?: boolean,
  className?: string
}

export type CoinSelectOption = {
  id: string,
  label: string,
  symbol: string
}
