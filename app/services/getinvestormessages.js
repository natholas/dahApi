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
    entrepreneurId: {
      type: 'integer'
    }
  },
  required: ['visitorToken', 'entrepreneurId']
};

ex.func = function(params, callback) {
  entrepreneurs.getInvestorMessages(params.entrepreneurId, function(response) {

    if (!response || !response.length) {
      callback({error: 'ENTREPRENEUR_NOT_FOUND'});
    }
    else callback({messages: response});


  });
};

module.exports = ex;
