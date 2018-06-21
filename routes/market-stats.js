const express = require('express');
const router = express.Router();
const marketStatsService = require('db/market-stats-service');

/* GET coin value. */
router
  .route('/')
  .get((req, res, next) => {
    marketStatsService.getMostRecentMarketStatsData()
      .then(stats => res.json(stats))
      .catch(error => {
        // TODO - log the error
        console.log(error);
        res.status(500).send();
      });
});

module.exports = router;
