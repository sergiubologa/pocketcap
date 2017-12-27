const express = require('express');
const router = express.Router();
const coinsService = require('db/coins-service');

/* GET coin value. */
router
  .route('/')
  .get((req, res, next) => {
    coinsService.getMostRecentCoinsData()
      .then((coinsModel) => res.json(coinsModel.coins))
      .catch((error) => {
        // TODO - log the error
        console.log(error);
        res.status(500).send();
      });
});

module.exports = router;
