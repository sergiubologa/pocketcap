// @flow
import type {Coin} from './coins'

export type MarketStats = {
  added_at: ?Date,
  data: ?{
    active_cryptocurrencies: number,
    active_markets: number,
    bitcoin_percentage_of_market_cap: number,
    quotes: {
      USD: {
          total_market_cap: number,
          total_volume_24h: number
      }
    },
    last_updated: number
  }
}

export type MarketStatsState = {
  isUpdatingStatsData: boolean,
  stats?: MarketStats,
  best3Coins?: Array<Coin>,
}
