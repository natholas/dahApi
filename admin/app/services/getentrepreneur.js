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
  entrepreneurs.getById(params.entrepreneurId, function(response) {

    if (!response || !response.length) {
      callback({error: 'ENTREPRENEUR_NOT_FOUND'});
    }
    else {
      var entrepreneur = response[0];
      if (
        entrepreneur.status != 'DRAFT' ||
        (
          params.loginToken &&
          jwt.verify(params.loginToken, configs.key).role == 'ADMIN'
        )
      ) callback(entrepreneur);
      else callback({error: 'ENTREPRENEUR_NOT_FOUND'});
    }


  });
};

module.exports = ex;
