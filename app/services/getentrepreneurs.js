var jwt = require('jsonwebtoken');
var configs = require('../configs');
var entrepreneurs = require('../helpers/entrepreneurs');
var users = require('../helpers/users');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    loginToken: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['DRAFT', 'LIVE']
    }
  },
  required: ['visitorToken', 'loginToken']
};

ex.func = function(params, callback) {
  var role = jwt.verify(params.loginToken, configs.key).role;
  var status = 'LIVE';
  if (role == 'ADMIN' && params.status) status = params.status;
  entrepreneurs.getAllByStatus(status, function(response) {
    callback({status: status, entrepreneurs: response});
  });
};

module.exports = ex;
