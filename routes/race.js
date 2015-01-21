var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('race', { title: 'Race' });
});

module.exports = router;
