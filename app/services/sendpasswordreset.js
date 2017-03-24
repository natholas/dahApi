var jwt = require('jsonwebtoken');
var users = require('../helpers/users');
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
    }
  },
  required: ['visitorToken', 'emailAddress']
};

ex.func = function(params, callback) {
  users.exists(params.emailAddress, function(userId) {
    if (userId) {
      users.sendResetEmail(userId, params.emailAddress, function(response) {
        if (response) callback({sent: true});
        else callback({error: 'EMAIL_COULD_NOT_BE_SENT'});
      });
    }
    else callback({error: 'EMAIL_ADDRESS_NOT_FOUND'});
  });
};

module.exports = ex;
