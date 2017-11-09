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
  entrepreneurs.getChildren(params.entrepreneurId, function(response) {

    if (!response) {
      callback({error: 'ENTREPRENEUR_NOT_FOUND'});
    }
    else {
      var output = [];
      for (var entrepreneur of response) {
        if (
          entrepreneur.status != 'DRAFT' ||
          (
            params.loginToken &&
            ['ADMIN', 'SUPER'].indexOf(jwt.verify(params.loginToken, configs.key).role) > -1
          )
        ) {
          output.push(entrepreneur.entrepreneurId);
        }
      }
      callback({children: output});
    }
  });
};

module.exports = ex;
