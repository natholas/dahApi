var jwt = require('jsonwebtoken');
var configs = require('../configs');
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
  if (!objSize(changes)) callback({error: 'NOTHING_TO_CHANGE'});
  else users.update(jwt.verify(params.loginToken, configs.key).userId, changes, function(response) {
    if (!response) callback({error: 'UPDATE_FAILED'});
    else callback(response);
  });

};

module.exports = ex;
