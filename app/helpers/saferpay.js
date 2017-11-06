var request = require('request');
var connection = require('./connection');
var configs = require('../configs');
var saferpay = {};

saferpay.init = function (orderId, amount, donationAmount, requestId, callback) {
  var params = {
    "RequestHeader": {
      "SpecVersion": "1.3",
      "CustomerId": "404298",
      "RequestId": requestId,
      "RetryIndicator": 0
    },
    "TerminalId": "17809558",
    "Payment": {
      "Amount": {
        "Value": (amount + donationAmount) * 100,
        "CurrencyCode": "EUR"
      },
      "OrderId": orderId,
      "Description": amount + " eur investment. " + donationAmount + " eur donation"
    },
    "ReturnUrls": {
      "Success": configs.backendUrl + 'paymentcomplete?requestId=' + requestId + '&orderId=' + orderId,
      "Fail": configs.backendUrl + 'paymentfailed?orderId=' + orderId
    },
    "Styling": {
      "CssUrl": 'https://dignityhope.org/saferpay.css'
    }
  };

  var body = {
    url: configs.saferpayUrl + '/Payment/v1/PaymentPage/Initialize',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(configs.auth.username + ':' + configs.auth.password).toString('base64')
    },
    body: JSON.stringify(params),
  };

  request.post(body, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (response.statusCode == 200) callback(body);
      else callback(false);
    } catch(error) {
      callback(false);
    }
  });
};

saferpay.assert = function (token, requestId, callback) {
  var params = {
    "RequestHeader": {
      "SpecVersion": "1.3",
      "CustomerId": "404298",
      "RequestId": requestId,
      "RetryIndicator": 0
    },
    "Token": token
  };

  request.post({
    url: configs.saferpayUrl + '/Payment/v1/PaymentPage/Assert',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(configs.auth.username + ':' + configs.auth.password).toString('base64')
    },
    body: JSON.stringify(params),
  }, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (response.statusCode == 200) callback(body);
      else callback(false);
    } catch(error) {
      callback(false);
    }
  });
};

saferpay.capture = function (transactionId, requestId, callback) {
  var params = {
    "RequestHeader": {
      "SpecVersion": "1.3",
      "CustomerId": "404298",
      "RequestId": requestId,
      "RetryIndicator": 0
    },
    "TransactionReference": {
      "TransactionId": transactionId
    }
  };

  request.post({
    url: configs.saferpayUrl + '/Payment/v1/Transaction/Capture',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(configs.auth.username + ':' + configs.auth.password).toString('base64')
    },
    body: JSON.stringify(params),
  }, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (response.statusCode == 200) callback(body);
      else callback(false);
    } catch(error) {
      callback(false);
    }
  });
};

saferpay.cancel = function (transactionId, requestId, callback) {
  var params = {
    "RequestHeader": {
      "SpecVersion": "1.3",
      "CustomerId": "404298",
      "RequestId": requestId,
      "RetryIndicator": 0
    },
    "TransactionReference": {
      "TransactionId": transactionId
    }
  };

  request.post({
    url: configs.saferpayUrl + '/Payment/v1/Transaction/Cancel',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(configs.auth.username + ':' + configs.auth.password).toString('base64')
    },
    body: JSON.stringify(params),
  }, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (response.statusCode == 200) callback(body);
      else callback(false);
    } catch(error) {
      callback(false);
    }
  });
};

module.exports = saferpay;
