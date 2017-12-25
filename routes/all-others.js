var express = require('express');
var path = require('path');
var router = express.Router();

// The "catchall" handler: for any request that doesn't
// match one above, send back React's 404 file.
router
    .route('*')
    .get((req, res) => {
        // TODO - send the 404 file from client
        res.sendFile(path.resolve(path.join(process.env.NODE_PATH, '/client/build/index.html')));
    }
);

module.exports = router;