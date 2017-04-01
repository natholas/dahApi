var connection = require('./helpers/connection');
var orders = require('./helpers/orders');
var functions = require('./helpers/functions');
var entrepreneurs = require('./helpers/entrepreneurs');
var configs = require('./configs');

module.exports = function (req, callback) {
  if (!req.query.requestId || !req.query.orderId) {
    callback(configs.frontendUrl + 'paymentfailed');
  }
  else {
    connection.query(
      'SELECT saferPayLog.token, orders.entrepreneurId FROM saferPayLog JOIN orders ON orders.orderId = saferPayLog.orderId WHERE orders.status = "INIT" AND saferPayLog.orderId = ? AND saferPayLog.requestId = ? AND saferPayLog.token IS NOT NULL',
      [req.query.orderId*1, req.query.requestId], function(error, rows, fields) {
      if (error || !rows.length) {
        callback(configs.frontendUrl + 'paymentfailed');
      }
      else {
        var result = rows[0];
        // Checking payment with datatrans
        orders.assert(req.query.orderId, result.token, function(response) {
          if (response) {

            // Completing the payment
            orders.complete(req.query.orderId, response.Transaction.Id, function (response) {
              if (!response) {
                orders.cancel(req.query.orderId);
                callback(configs.frontendUrl + 'paymentfailed');
              }
              else {
                entrepreneurs.checkIfCompleted(result.entrepreneurId);
                callback(configs.frontendUrl + 'confirmation');
              }
            });
          }
          else {
            orders.cancel(req.query.orderId);
            callback(configs.frontendUrl + 'paymentfailed');
          }
        });
      }
    });
  }
};
