var connection = require('./helpers/connection');
var configs = require('./configs');

module.exports = function (req, callback) {
  if (req.query.orderId) {
    connection.query('UPDATE orders SET status = "CANCELLED" WHERE status != "DONE" AND orderId = ?', [req.query.orderId]);
  }
  callback(configs.frontendUrl + 'paymentfailed');
};
