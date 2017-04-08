var connection = require('../helpers/connection');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    }
  },
  required: ['visitorToken']
};
var stats = {};

var getStatistics = function() {
  var response = {};
  connection.query('SELECT status, COUNT(*) as "count" FROM entrepreneurs WHERE status != "DRAFT" GROUP BY STATUS', [], function(error, rows) {
    response.entrepreneurs = {};
    for (var i in rows) {
      response.entrepreneurs[rows[i].status] = rows[i].count;
    }
    doCallback();
  });

  connection.query('SELECT SUM(amount) AS amount FROM orders WHERE status = "DONE"', [], function(error, rows) {
    response.totalInvested = rows[0].amount;
    doCallback();
  });

  connection.query('SELECT SUM(donationAmount) AS donationAmount FROM orders WHERE status = "DONE"', [], function(error, rows) {
    response.totalDonated = rows[0].donationAmount;
    doCallback();
  });

  connection.query('SELECT COUNT(*) AS users FROM users', [], function(error, rows) {
    response.users = rows[0].users;
    doCallback();
  });

  connection.query('SELECT COUNT(*) AS orders FROM orders WHERE status = "DONE"', [], function(error, rows) {
    response.orders = rows[0].orders;
    doCallback();
  });

  doCallback = function () {
    if (
      response.entrepreneurs &&
      response.totalInvested &&
      response.totalDonated &&
      response.users &&
      response.orders
    ) {
      stats = JSON.parse(JSON.stringify(response));
    }
  };
};

getStatistics();

setInterval(function () {
  getStatistics();
}, 1000 * 60 * 10);

ex.func = function(params, callback) {
  callback(stats);
};

module.exports = ex;
