const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketStatsSchema = new Schema({
    added_at: { type: Date, default: Date.now },
    data: {
      active_cryptocurrencies: Number,
      active_markets: Number,
      bitcoin_percentage_of_market_cap: Number,
      quotes: {
          USD: {
              total_market_cap: Number,
              total_volume_24h: Number
          }
      },
      last_updated: Number
    }
});

const marketStatsModel = mongoose.model('MarketStats', marketStatsSchema);

module.exports = marketStatsModel;
