var express = require('express');
var router = express.Router();
var async = require('async');
var EBayBuyApi = require('e_bay_buy_api');

/**********************************************************/
// Start Guest Checkout Page
/**********************************************************/

router.get('/start', function(req, res, next) {
  res.render('guest_checkout/start', { title: 'Express' });
});


/**********************************************************/
// Update Payment Guest Checkout Page
/**********************************************************/

router.get('/update_payment', function(req, res, next) {
  res.render('guest_checkout/update_payment', { title: 'Express' });
});


/**********************************************************/
// Review Guest Checkout Page
/**********************************************************/

router.get('/review', function(req, res, next) {
  res.render('guest_checkout/review', { title: 'Express' });
});


/**********************************************************/
// View Order Guest Checkout Page
/**********************************************************/

router.get('/view_order', function(req, res, next) {
  res.render('guest_checkout/view_order', { title: 'Express' });
});


module.exports = router;
