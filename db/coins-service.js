const mongooseConnector = require('db/mongoose-connector');
const CoinsModel = require('models/coins');
const axios = require('axios');

function retrieveAndSaveCoinsDataFrom3rdParty() {
    return axios.get(process.env.COINMARKETCAP_ALL_COINS_URI)
                .then((coins) => {
                    if (coins && coins.data && coins.data.length > 0) {
                        const newCoinsData = new CoinsModel;
                        newCoinsData.data = coins.data;
                        return newCoinsData.save();
                    }
                })
                .catch((error) => {
                    // TODO - log error to file
                    console.log(error);
                });
}

function getMostRecentCoinsData(){
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
    return CoinsModel.findOne(filters, fields, sortObj);
}

function cleanupDatabase(){
    // remove coins data older than 5 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - process.env.DAYS_TO_KEEP_COINS_DATA);
    return CoinsModel.remove({ added_at: { $lt: cutoff }})
                     .then((res) => {
                         // TODO - use logger
                         console.log('Coins deleted:', res.result.n);
                     });
}

module.exports = {
    retrieveAndSaveCoinsDataFrom3rdParty,
    getMostRecentCoinsData,
    cleanupDatabase
};
