var connection = require('./connection');
var entrepreneurs = require('./entrepreneurs');
var saferpay = require('../helpers/saferpay');
var functions = require('../helpers/functions');
var orders = {};

orders.validate = function (entrepreneurId, amount, callback) {
  entrepreneurs.getById(entrepreneurId, function(response) {
    if (response && response.length) {
      var entrepreneur = response[0];
      var moneyNeeded = entrepreneur.amountNeeded - entrepreneur.totalInvested;
      if (entrepreneur.status == 'LIVE' && moneyNeeded >= amount) {
        callback(entrepreneur);
      } else callback(false);
    }
    else callback(false);
  });
};

orders.create = function (userId, entrepreneurId, amount, donationAmount, message, callback) {
  connection.query(
  'INSERT INTO orders (userId, entrepreneurId, amount, donationAmount, status, message) VALUES (?,?,?,?,"INIT",?)',
  [userId, entrepreneurId, amount, donationAmount, message], function(error, rows, fields) {
    if (error) callback(false);
    else callback(rows.insertId);
  });
};

orders.init = function (orderId, amount, donationAmount, callback) {
  orders.request(orderId, 'INIT', null, function(requestId) {
    if (requestId) saferpay.init(orderId, amount, donationAmount, requestId, function(response) {
      if (!response) {
        orders.cancel(orderId);
        callback(false);
      }
      else {
        orders.addTokenToRequest(requestId, response.Token);
        callback(response);
      }
    });
    else callback(false);
  });
};

orders.assert = function (orderId, token, callback) {
  orders.request(orderId, 'ASSERT', null, function(requestId) {
    if (requestId) saferpay.assert(token, requestId, function(response) {
      if (!response) {
        callback(false);
      }
      else if (response.Transaction.Status == 'AUTHORIZED') {
        orders.addOrderDetails(orderId, response.Transaction, response.PaymentMeans);
        callback(response);
      }
      else {
        callback(false);
      }
    });
    else callback(false);
  });
};

orders.complete = function (orderId, transactionId, callback) {
  orders.request(orderId, 'CAPTURE', null, function(requestId) {
    if (requestId) saferpay.capture(transactionId, requestId, function(response) {
      if (response && response.OrderId == orderId) {
        connection.query('UPDATE orders SET status = "DONE" WHERE orderId = ?', [orderId], function(error, rows, fields) {
          if (error) console.log(error);
          else {
            entrepreneurs.sendOrderConfirmationEmail(orderId);
            callback(true);
          }
        });
      }
      else callback(false);
    });
    else callback(false);
  });
};

orders.request = function (orderId, type, token, callback) {
  var requestId = functions.randomString(32);
  connection.query('INSERT INTO saferPayLog (orderId, requestId, token, requestType) VALUES (?,?,?,?)',
  [orderId, requestId, token, type], function(error, rows, fields) {
    callback(!error ? requestId : false);
  });
};

orders.addTokenToRequest = function (requestId, token) {
  connection.query('UPDATE saferPayLog SET token = ? WHERE requestId = ?', [token, requestId]);
};

orders.addOrderDetails = function (orderId, transaction, paymentMeans) {
  connection.query('UPDATE orders SET transactionId = ?, displayText = ? WHERE orderId = ?', [transaction.Id, paymentMeans.DisplayText, orderId]);
};

orders.cancel = function (orderId) {
  connection.query('UPDATE orders SET status = "CANCELLED" WHERE orderId = ? AND status != "DONE"', [orderId]);
};

module.exports = orders;
