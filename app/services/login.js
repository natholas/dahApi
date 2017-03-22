var jwt = require('jsonwebtoken');
var users = require('../helpers/users');
var functions = require('../helpers/functions');
var configs = require('../configs');

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
      minLength: 5,
      maxLength: 128
    }
  },
  required: ['visitorToken', 'emailAddress', 'password']
};

ex.func = function(params, callback) {
  users.login(params.emailAddress, params.password, function(response) {
    if (!response) callback({error: 'DATA_DOESNT_MATCH_AN_EXISTING_ACCOUNT'});
    else callback({loginToken: jwt.sign({loginToken: functions.randomString(32)}, configs.key)});
  });
};

module.exports = ex;
