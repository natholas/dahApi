var connection = require('./connection');
var entrepreneurs = {};

entrepreneurs.getAllByStatus = function (status, callback) {
  connection.query('SELECT * FROM entrepreneur WHERE status = ?', [status], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

entrepreneurs.getById = function (id, callback) {
  connection.query('SELECT * FROM entrepreneur WHERE entrepreneurId = ?', [id], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

entrepreneurs.add = function (name, description, dob, city, countryId, status, teamId, callback) {
  connection.query(
    'INSERT INTO entrepreneur (name, description, dob, city, countryId, status, teamId) VALUES (?,?,?,?,?,?,?)',
    [name, description, dob, city, countryId, status, teamId], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

module.exports = entrepreneurs;
