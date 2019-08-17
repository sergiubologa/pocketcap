const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketStatsSchema = new Schema({
  added_at: { type: Date, default: Date.now },
  data: {
    total_market_cap_usd: Number,
    total_24h_volume_usd: Number,
    bitcoin_percentage_of_market_cap: Number,
    active_currencies: Number,
    active_assets: Number,
    active_markets: Number,
    last_updated: Number
  }
});

const marketStatsModel = mongoose.model("MarketStats", marketStatsSchema);

module.exports = marketStatsModel;
