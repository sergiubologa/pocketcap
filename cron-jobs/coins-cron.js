const CronJob = require('cron').CronJob;
const coinsService = require('db/coins-service');
const minutesInterval = process.env.GET_COINS_INTERVAL_MINUTES || 5;

const coinsCronJob = new CronJob({
    cronTime: `0 */${minutesInterval} * * * *`,
    onTick: () => coinsService.retrieveAndSaveCoinsDataFrom3rdParty(),
    start: false,
    runOnInit: true,
    timeZone: 'America/Los_Angeles'
});

module.exports = {coinsCronJob};