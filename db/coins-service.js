const mongooseConnector = require("db/mongoose-connector");
const CoinsModel = require("models/coins");
const apiCalls = require("./api-calls");

function retrieveAndSaveCoinsDataFrom3rdParty() {
  const { COINMARKETCAP_ALL_COINS_PATH } = process.env;

  return apiCalls
    .get(COINMARKETCAP_ALL_COINS_PATH, {
      limit: 2000
    })
    .then(coins => {
      if (coins && coins.data) {
        const newCoinsData = new CoinsModel();
        newCoinsData.status = coins.status;
        newCoinsData.data = coins.data;
        return newCoinsData.save();
      }
    })
    .catch(error => {
      // TODO - log error to file
      console.log(error);
    });
}

function getMostRecentCoinsData() {
  const filters = {};
  const fields = {
    _id: 0,
    __v: 0,
    status: 0,
    "data.last_updated": 0,
    "data._id": 0,
    "data.date_added": 0,
    "data.platform": 0,
    "data.tags": 0,
    "data.quote.USD.last_updated": 0
  };
  const sortObj = {
    sort: { added_at: -1 }
  };
  return CoinsModel.findOne(filters, fields, sortObj);
}

function cleanupDatabase() {
  // remove coins data older than X days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - process.env.DAYS_TO_KEEP_COINS_DATA);
  return CoinsModel.deleteMany({ added_at: { $lt: cutoff } }).then(res => {
    // TODO - use logger
    console.log("Coins deleted:", res.n);
  });
}

module.exports = {
  retrieveAndSaveCoinsDataFrom3rdParty,
  getMostRecentCoinsData,
  cleanupDatabase
};
