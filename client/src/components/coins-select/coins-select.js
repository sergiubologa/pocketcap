// @flow
import React, {Component} from 'react'
import Select from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import type {CoinsSelectProps as Props} from '../../flow-types/coins-select'
import type {State} from '../../flow-types/react-generic'
import './coins-select.css'

export default class CoinsSelect extends Component<Props, State> {
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
      <div className="Select-value">
				<span className="Select-value-label">
					<i className={`cc defaultCoinIcon ${coin.symbol.toUpperCase()}`}></i>
					{children}
				</span>
			</div>
    )
  }

  render() {
    const {
      clearable, searchable, onChange, coins, placeholder, value
    } = this.props

    return (
      <Select
        clearable={clearable || true}
        searchable={searchable || true}
        onChange={onChange}
        options={coins}
        placeholder={placeholder}
        value={value}
        valueComponent={this.coinValueRenderer}
        optionRenderer={this.coinOptionRenderer}
        valueKey="id"
        labelKey="label"
        />
    )
  }
}
