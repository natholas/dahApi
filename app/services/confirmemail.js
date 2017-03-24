var jwt = require('jsonwebtoken');
var configs = require('../configs');
var users = require('../helpers/users');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    emailConfirmToken: {
      type: 'string'
    }
  },
  required: ['visitorToken', 'emailConfirmToken']
};

ex.func = function(params, callback) {
  try {
    var decoded = jwt.verify(params.emailConfirmToken, configs.key);
    if (decoded.emailToConfirm && decoded.userId) {
      users.exists(decoded.emailToConfirm, function(response) {
        if (response) {
          if (response == decoded.userId) {
            users.update(decoded.userId, {emailVerified: true}, function(response) {
              if (response) {
                callback({updated: true});
              }
              else callback({error: 'UNKNOWN_ERROR'});
            });
          }
          else callback({error: 'EMAILADDRESS_NOT_ON_CORRECT_USER'});
        }
        else callback({error: 'EMAILADDRESS_NOT_FOUND'});
      });
    }
    else callback({error: 'EMAILTOCONFIRMTOKEN_NOT_VALID'});
  }
  catch(err) {
    callback({error: 'EMAILTOCONFIRMTOKEN_NOT_VALID'});
  }
};

module.exports = ex;
