var users = require('../helpers/users');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    emailAddress: {
      type: 'string',
      minLength: 7,
      maxLength: 64,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$'
    },
    nickname: {
      type: 'string',
      minLength: 5,
      maxLength: 20
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
  required: ['visitorToken', 'emailAddress', 'nickname', 'password', 'publicStatus']
};

ex.func = function(params, callback) {
  users.exists(params.emailAddress, function(response) {
    if (response) callback({error: 'ACCOUNT_ALREADY_EXISTS'});
    else users.create(params.emailAddress, params.nickname, params.password, params.publicStatus, function(response) {
      callback(response);
    });
  });
};

module.exports = ex;
