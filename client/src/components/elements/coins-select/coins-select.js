// @flow
import React, {Component} from 'react'
import Select from 'react-virtualized-select'
import CoinIcon from '../coin-icon/coin-icon'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import type {
  CoinsSelectProps as Props,
  CoinsSelectState as State
} from '../../../flow-types/coins-select'
import type {CoinSelectOption} from '../../../flow-types/coins-select'
import './coins-select.css'

export default class CoinsSelect extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {isTouched: false}
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onChange = (selectedCoin: ?CoinSelectOption): void => {
    if (this.props.onChange) {
      this.props.onChange.call(null, selectedCoin)
    }
    if (!this.state.isTouched) {
      this.setState({isTouched: true})
    }
  }

  onBlur = (): void => {
    if (this.props.onBlur) {
      this.props.onBlur.call(null)
    }
    if (!this.state.isTouched) {
      this.setState({isTouched: true})
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
        <CoinIcon symbol={option.symbol.toUpperCase()} />
        <label>{option.label}</label>
      </div>
    )
  }

  coinValueRenderer = ({value: coin, children}: any) => {
    return (
      <div className="Select-value">
				<span className="Select-value-label">
          <CoinIcon symbol={coin.symbol.toUpperCase()} />
					{children}
				</span>
			</div>
    )
  }

  render() {
    const {
      coins, clearable, searchable, autoFocus, onOpen, onClose,
      value, placeholder, icon, isValid, className = ''
    } = this.props
    const {isTouched} = this.state
    const selectClass = !isTouched ? '' : isValid ? 'is-valid' : 'not-valid'
    return (
      <Select
        className={`${className} ${selectClass}`}
        clearable={clearable}
        clearValueText="Clear selected coin"
        searchable={searchable}
        autoFocus={autoFocus}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onOpen={onOpen}
        onClose={onClose}
        options={coins}
        placeholder={placeholder}
        value={value}
        valueComponent={this.coinValueRenderer}
        optionRenderer={this.coinOptionRenderer}
        valueKey="id"
        labelKey="label"
        openOnFocus={false}
        arrowRenderer={isTouched ? () => icon : undefined}
        />
    )
  }
}
