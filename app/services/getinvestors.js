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
    entrepreneurId: {
      type: 'integer'
    }
  },
  required: ['visitorToken', 'entrepreneurId']
};

ex.func = function(params, callback) {
  entrepreneurs.getInvestors(params.entrepreneurId, function(response) {
    console.log(response);
    if (!response || !response.length) {
      callback({error: 'ENTREPRENEUR_NOT_FOUND'});
    }
    else callback({investors: response});

  });
};

module.exports = ex;
