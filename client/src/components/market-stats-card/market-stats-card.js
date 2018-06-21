// @flow
import React, {PureComponent} from 'react'
import moment from 'moment'
import Icon from '../elements/icon/icon'
import { faAngleDown, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '../elements/tooltip/tooltip'
import CoinIcon from '../elements/coin-icon/coin-icon'
import MarketStatsStore from '../../stores/market-stats-store'
import PortfolioStore from '../../stores/portfolio-store'
import * as Utils from '../../utils/utils'
import type {Props} from '../../flow-types/react-generic'
import type {MarketStatsState as State} from '../../flow-types/market-stats'
import type {Coin, CoinsData} from '../../flow-types/coins'
import './market-stats-card.css'

type Best3CoinsCache = {
  [key: string]: Array<Coin>
}

export default class MarketStatsCard extends PureComponent<Props, State> {
  best3CoinsCache: Best3CoinsCache = {}

  constructor(props: Props) {
    super(props)

    this.state = {
      ...MarketStatsStore.getMarketStats(),
      best3Coins: this.getBest3Coins()
    }

    this.updateStateData = this.updateStateData.bind(this)
  }

  componentWillMount() {
    MarketStatsStore.on('change', this.updateStateData)
    PortfolioStore.on('change', this.updateBestCoinsData)
  }

  componentWillUnmount() {
    MarketStatsStore.removeListener('change', this.updateStateData)
    PortfolioStore.removeListener('change', this.updateBestCoinsData)
  }

  componentDidMount() {
    MarketStatsStore.fetchMarketStatsData()
  }

  updateStateData = (): void => {
    this.setState({...MarketStatsStore.getMarketStats()})
  }

  updateBestCoinsData = (): void => {
    this.setState({best3Coins: this.getBest3Coins()})
  }

  getBest3Coins = (): Array<Coin> => {
    // var t0 = performance.now()
    const coinsData: CoinsData = PortfolioStore.getCoinsData()
    const best3Coins: Array<Coin> = []
    const activateCache = false

    if (coinsData) {
      if (coinsData.added_at && activateCache) {
        const cachedData = this.best3CoinsCache[coinsData.added_at]
        if (cachedData) {
          // var t1 = performance.now()
          // console.log('from cache: ' + (t1 - t0) + " milliseconds.")
          // console.log('items in cache: ' + Object.keys(this.best3CoinsCache).length)
          return cachedData
        }
      }

      for (let i = 0, len = coinsData.data.length; i < len; i++) {
        const currentCoin: Coin = coinsData.data[i]

        if (currentCoin.percent_change_24h) {
          const firstCoin: Coin = best3Coins[0]
          const secondCoin: Coin = best3Coins[1]
          const thirdCoin: Coin = best3Coins[2]

          if (firstCoin && firstCoin.percent_change_24h && currentCoin.percent_change_24h > firstCoin.percent_change_24h) {
            best3Coins.unshift(currentCoin)
            if (thirdCoin) best3Coins.splice(-1, 1)
          } else if (secondCoin && secondCoin.percent_change_24h && currentCoin.percent_change_24h > secondCoin.percent_change_24h) {
            best3Coins.splice(1, 0, currentCoin)
            if (thirdCoin) best3Coins.splice(-1, 1)
          } else if (thirdCoin && thirdCoin.percent_change_24h && currentCoin.percent_change_24h > thirdCoin.percent_change_24h) {
            best3Coins.splice(2, 1, currentCoin)
          } else if (best3Coins.length < 3) {
            best3Coins.push(currentCoin)
          }
        }
      }

      if (coinsData.added_at && activateCache) {
        this.best3CoinsCache[coinsData.added_at] = best3Coins
      }
    }

    // var t2 = performance.now()
    // console.log('from iterating: ' + (t2 - t0) + " milliseconds.")
    return best3Coins
  }

  render() {
    const {stats = {}, isUpdatingStatsData, best3Coins = []} = this.state
    const marketCap: ?number = Utils.safePick(stats, "data", "quotes", "USD", "total_market_cap")
    const volume24hrs: ?number = Utils.safePick(stats, "data", "quotes", "USD", "total_volume_24h")
    const btcDominance: ?number = Utils.safePick(stats, "data", "bitcoin_percentage_of_market_cap")
    const firstCoin: Coin =  best3Coins[0]
    const secondCoin: Coin = best3Coins[1]
    const thirdCoin: Coin = best3Coins[2]

    return (
      <div className="card market-stats-card">

        <div className="card-content">
          <p className="title">
            Market Stats
            <Tooltip tip="Data from CoinMarketCap" className="is-pulled-right is-size-5" style={{marginTop: '8px'}}>
              <Icon icon={faQuestionCircle} className="has-text-grey" />
            </Tooltip>
          </p>
          <p className="subtitle is-6">last update:
            {
              isUpdatingStatsData ?
                <span> loading...</span> :
                <span> {moment(stats.added_at).fromNow()}</span>
            }
          </p>

          <div className="content">
            <div className="columns is-multiline is-gapless">
              <div className="column is-half">Market cap:</div>
              <div className="column is-half">{Utils.toMoneyString(marketCap)}</div>
              <div className="column is-half">Volume 24h:</div>
              <div className="column is-half">{Utils.toMoneyString(volume24hrs)}</div>
              <div className="column is-half">BTC dominance:</div>
              <div className="column is-half">{btcDominance || 'N/A'}%</div>
            </div>
          </div>
        </div>
        <div>

          <p className="is-size-7 has-text-weight-semibold is-marginless has-text-centered has-text-grey">
            <Icon icon={faAngleDown} />&nbsp;
            <span>best performers in the last 24 hrs</span>&nbsp;
            <Icon icon={faAngleDown} />
          </p>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item has-text-centered">
            <div><CoinIcon symbol={firstCoin && firstCoin.symbol} /> {firstCoin && firstCoin.symbol}</div>
            <div className="has-text-green">{firstCoin && firstCoin.percent_change_24h}%</div>
          </div>
          <div className="card-footer-item has-text-centered">
            <div><CoinIcon symbol={secondCoin && secondCoin.symbol} /> {secondCoin && secondCoin.symbol}</div>
            <div className="has-text-green">{secondCoin && secondCoin.percent_change_24h}%</div>
          </div>
          <div className="card-footer-item has-text-centered">
            <div><CoinIcon symbol={thirdCoin && thirdCoin.symbol} /> {thirdCoin && thirdCoin.symbol}</div>
            <div className="has-text-green">{thirdCoin && thirdCoin.percent_change_24h}%</div>
          </div>
        </footer>

      </div>
    )
  }
}
