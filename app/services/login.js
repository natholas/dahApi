var jwt = require('jsonwebtoken');
var configs = require('../configs');
var users = require('../helpers/users');
var functions = require('../helpers/functions');
var tokens = require('../helpers/tokens');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    emailAddress: {
      type: 'string',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$'
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 128
    }
  },
  required: ['visitorToken', 'emailAddress', 'password']
};

ex.func = function(params, callback) {
  users.login(params.emailAddress, params.password, function(response) {
    if (!response) callback({error: 'DATA_DOESNT_MATCH_AN_EXISTING_ACCOUNT'});
    else {
      tokens.getId('LOGIN', response.userId, function(id) {
        callback({
          loginToken: jwt.sign({
            tokenId: id,
            loginToken: functions.randomString(32),
            userId: response.userId,
            role: response.role
          }, configs.key),
          userId: response.id,
          role: response.role,
          userDetails: response.userDetails
        });
      });
    }
  });
};

module.exports = ex;
