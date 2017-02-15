var express = require('express');
var router = express.Router();
var async = require('async');
var EBayBuyApi = require('e_bay_buy_api');


/* GET item. */
router.get('/item/:itemId', function(req, res, next) {

    var itemId = req.params.itemId;

	var api = new EBayBuyApi.BrowseApi()

	// setting up the Authorization for the api call. 
	EBayBuyApi.ApiClient.instance.authentications['OauthSecurity'].apiKey = req.eBayConfig.superAuthToken;

    async.waterfall([
	        function(next) {
	        	 console.log('Calling getItem API ' + itemId);
				 api.getItem(itemId, next);
	        }
	    ],
       	function(error,data,response,next) { 

	        if (error) {
	            res.render('error',{message:  error.response.text});
	        } else {
			    res.render('item', { title: data.title });
	        }

	    }); 
});

/* GET search. */
router.get('/item_group', function(req, res, next) {
  res.render('item_group', { title: 'Express' });
});

/* GET search. */
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Express' });
});


module.exports = router;
