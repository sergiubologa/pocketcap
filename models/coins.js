const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coinsSchema = new Schema({
  added_at: { type: Date, default: Date.now },
  status: {
    timestamp: { type: Date, default: Date.now },
    error_code: Number,
    error_message: { type: String, default: null },
    elapsed: Number,
    credit_count: Number
  },
  data: [
    {
      id: Number,
      name: String,
      symbol: String,
      slug: String,
      num_market_pairs: Number,
      date_added: { type: Date, default: null },
      tags: [String],
      max_supply: Number,
      circulating_supply: Number,
      total_supply: Number,
      platform: {
        type: {
          id: Number,
          name: String,
          symbol: String,
          slug: String,
          token_address: String
        },
        default: null
      },
      cmc_rank: Number,
      last_updated: { type: Date, default: null },
      quote: {
        USD: {
          price: Number,
          volume_24h: Number,
          percent_change_1h: Number,
          percent_change_24h: Number,
          percent_change_7d: Number,
          market_cap: Number,
          last_updated: { type: Date, default: null }
        }
      }
    }
  ]
});
coinsSchema.index({ added_at: 1, type: -1 });

const coinsModel = mongoose.model("Coins", coinsSchema);

module.exports = coinsModel;
