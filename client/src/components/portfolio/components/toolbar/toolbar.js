// @flow
import React, {PureComponent} from 'react'
import moment from 'moment'
import TextToClipboard from '../../../elements/text-to-clipboard/text-to-clipboard'
import PortfolioActions from '../../../../actions/portfolio-actions'
import PortfolioStore from '../../../../stores/portfolio-store'
import type {Props} from '../../../../flow-types/react-generic'
import './toolbar.css'

type State = {
  isRefreshButtonDisabled: boolean,
  isUpdatingCoinsData: boolean,
  secToNextUpdate: number,
  shakeCopyToClipboardButton: boolean
}

export default class Toolbar extends PureComponent<Props, State> {
  countdownInterval: IntervalID
  enableRefreshBtnTimer: TimeoutID

  constructor(props: Props) {
    super(props)

    this.state = {
      isRefreshButtonDisabled: false,
      isUpdatingCoinsData: PortfolioStore.getPortfolio().isUpdatingCoinsData,
      secToNextUpdate: PortfolioStore.getPortfolio().secToNextUpdate,
      shakeCopyToClipboardButton: PortfolioStore.getPortfolio().shakeCopyToClipboardButton
    }

    this.updateStateData = this.updateStateData.bind(this)
    this.startCountDown = this.startCountDown.bind(this)
    this.getNextUpdateRemainingTime = this.getNextUpdateRemainingTime.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)

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
  }

  updateStateData = (): void => {
    const {
      isUpdatingCoinsData, secToNextUpdate, shakeCopyToClipboardButton
    } = PortfolioStore.getPortfolio()
    this.setState({
      isUpdatingCoinsData,
      secToNextUpdate,
      shakeCopyToClipboardButton
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
      isRefreshButtonDisabled, isUpdatingCoinsData, shakeCopyToClipboardButton
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

            <div className="column">
              <TextToClipboard
                text={window.location.href}
                buttonText="Copy to clipboard"
                copiedStateText="Copied to clipboard!"
                buttonClass={`btnCopyToClipboard ${shakeCopyToClipboardButton ? 'shake-it' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
