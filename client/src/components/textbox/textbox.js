// @flow
import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faBan from '@fortawesome/fontawesome-free-solid/faBan'
import type {TextboxProps as Props, TextboxState as State} from '../../flow-types/textbox'

export default class Textbox extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {isTouched: false}
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange = (e: Event): void => {
    if (this.props.onChange && e.target instanceof HTMLInputElement) {
      this.props.onChange.call(null, e.target.value)
    }
    if (!this.state.isTouched) {
      this.setState({isTouched: true})
    }
  }

  onBlur = (): void => {
    this.setState({isTouched: true})
  }

  render() {
    const {value, isValid, placeholder, autoFocus, className} = this.props
    const {isTouched} = this.state
    const inputClasses = ['input']
    if (isTouched) {
      inputClasses.push(isValid ? 'is-success' : 'is-danger')
    }
    inputClasses.push(className)
    const validationIcon = !isTouched ? undefined :
      <span className="icon is-small is-right">
        <FontAwesomeIcon icon={isValid ? faCheck : faBan} className={isValid ? 'has-text-success' : 'has-text-danger'} />
      </span>

    return (
      <div className="textbox field">
        <div className={`control ${isTouched ? 'has-icons-right' : ''}`}>
          <input
            className={inputClasses.join(' ')}
            autoFocus={autoFocus}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={this.onChange}
            onBlur={this.onBlur} />
          {validationIcon}
        </div>
      </div>
    )
  }
}
