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
    loginToken: {
      type: 'string'
    }
  },
  required: ['visitorToken', 'loginToken']
};

ex.func = function(params, callback) {
  var user = jwt.verify(params.loginToken, configs.key);
  users.getOrders(user.userId, function(response) {
    if (response) callback({orders: response});
    else callback({error: 'COULD_NOT_GET_ORDERS'});
  });
};

module.exports = ex;
