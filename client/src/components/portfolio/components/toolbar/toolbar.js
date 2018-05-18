// @flow
import React, {Component} from 'react'
import moment from 'moment'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import AnimatedCheckIcon from '../../../animated-check-icon/animated-check-icon'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLink from '@fortawesome/fontawesome-free-solid/faLink'
import PortfolioActions from '../../../../actions/portfolio-actions'
import PortfolioStore from '../../../../stores/portfolio-store'
import type {Props} from '../../../../flow-types/react-generic'
import './toolbar.css'

type State = {
  isRefreshButtonDisabled: boolean,
  urlCopiedToClipboard: boolean,
  isUpdatingCoinsData: boolean,
  secToNextUpdate: number,
  shakeCopyToClipboardButton: boolean
}

export default class Toolbar extends Component<Props, State> {
  countdownInterval: IntervalID
  enableRefreshBtnTimer: TimeoutID
  resetClipboardButtonTimer: TimeoutID

  constructor(props: Props) {
    super(props)

    this.state = {
      isRefreshButtonDisabled: false,
      urlCopiedToClipboard: false,
      isUpdatingCoinsData: PortfolioStore.getPortfolio().isUpdatingCoinsData,
      secToNextUpdate: PortfolioStore.getPortfolio().secToNextUpdate,
      shakeCopyToClipboardButton: PortfolioStore.getPortfolio().shakeCopyToClipboardButton
    }

    this.updateStateData = this.updateStateData.bind(this)
    this.startCountDown = this.startCountDown.bind(this)
    this.getNextUpdateRemainingTime = this.getNextUpdateRemainingTime.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)
    this.onCopyUrlToClipboard = this.onCopyUrlToClipboard.bind(this)
    this.onRefreshBtnClick = this.onRefreshBtnClick.bind(this)
  }

  componentWillMount() {
    PortfolioStore.on('change', this.updateStateData)
  }

  componentDidMount() {
    this.startCountDown()
  }

  componentWillUnmount() {
    PortfolioStore.removeListener('change', this.updateStateData)
    clearInterval(this.countdownInterval)
    clearTimeout(this.enableRefreshBtnTimer)
    clearTimeout(this.resetClipboardButtonTimer)
  }

  updateStateData = (): void => {
    this.setState({
      isUpdatingCoinsData: PortfolioStore.getPortfolio().isUpdatingCoinsData,
      secToNextUpdate: PortfolioStore.getPortfolio().secToNextUpdate,
      shakeCopyToClipboardButton: PortfolioStore.getPortfolio().shakeCopyToClipboardButton
    })
  }

  startCountDown = (): void => {
    this.countdownInterval = setInterval(PortfolioActions.decrementCountdown, 1000)
  }

  onRefreshBtnClick = (): void => {
    PortfolioActions.fetchCoinsData()
    this.setState({isRefreshButtonDisabled: true})
    const disableRefreshButtnInterval = 30 * 1000 // 30 sec
    this.enableRefreshBtnTimer = setTimeout(() => {
      this.setState({isRefreshButtonDisabled: false})
    }, disableRefreshButtnInterval)
  }

  onCopyUrlToClipboard = (): void => {
    this.setState({urlCopiedToClipboard: true})
    const resetButtonSeconds: number = 5
    clearTimeout(this.resetClipboardButtonTimer)
    this.resetClipboardButtonTimer = setTimeout(() => {
      this.setState({urlCopiedToClipboard: false})
    }, resetButtonSeconds * 1000)
  }

  getNextUpdateRemainingTime = (): any => {
    if (this.state.secToNextUpdate > 0) {
      const duration = moment.duration(this.state.secToNextUpdate, 'seconds')
      const mins = this.addLeadingZero(duration.minutes())
      const sec = this.addLeadingZero(duration.seconds())
      return `${mins}:${sec}`
    }

    return ""
  }

  addLeadingZero = (val: number): string => {
    if (val && val.toString().length > 0) {
      if (val.toString().length === 1) return `0${val}`
      return val.toString()
    }

    return '00'
  }

  render() {
    const {
      isRefreshButtonDisabled, urlCopiedToClipboard,
      isUpdatingCoinsData, shakeCopyToClipboardButton
    } = this.state
    const updateButtonClass = `button is-info is-outlined ${isUpdatingCoinsData ? 'is-loading' : ''}`
    const nextUpdate = this.getNextUpdateRemainingTime()

    return (
      <div className="card toolbar has-background-white-bis">
        <div className="card-content">
          <div className="columns is-vcentered">
            <div className="column has-text-info" id="nextRefreshContainer">
              <div className="refreshMessage">Prices update in:</div>
              <div className="refreshButtonContainer">
                <button
                  disabled={isRefreshButtonDisabled}
                  onClick={this.onRefreshBtnClick}
                  className={updateButtonClass}>{nextUpdate}
                </button>
              </div>
            </div>
            <div className="column has-text-right">
              <CopyToClipboard
                onCopy={this.onCopyUrlToClipboard}
                text={window.location.href}>
                <a className={`button is-info btnCopyToClipboard
                  ${urlCopiedToClipboard ? 'copied' : ''}
                  ${shakeCopyToClipboardButton ? 'shake-it' : ''}`}>
                  <span>Get bookmarkable link</span>
                  <span>Copied to clipboard!</span>
                  <span className="icon">
                    {
                      urlCopiedToClipboard
                        ? <AnimatedCheckIcon />
                        : <FontAwesomeIcon icon={faLink} />
                    }
                  </span>
                </a>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
