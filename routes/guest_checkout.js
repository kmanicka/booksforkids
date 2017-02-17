var express = require('express');
var router = express.Router();
var async = require('async');
var EBayBuyApi = require('e_bay_buy_api');
var prettyjson = require('prettyjson');

/**********************************************************/
// Start Guest Checkout Page
/**********************************************************/

router.get('/start/:itemId/:quantity', function(req, res, next) {
  var itemId = req.params.itemId;
  var quantity = req.params.quantity;
  res.render('guest_checkout/start', { 'itemId': itemId,'quantity': quantity });
});


/**********************************************************/
// Start Guest Checkout Session Action
/**********************************************************/

router.post('/start_session', function(req, res, next) { 
  async.waterfall([
        function(next) {

  			  console.log('start_session')

        	  var request = new EBayBuyApi.CreateGuestCheckoutSessionRequest();

        	  request.contactEmail = req.body.contactEmail;
        	  request.contactFirstName = req.body.contactFirstName;
        	  request.contactLastName = req.body.contactLastName;

        	  request.shippingAddress = new EBayBuyApi.Address();

        	  request.shippingAddress.recipient = req.body.recipient;
        	  request.shippingAddress.phoneNumber = req.body.phoneNumber;
        	  request.shippingAddress.addressLine1 = req.body.addressLine1;
        	  request.shippingAddress.city = req.body.city;
        	  request.shippingAddress.stateOrProvince = req.body.stateOrProvince;
        	  request.shippingAddress.postalCode = req.body.postalCode;
        	  request.shippingAddress.country = req.body.country;

        	  request.lineItemInputs = [];
        	  request.lineItemInputs[0] = new EBayBuyApi.LineItemInput();
        	  request.lineItemInputs[0].itemId = req.body.itemId;
        	  request.lineItemInputs[0].quantity = req.body.quantity;

			  req.eBay.orderApi.initiateGuestCheckoutSession(request, next);
        }
    ],
   	function(error,data,response,next) {

        if (error) {

        	console.log('Error in Search');
			//console.log(prettyjson.render(error));

            res.render('error',{message:  error.response.text});

        } else {

        	console.log('Data received during search call');
    			console.log(prettyjson.render(data));

    			res.redirect('/guest_checkout/provide_payment/' + data.checkoutSessionId);
        }

    }); 
});

/**********************************************************/
// Provide Payment Guest Checkout Page
/**********************************************************/

router.get('/provide_payment/:checkoutSessionId', function(req, res, next) {
    async.waterfall([
          function(next) {
            var checkoutSessionId = req.params.checkoutSessionId;


            console.log('Calling getGuestCheckoutSession API ' + checkoutSessionId);
            req.eBay.orderApi.getGuestCheckoutSession(checkoutSessionId, next);
          }
      ],
        function(error,data,response,next) { 

          if (error) {

            console.log('Error in Search');
        console.log(prettyjson.render(error));
              
              res.render('error',{message:  error.response.text});

          } else {

            console.log('Data received during search call');
            console.log(prettyjson.render(data));     

          var local = {};
          local.data = data;
          local.req = req;
          res.render('guest_checkout/provide_payment', local);
          }
      }); 
});



/**********************************************************/
// Update Payment Guest Checkout Action
/**********************************************************/

router.post('/update_payment/:checkoutSessionId', function(req, res, next) {
    
    console.log('iN  update_payment call ' + checkoutSessionId);    

    var checkoutSessionId = req.params.checkoutSessionId;
    
    var updatePaymentInformation = new EBayBuyApi.UpdatePaymentInformation();
    updatePaymentInformation.creditCard = new EBayBuyApi.CreditCard();

    updatePaymentInformation.creditCard.accountHolderName = req.body.accountHolderName;
    updatePaymentInformation.creditCard.brand = req.body.brand;
    updatePaymentInformation.creditCard.cardNumber = req.body.cardNumber;
    updatePaymentInformation.creditCard.cvvNumber = req.body.cvvNumber;
    updatePaymentInformation.creditCard.expireMonth = req.body.expireMonth;
    updatePaymentInformation.creditCard.expireYear = req.body.expireYear;

    updatePaymentInformation.creditCard.billingAddress = new EBayBuyApi.BillingAddress();

    async.waterfall([
	        function(next) {
            console.log('Calling getGuestCheckoutSession API ' + checkoutSessionId);    
				    req.eBay.orderApi.getGuestCheckoutSession(checkoutSessionId,next);
	        },
          function(data,response,next) {

            console.log('Data received during getGuestCheckoutSession call');
            console.log(prettyjson.render(data));

            updatePaymentInformation.creditCard.billingAddress.firstName = 'Frank';
            updatePaymentInformation.creditCard.billingAddress.lastName = 'Smith';

            updatePaymentInformation.creditCard.billingAddress.addressLine1 = data.shippingAddress.addressLine1;
            updatePaymentInformation.creditCard.billingAddress.addressLine2 = data.shippingAddress.addressLine2;
            updatePaymentInformation.creditCard.billingAddress.county = data.shippingAddress.county;
            updatePaymentInformation.creditCard.billingAddress.city = data.shippingAddress.city;
            updatePaymentInformation.creditCard.billingAddress.stateOrProvince = data.shippingAddress.stateOrProvince;
            updatePaymentInformation.creditCard.billingAddress.country = data.shippingAddress.country;
            updatePaymentInformation.creditCard.billingAddress.postalCode = data.shippingAddress.postalCode;
          
            req.eBay.orderApi.updateGuestPaymentInfo(checkoutSessionId,updatePaymentInformation,next);
          }          
	    ],
       	function(error,data,response,next) { 

	        if (error) {

	        	console.log('Error in Search');
				    console.log(prettyjson.render(error));
	            
	          res.render('error',{message:  error.response.text});

	        } else {

	        	console.log('Data received during updateGuestPaymentInfo call');
				    console.log(prettyjson.render(data));

            res.redirect('/guest_checkout/review/' + data.checkoutSessionId);			
	        }
	    }); 
});


/**********************************************************/
// Review Guest Checkout Page
/**********************************************************/

router.get('/review/:checkoutSessionId', function(req, res, next) {
    async.waterfall([
          function(next) {
            var checkoutSessionId = req.params.checkoutSessionId;
            console.log('Calling getGuestCheckoutSession API ' + checkoutSessionId);
            req.eBay.orderApi.getGuestCheckoutSession(checkoutSessionId, next);
          }
      ],
        function(error,data,response,next) { 

          if (error) {
            console.log('Error in Search');
            console.log(prettyjson.render(error));
              
            res.render('error',{message:  error.response.text});
          } else {

            console.log('Data received during search call');
            console.log(prettyjson.render(data));     

            var local = {};
            local.data = data;
            local.req = req;
            res.render('guest_checkout/review', local);
          }
      }); 
});



/**********************************************************/
// Place Order Guest Checkout Action
/**********************************************************/

router.get('/place_order/:checkoutSessionId', function(req, res, next) {
    async.waterfall([
          function(next) {

            var checkoutSessionId = req.params.checkoutSessionId;
            console.log('Calling placeGuestOrder API ' + checkoutSessionId);          

            req.eBay.orderApi.placeGuestOrder(checkoutSessionId,next);
          }
      ],
        function(error,data,response,next) { 

          if (error) {

            console.log('Error in Search');
            console.log(prettyjson.render(error));
              
            res.render('error',{message:  error.response.text});

          } else {

            console.log('Data received during placeGuestOrder call');
            console.log(prettyjson.render(data));

            res.redirect('/guest_checkout/view_order/' + data.purchaseOrderId);     
          }
      }); 
});

/**********************************************************/
// View Order Guest Checkout Page
/**********************************************************/

router.get('/view_order/:purchaseOrderId', function(req, res, next) {
    async.waterfall([
          function(next) {
            var purchaseOrderId = req.params.purchaseOrderId;
            console.log('Calling getGuestPurchaseOrder API ' + purchaseOrderId);
            req.eBay.orderApi.getGuestPurchaseOrder(purchaseOrderId, next);
          }
      ],
        function(error,data,response,next) { 

          if (error) {
            console.log('Error in Search');
            console.log(prettyjson.render(error));              
            res.render('error',{message:  error.response.text});
          } else {
            console.log('Data received during search call');
            console.log(prettyjson.render(data));     

            var local = {};
            local.data = data;
            local.req = req;
            res.render('guest_checkout/view_order', local);
          }
      }); 
});


module.exports = router;
