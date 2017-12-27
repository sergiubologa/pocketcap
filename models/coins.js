const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinsSchema = new Schema({
    created_at: { type: Date, default: Date.now },
    coins: [{
        id: String,
        name: String,
        "symbol": String,
        "rank": Number,
        "price_usd": Number,
        "price_btc": Number,
        "24h_volume_usd": Number,
        "market_cap_usd": Number,
        "available_supply": Number,
        "total_supply": Number,
        "max_supply": Number,
        "percent_change_1h": Number,
        "percent_change_24h": Number,
        "percent_change_7d": Number,
        "last_updated": Number
    }]
});
coinsSchema.index({created_at: 1, type: -1});

const coinsModel = mongoose.model('Coins', coinsSchema);

module.exports = coinsModel;