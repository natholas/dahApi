var express = require('express');
var router = express.Router();

router.get('/healthcheck', function(req, res) {
  var response = 'Ok';
  res.send(response);
});

module.exports = router;
