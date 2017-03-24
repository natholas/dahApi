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
  required: ['visitorToken', 'loginToken']
};

ex.func = function(params, callback) {
  var changes = {};
  for (var i in params) {
    if (i == 'visitorToken' || i == 'loginToken') continue;
    if (ex.validation.properties[i]) changes[i] = params[i];
  }

  if (changes.password) changes.password = passwordHash.generate(changes.password);
  if (changes.emailAddress) changes.emailVerified = false;

  if (!objSize(changes)) callback({error: 'NOTHING_TO_CHANGE'});
  else {
    var userId = jwt.verify(params.loginToken, configs.key).userId;
    users.update(userId, changes, function(response) {
      if (!response) callback({error: 'UPDATE_FAILED'});
      else {
        if (changes.emailAddress && params.reverifyEmail) {
          users.sendEmailConfirmation(userId, changes.emailAddress, function(response) {
            if (response) callback({status: true});
            else callback({error: 'UPDATED_BUT_EMAIL_FAILED_TO_SEND'});
          });
        }
        else callback(response);
      }
    });
  }

};

module.exports = ex;
