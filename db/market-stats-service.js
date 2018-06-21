const mongooseConnector = require('db/mongoose-connector');
const MarketStatsModel = require('models/market-stats');
const axios = require('axios');

function retrieveAndSaveMarketStatsFrom3rdParty() {
    return axios.get(process.env.COINMARKETCAP_MARKET_STATS_URI)
                .then(stats => {
                  if (stats && stats.data && stats.data.data) {
                      const newStatsData = new MarketStatsModel;
                      newStatsData.data = stats.data.data;
                      return newStatsData.save();
                  }
                })
                .catch(error => {
                    // TODO - log error to file
                    console.log(error);
                });
}

function getMostRecentMarketStatsData(){
    const filters = {};
    const fields = {
      '_id': 0,
      '__v': 0,
      'data.last_updated': 0,
      'data._id': 0
    };
    const sortObj = {
        sort: { 'added_at': -1 }
    };
    return MarketStatsModel.findOne(filters, fields, sortObj);
}

function cleanupDatabase(){
    // remove stats data older than X days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - process.env.DAYS_TO_KEEP_MARKET_STATS);
    return MarketStatsModel.remove({ added_at: { $lt: cutoff }})
                     .then(res => {
                         // TODO - use logger
                         console.log('Market stats deleted:', res.n);
                     });
}

module.exports = {
    retrieveAndSaveMarketStatsFrom3rdParty,
    getMostRecentMarketStatsData,
    cleanupDatabase
};
