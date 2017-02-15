var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var EBayBuyApi = require('e_bay_buy_api');


var index = require('./routes/index');
var browse = require('./routes/browse');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


// get the env variables
app.use(function(req, res, next) {
  // Token has special charecters so its enclosed by quotes in ENV. 
  var authToken;
  if(process.env.EBAY_SUPER_AUTH_TOKEN){
  	authToken = process.env.EBAY_SUPER_AUTH_TOKEN.replace(/"/g,'');
  }

  req.eBayConfig = {
	  "isSandbox" : process.env.EBAY_SANDBOX || true,
	  "clientId" : process.env.EBAY_CLIENT_ID,
	  "clientSecret" : process.env.EBAY_CLIENT_SECRET,
	  "ruName" : process.env.EBAY_RUNAME,
	  "superAuthToken" : authToken  	
  }  

  next()
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/browse', browse); 




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
