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
  required: ['visitorToken']
};

ex.func = function(params, callback) {
  var status = 'LIVE';
  if (params.loginToken) {
    var role = jwt.verify(params.loginToken, configs.key).role;
    if (['ADMIN', 'SUPER'].indexOf(status) > -1 && params.status) status = params.status;
  }
  entrepreneurs.getAllByStatus(status, function(response) {
    callback({status: status, entrepreneurs: response});
  });
};

module.exports = ex;
