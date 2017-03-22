var connection = require('./connection');
var entrepreneurs = {};

entrepreneurs.getAllByStatus = function (status, callback) {
  connection.query('SELECT * FROM entrepreneurs WHERE status = ?', [status], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

module.exports = entrepreneurs;
