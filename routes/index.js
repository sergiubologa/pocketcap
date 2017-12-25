var express = require('express');
var router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    res.json({ message: 'api is alive!' });
  }
);

module.exports = router;
