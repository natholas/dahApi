var connection = require('../helpers/connection');

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
  connection.query('SELECT orders.*, entrepreneurs.name FROM orders JOIN entrepreneurs ON entrepreneurs.entrepreneurId = orders.orderId', [], function(error, rows) {
    if (error) console.log(error);
    else callback(rows);
  });
};

module.exports = ex;
