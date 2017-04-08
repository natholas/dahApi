var entrepreneurs = require('../helpers/entrepreneurs');
var connection = require('../helpers/connection');
var orders = require('../helpers/orders');
var jwt = require('jsonwebtoken');
var configs = require('../configs');
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
    entrepreneurId: {
      type: 'integer'
    },
    amount: {
      type: 'float',
      min: 1
    },
    donationAmount: {
      type: 'float',
      min: 0
    },
    message: {
      type: 'string',
      maxLength: 280
    }
  },
  required: ['visitorToken', 'loginToken', 'entrepreneurId', 'amount', 'donationAmount', 'message']
};

ex.func = function(params, callback) {

  // Validating the order that we want to make
  orders.validate(params.entrepreneurId, params.amount, function(response) {
    if (!response) {
      callback({error: 'INVALID_ENTREPRENEURID'});
      return;
    }

    // Decoding the loginToken to get the userId
    var decoded = jwt.verify(params.loginToken, configs.key);

    // Creating the order
    orders.create(
      decoded.userId,
      params.entrepreneurId,
      params.amount,
      params.donationAmount,
      params.message,
      function(orderId) {
        if (!orderId) {
          callback({error: 'COULDNT_CREATE_ORDER'});
          return;
        }
        else orders.init(orderId, params.amount, params.donationAmount, function(response) {
          if (response) callback(response);
          else callback({error: 'COULDNT_INIT_PAYMENT'});
        });
      }
    );
  });
};

module.exports = ex;
