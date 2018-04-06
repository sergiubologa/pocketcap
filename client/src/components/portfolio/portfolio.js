// @flow
import React, { Component } from 'react'
import moment from 'moment'
//import NewTransactionModal from '../new-transaction-modal/new-transaction-modal'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {Portfolio as State} from '../../flow-types/portfolio'
import './portfolio.css'

class Portfolio extends Component<Props, State> {
  countdownInterval: IntervalID
  enableRefreshBtnTimer: TimeoutID

  constructor(props: Props) {
    super(props)
    this.state = {
      ...PortfolioStore.getPortfolio(),
      isRefreshButtonDisabled: false
    }
    this.updateStateData = this.updateStateData.bind(this)
    this.openAddNewTransactionModal = this.openAddNewTransactionModal.bind(this)
    this.startCountDown = this.startCountDown.bind(this)
    this.getNextUpdateRemainingTime = this.getNextUpdateRemainingTime.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)
    this.refreshCoinsData = this.refreshCoinsData.bind(this)
    this.onRefreshBtnClick = this.onRefreshBtnClick.bind(this)
  }

  componentWillMount() {
    PortfolioStore.on('change', this.updateStateData)
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval)
    clearTimeout(this.enableRefreshBtnTimer)
    PortfolioStore.removeListener('change', this.updateStateData)
  }

  componentDidMount() {
    this.refreshCoinsData()
    this.startCountDown()
  }

  updateStateData = (): void => {
    this.setState(PortfolioStore.getPortfolio())
  }

  refreshCoinsData = (): void => {
    PortfolioActions.fetchCoinsData()
  }

  openAddNewTransactionModal = (): void => {
    if (!this.state.isAddNewTransactionModalOpen) {
      PortfolioActions.toggleAddNewTransactionModal()
    }
  }

  onRefreshBtnClick = (): void => {
    this.refreshCoinsData()
    this.setState({isRefreshButtonDisabled: true})
    const disableRefreshButtnInterval = 30 * 1000 // 30 sec
    this.enableRefreshBtnTimer = setTimeout(() => {
      this.setState({isRefreshButtonDisabled: false})
    }, disableRefreshButtnInterval)
  }

  startCountDown = (): void => {
    this.countdownInterval = setInterval(PortfolioActions.decrementCountdown, 1000)
  }

  getNextUpdateRemainingTime = (): any => {
    if (this.state.secToNextUpdate > 0) {
      const duration = moment.duration(this.state.secToNextUpdate, 'seconds')
      const mins = this.addLeadingZero(duration.minutes())
      const sec = this.addLeadingZero(duration.seconds())
      return `${mins}:${sec}`
    }

    return <span className="fa fa-spinner fa-pulse"></span>
  }

  addLeadingZero = (val: number): string => {
    if (val && val.toString().length > 0) {
      if (val.toString().length === 1) return `0${val}`
      return val.toString()
    }

    return '00'
  }

  render() {
    // const newTransactionModal = this.state.isAddNewTransactionModalOpen ?
    //                             <NewTransactionModal /> :
    //                             ''
    // <p><i className="fa fa-calendar"></i>Last updated at: {this.getAddedAtDate()}</p>
    // <button className="button is-primary" onClick={this.refreshCoinsData}>Refresh</button>
    // <button className="button is-primary" onClick={this.openAddNewTransactionModal}>Add new transaction</button>
    // <h1>Coins</h1>
    // {this.state.coins.data.map(coin =>
    //   <div key={coin.id}><i className={`cc defaultCoinIcon ${coin.symbol.toUpperCase()}`}></i> {coin.id}: {coin.price_usd}</div>
    // )}
    // {newTransactionModal}
    const {isUpdatingCoinsData, isRefreshButtonDisabled} = this.state
    const nextUpdate = this.getNextUpdateRemainingTime()
    const updateButtonClass = `button is-primary ${isUpdatingCoinsData ? 'is-loading' : ''}`
    return (
      <div className="portfolio">
        <div className="columns">
          <div className="column">
            Next update: <button disabled={isRefreshButtonDisabled} onClick={this.onRefreshBtnClick} className={updateButtonClass}>{nextUpdate}</button>
          </div>
          <div className="column has-text-right">
            <a href="/">Share view</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Portfolio
