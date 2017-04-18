var jwt = require('jsonwebtoken');
var configs = require('../configs');
var passwordHash = require('password-hash');
var users = require('../helpers/users');
var functions = require('../helpers/functions');

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
    userId: {
      type: 'integer'
    },
    emailAddress: {
      type: 'string',
      minLength: 7,
      maxLength: 64,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$'
    },
    reverifyEmail: {
      type: 'boolean'
    },
    role: {
      type: 'string',
      enum: ['USER', 'ADMIN', 'SUPER']
    },
    status: {
      type: 'string',
      enum: ['ACTIVE', 'BLOCKED']
    },
    nickname: {
      type: 'string',
      minLength: 5,
      maxLength: 20
    },
    address: {
      type: 'string',
      minLength: 5,
      maxLength: 120
    },
    password: {
      type: 'string',
      minLength: 5,
      maxLength: 128
    },
    publicStatus: {
      type: 'string',
      enum: ['PUBLIC', 'PRIVATE']
    }
  },
  required: ['visitorToken', 'loginToken', 'userId', 'reverifyEmail']
};

ex.func = function(params, callback) {
  var changes = {};
  for (var i in params) {
    if (i == 'visitorToken' || i == 'loginToken' || i == 'reverifyEmail') continue;
    if (ex.validation.properties[i]) changes[i] = params[i];
  }

  if (changes.password) changes.password = passwordHash.generate(changes.password);
  if (changes.emailAddress) {
    if (params.reverifyEmail) changes.emailVerified = false;
    users.exists(changes.emailAddress, function(response) {
      if (!response) users.doChanges(params, changes, true, callback);
      else callback({error: 'EMAILADDRESS_NOT_UNIQUE'});
    });
  }

  users.doChanges(params, changes, params.reverifyEmail, callback);

};

module.exports = ex;
