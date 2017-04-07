var jwt = require('jsonwebtoken');
var configs = require('../configs');
var functions = require('../helpers/functions');
var tokens = require('../helpers/tokens');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {}
};

ex.func = function(params, callback) {
  // Creating the visitorToken (32 digit string)
  callback({visitorToken: jwt.sign({
    tokenId: tokens.getId('VISITOR'),
    visitorToken: functions.randomString(32)
  }, configs.key)
  });
};

module.exports = ex;
