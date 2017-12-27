const mongooseConnector = require('db/mongoose-connector');
const CoinsModel = require('models/coins');
const axios = require('axios');

function retrieveAndSaveCoinsDataFrom3rdParty() {
    return axios.get('https://api.coinmarketcap.com/v1/ticker/')
                .then((coins) => {
                    if (coins && coins.data && coins.data.length > 0) {
                        const newCoinsData = new CoinsModel({
                            coins: coins.data
                        });
                        return newCoinsData.save();
                    }
                })
                .catch((error) => {
                    // TODO - log error to file
                    console.log(error);
                });
}

function getMostRecentCoinsData(){
    return CoinsModel.findOne({}, { 'coins.last_updated': 0, 'coins._id': 0}, { sort: { 'created_at': -1 } });
}

module.exports = {
    retrieveAndSaveCoinsDataFrom3rdParty,
    getMostRecentCoinsData
};