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
  users.exists(params.emailAddress, function(response) {
    if (response) callback({error: 'ACCOUNT_ALREADY_EXISTS'});
    else users.create(params.emailAddress, params.password, function(response) {
      callback(response);
    });
  });
};

module.exports = ex;
