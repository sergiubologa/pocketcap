const CronJob = require('cron').CronJob;
const coinsService = require('db/coins-service');

const cleanDBCronJob = new CronJob({
    cronTime: `0 0 0 * * *`,
    onTick: () => coinsService.cleanupDatabase(),
    start: false,
    runOnInit: true,
    timeZone: 'America/Los_Angeles'
});

module.exports = {cleanDBCronJob};