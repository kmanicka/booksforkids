var express = require('express');
var router = express.Router();
var async = require('async');
var prettyjson = require('prettyjson');
var EBayBuyApi = require('e_bay_buy_api');

/**********************************************************/
// Home Page
/**********************************************************/
router.get('/home', function(req, res, next) {
  res.render('browse/home', { title: 'Express' });
});


/**********************************************************/
// Item Group Page
/**********************************************************/
router.get('/item_group', function(req, res, next) {
  res.render('browse/item_group', { title: 'Express' });
});


/**************************************************************************************************/
// Search Page
/**************************************************************************************************/
router.get('/search', function(req, res, next) {

  async.waterfall([
        function(next) {
			  var q = req.query.q;
              console.log('Calling search API ' + q);

			  /********************************************************/
			  // start setup filters
			  // TODO refer to following link and build a better search filtering experience. 
			  // http://developer.ebay.com/devzone/rest/api-ref/browse/search-filters.html
			  // setup the filters  
			  var filter = [];

			  // processing the condition filter
			  if(req.query.condition) {
			  	filter.push('conditions:' + req.query.condition);
			  }			  

			  // processing the price filter.
			  if(req.query.price){
			  	filter.push('price:' + req.query.price);
			  	filter.push('priceCurrency:USD');
			  }
			  // end setup filters
			  /********************************************************/

			  var opts = { 
				  'categoryIds': "", // String | category id
				  'limit': req.query.limit, // String | Limit for Pagination
				  'offset': req.query.offset, // String | Offset for Pagination
				  'filter': filter, // [String] | Filter Field
				  'sort': [] // [String] | Sort Field
				};

			  req.eBay.browseApi.searchForItems(q, opts, next);
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

        	/*****************************************************/
        	// post process response elements for web presentation

        	// prepare the previous url offset
        	if(data.prev){
        		console.log(data.prev);
        		var prev_offset = parseInt(req.query.offset) - parseInt(req.query.limit);
        		data.prev_url = 'q=' + req.query.q + '&limit=' + req.query.limit + '&offset=' + prev_offset;	        	
	        	if(req.query.condition) data.prev_url += '&condition=' + req.query.condition;
				if(req.query.price) data.prev_url += '&price=' + req.query.price;				  
			}

        	// prepare the next url offset
        	if(data.next){
        		console.log(data.next);
        		var next_offset = parseInt(req.query.offset) + parseInt(req.query.limit);
        		data.next_url = 'q=' + req.query.q + '&limit=' + req.query.limit + '&offset=' + next_offset;	        	
	        	if(req.query.condition) data.next_url += '&condition=' + req.query.condition;
				if(req.query.price) data.next_url += '&price=' + req.query.price;				  
        	}
        	/*****************************************************/

        	var local = {};
        	local.data = data;
        	local.req = req;

		    res.render('browse/search', local);
        }

    }); 
});


/**************************************************************************************************/
// View Item Page
/**************************************************************************************************/
router.get('/item/:itemId', function(req, res, next) {
    async.waterfall([
	        function(next) {
			    var itemId = req.params.itemId;
	        	console.log('Calling getItem API ' + itemId);


				req.eBay.browseApi.getItem(itemId, next);
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
			    res.render('browse/item', local);

	        }

	    }); 
});

module.exports = router;

