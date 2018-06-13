// @flow
import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCopy from '@fortawesome/fontawesome-free-solid/faCopy'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import AnimatedCheckIcon from '../../elements/animated-check-icon/animated-check-icon'
import './text-to-clipboard.css'
type Props = {
  text: string,
  buttonText?: string,
  copiedStateText?: string,
  buttonClass?: string
}
type State = {
  copied: boolean
}

export default class TextToClipboard extends Component<Props, State> {
  resetClipboardButtonTimer: TimeoutID
  txtCopyToClipboard: ?HTMLInputElement

  constructor(props: Props) {
    super(props)

    this.state = {
      copied: false
    }

    this.onCopyUrlToClipboard = this.onCopyUrlToClipboard.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.resetClipboardButtonTimer)
  }

  onCopyUrlToClipboard = (): void => {
    if (this.txtCopyToClipboard) {
      this.txtCopyToClipboard.select()
    }

    this.setState({copied: true})
    const resetButtonSeconds: number = 5
    clearTimeout(this.resetClipboardButtonTimer)
    this.resetClipboardButtonTimer = setTimeout(() => {
      this.setState({copied: false})
    }, resetButtonSeconds * 1000)
  }

  render() {
    const {copied} = this.state
    const {
      text, buttonClass, buttonText = 'Copy', copiedStateText = 'Copied'
    } = this.props
    const btnClasses = ['button', 'is-info']
    if (copied) btnClasses.push('copied')
    if (buttonClass) btnClasses.push(buttonClass)

    return (
      <div className="text-to-clipboard field has-addons">
        <div className="control">
          <input className="input" type="text"
          value={text}
          ref={txt => this.txtCopyToClipboard = txt} readOnly
          onClick={e => e.target.select()} />
        </div>
        <div className="control">
          <CopyToClipboard
            onCopy={this.onCopyUrlToClipboard}
            text={text}>
            <a className={btnClasses.join(' ')}>
              <span>{buttonText}</span>
              <span>{copiedStateText}</span>
              <span className="icon">
                {
                  copied
                    ? <AnimatedCheckIcon />
                    : <FontAwesomeIcon icon={faCopy} />
                }
              </span>
            </a>
          </CopyToClipboard>
        </div>

      </div>
    )
  }
}
