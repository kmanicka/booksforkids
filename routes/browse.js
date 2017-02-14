var express = require('express');
var router = express.Router();

/* GET item. */
router.get('/item', function(req, res, next) {
  res.render('item', { title: 'Express' });
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
