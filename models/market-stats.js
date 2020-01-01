const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketStatsSchema = new Schema({
  added_at: { type: Date, default: Date.now },
  status: {
    timestamp: { type: Date, default: Date.now },
    error_code: Number,
    error_message: { type: String, default: null },
    elapsed: Number,
    credit_count: Number
  },
  data: {
    active_cryptocurrencies: Number,
    active_market_pairs: Number,
    active_exchanges: Number,
    eth_dominance: Number,
    btc_dominance: Number,
    quote: {
      USD: {
        total_market_cap: Number,
        total_volume_24h: Number,
        total_volume_24h_reported: Number,
        altcoin_volume_24h: Number,
        altcoin_volume_24h_reported: Number,
        altcoin_market_cap: Number,
        last_updated: { type: Date }
      }
    },
    last_updated: { type: Date }
  }
});

const marketStatsModel = mongoose.model("MarketStats", marketStatsSchema);

module.exports = marketStatsModel;
