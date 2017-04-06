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
      enum: ['DRAFT', 'LIVE', 'FUNDED', 'ALL']
    }
  },
  required: ['visitorToken', 'status']
};

ex.func = function(params, callback) {
  var status = 'LIVE';

  if (['LIVE', 'FUNDED'].indexOf(params.status) > -1) {
    status = params.status;
  } else if (params.loginToken) {
    var role = jwt.verify(params.loginToken, configs.key).role;
    if (['ADMIN', 'SUPER'].indexOf(role) > -1) {
      status = params.status;
    }
  }
  entrepreneurs.getAllByStatus(status, function(response) {
    callback({status: status, entrepreneurs: response});
  });
};

module.exports = ex;
