const CronJob = require('cron').CronJob;
const marketStatsService = require('db/market-stats-service');
const minutesInterval = process.env.GET_MARKET_STATS_INTERVAL_MINUTES || 10;

const marketStatsCronJob = new CronJob({
    cronTime: `0 */${minutesInterval} * * * *`,
    onTick: () => marketStatsService.retrieveAndSaveMarketStatsFrom3rdParty(),
    start: false,
    runOnInit: true,
    timeZone: 'America/Los_Angeles'
});

module.exports = {marketStatsCronJob};
