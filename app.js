var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var EBayBuyApi = require('e_bay_buy_api');
var prettyjson = require('prettyjson');


var index = require('./routes/index');
var browse = require('./routes/browse');
var guest_checkout = require('./routes/guest_checkout');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));


/**************************************************************/
// eBay specific handler
// get the env variables
/**************************************************************/

app.use(function(req, res, next) {

  console.log('eBay request filter');

  // Token has special charecters so we should enclose it by quotes in ENV. 
  var authToken;
  if(process.env.EBAY_SUPER_AUTH_TOKEN){
  	authToken = process.env.EBAY_SUPER_AUTH_TOKEN.replace(/"/g,'');
  }

  req.eBay = {
	  "isSandbox" : (process.env.EBAY_SANDBOX == "TRUE"),
	  "clientId" : process.env.EBAY_CLIENT_ID,
	  "clientSecret" : process.env.EBAY_CLIENT_SECRET,
	  "ruName" : process.env.EBAY_RUNAME,
	  "superAuthToken" : authToken,
    "browseApi" : new EBayBuyApi.BrowseApi(),
    "orderApi" : new EBayBuyApi.OrderApi()
  }

  EBayBuyApi.ApiClient.instance.authentications['OauthSecurity'].apiKey = req.eBay.superAuthToken;

  if(req.eBay.isSandbox) {
    console.log('eBay request filter as Sandbox');
    EBayBuyApi.ApiClient.instance.basePath = 'https://api.sandbox.ebay.com/buy'.replace(/\/+$/, '');
  }

  if(!req.eBay.isSandbox) {
    console.log('eBay request filter as Production');
    
    //TODO Production Base Url for Order API should be. 
    //https://apix.ebay.com/buy

  }

  next()
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/', index);
app.use('/browse', browse); 
app.use('/guest_checkout', guest_checkout); 

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
