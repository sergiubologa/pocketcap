const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinsSchema = new Schema({
    added_at: { type: Date, default: Date.now },
    data: [{
        id: String,
        name: String,
        symbol: String,
        rank: Number,
        price_usd: { type: Number, default: null },
        price_btc: { type: Number, default: null },
        "24h_volume_usd": { type: Number, default: null },
        market_cap_usd: { type: Number, default: null },
        available_supply: { type: Number, default: null },
        total_supply: { type: Number, default: null },
        max_supply: { type: Number, default: null },
        percent_change_1h: { type: Number, default: null },
        percent_change_24h: { type: Number, default: null },
        percent_change_7d: { type: Number, default: null },
        last_updated: { type: Number, default: null }
    }]
});
coinsSchema.index({added_at: 1, type: -1});

const coinsModel = mongoose.model('Coins', coinsSchema);

module.exports = coinsModel;
