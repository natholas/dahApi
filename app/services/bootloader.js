var jwt = require('jsonwebtoken');
var configs = require('../configs');
var functions = require('../helpers/functions');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {}
};

ex.func = function(params, callback) {
  // Creating the visitorToken (32 digit string)
  callback({visitorToken: jwt.sign({visitorToken: functions.randomString(32)}, configs.key)});
};

module.exports = ex;
