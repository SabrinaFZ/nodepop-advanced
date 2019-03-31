'use strict';

const createError = require('http-errors');
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const jwtAuth = require("./lib/jwtAuth");
const i18n = require('./lib/i18nConfigure')();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use i18n
app.use(i18n.init);

// connect to database
require('./lib/connectMongoose');

// initialize uploadImageService
require('./lib/uploadFileService')();

// set default local variables
app.use((req, res, next) => {
  res.locals.title = 'Nodepop';
  res.locals.articles = [];
  res.locals.tags = [];
  next();
});

// middleware main site
app.use('/', indexRouter);

// middleware change language
app.use('/change-lang', require('./routes/change-lang'));

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
