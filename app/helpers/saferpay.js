var request = require('request');
var connection = require('./connection');
var configs = require('../configs');
var saferpay = {};

var baseUrl = 'https://test.saferpay.com/api';

saferpay.init = function (orderId, amount, requestId, callback) {
  var params = {
    "RequestHeader": {
      "SpecVersion": "1.3",
      "CustomerId": "404298",
      "RequestId": requestId,
      "RetryIndicator": 0
    },
    "TerminalId": "17809541",
    "Payment": {
      "Amount": {
        "Value": amount * 100,
        "CurrencyCode": "CHF"
      },
      "OrderId": orderId,
      "Description": "Investment"
    },
    "ReturnUrls": {
      "Success": "http://google.com",
      "Fail": "http://yahoo.com"
    }
  }

  request.post({
    url: baseUrl + '/Payment/v1/PaymentPage/Initialize',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(configs.auth.username + ':' + configs.auth.password).toString('base64')
    },
    body: JSON.stringify(params),
  }, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (response.statusCode == 200) callback(body);
      else {
        callback(false);
      }
    } catch(error) {
      callback(false);
    }
  });
}

module.exports = saferpay;
