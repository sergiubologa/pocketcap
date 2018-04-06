require('dotenv').config();
require('checkenv').check();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { coinsCronJob } = require('cron-jobs/coins-cron');
const { cleanDBCronJob } = require('cron-jobs/clean-db-cron');

var index = require('routes/index');
var coins = require('routes/coins');
var allOthers = require('routes/all-others');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Delay responses to simulate latency
//app.use(function(req,res,next){setTimeout(next,2000)});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', index);
app.use('/api/coins', coins);
app.use('*', allOthers);

// Start cron jobs
if (process.env.NODE_ENV != 'testing'){
    coinsCronJob.start();
    cleanDBCronJob.start();
    // TODO - use logger
    console.log('Cron jobs started');
    //setInterval(() => console.log(coinsCronJob.nextDates(), process.env.NODE_ENV), 1000);
}

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
