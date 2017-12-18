var express = require('express');
var router = express.Router();

/* GET coin value. */
router
  .route('/:coinName')
  .get((req, res, next) => {
    console.log(req.params.coinName);
    res.json([{
      id: 1,
      username: "cardano"
    }, {
      id: 2,
      username: "bitcoin"
    }]);
});

module.exports = router;
