'use script';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var jwtAuth = require('./lib/jwtAuth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect to database
require('./lib/connectMongoose');

// set default local variables
app.use((req, res, next) => {
  res.locals.title = 'Nodepop';
  res.locals.articles = [];
  res.locals.tags = [];
  next();
});

// middleware main site
app.use('/', jwtAuth(), indexRouter);

// middleware login
app.use('/apiv1/authenticate', require('./routes/apiv1/auth'))

// middleware nodepop API
app.use("/apiv1/ads", jwtAuth(), require('./routes/apiv1/ads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
