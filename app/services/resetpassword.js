var passwordHash = require('password-hash');
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
    passwordResetToken: {
      type: 'string'
    },
    newPassword: {
      type: 'string',
      minLength: 5,
      maxLength: 128
    }
  },
  required: ['visitorToken', 'passwordResetToken', 'newPassword']
};

ex.func = function(params, callback) {
  try {
    var data = jwt.verify(params.passwordResetToken, configs.key);
    if (data.passwordResetEmail) {
      changes = {password: passwordHash.generate(params.newPassword)};
      users.update(data.userId, changes, function(response) {
        if (response) callback({updated: true});
        else callback({error: 'UNABLE_TO_UPDATE_PASSWORD'});
      });
    }
    else callback({error: 'PASSWORDRESETTOKEN_NOT_VALID'})
  }
  catch(error) {
    callback({error: 'PASSWORDRESETTOKEN_NOT_VALID'});
  }
};

module.exports = ex;
