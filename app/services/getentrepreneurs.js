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
  var status = 'DRAFT';
  if (role == 'ADMIN') status = params.status;

  entrepreneurs.getAllByStatus(status, function(response) {
    callback(response);
  });
};

module.exports = ex;
