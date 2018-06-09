// @flow
import axios from 'axios'
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as MarketStatsActionsNames} from '../actions/market-stats-actions'
import type {MarketStatsState, MarketStats} from '../flow-types/market-stats'

class MarketStatsStore extends EventEmitter {
  MARKET_STATS_DATA_STORAGE_KEY: string = 'MARKET_STATS_DATA'
  marketStats: MarketStatsState = this.defaultState()

  async fetchMarketStatsData() {
    this.marketStats.isUpdatingStatsData = true
    this.emit('change')

    try {
      const res = await axios.get('/api/market-stats')
      const stats = res.data
      localStorage.setItem(this.MARKET_STATS_DATA_STORAGE_KEY, JSON.stringify(stats))
      this.marketStats.stats = stats
    }
    catch(error) {
      // TODO - log the error
    }
    finally {
      this.marketStats.isUpdatingStatsData = false
      this.emit('change')
    }
  }

  getMarketStatsData(): MarketStats {
    const stats: ?string = localStorage.getItem(this.MARKET_STATS_DATA_STORAGE_KEY)
    const defaultStatsData: MarketStats = { added_at: null, data: null }
    return stats ? JSON.parse(stats) : defaultStatsData
  }

  getMarketStats(): MarketStatsState {
    return this.marketStats
  }

  defaultState(): MarketStatsState {
    return {
      isUpdatingStatsData: false,
      stats: this.getMarketStatsData()
    }
  }

  handleActions(action) {
    switch (action.type) {
      case MarketStatsActionsNames.FETCH_STATS_DATA:
        this.fetchMarketStatsData()
        break
      default:
        break
    }
  }
}

const marketStatsStore = new MarketStatsStore()
AppDispatcher.register(marketStatsStore.handleActions.bind(marketStatsStore))

export default marketStatsStore