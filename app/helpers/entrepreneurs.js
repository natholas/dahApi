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

entrepreneurs.add = function (name, description, dob, city, countryId, amountNeeded, status, teamId, callback) {
  connection.query(
    'INSERT INTO entrepreneurs (name, description, dob, city, countryId, amountNeeded, status, teamId) VALUES (?,?,?,?,?,?,?,?)',
    [name, description, dob, city, countryId, amountNeeded, status, teamId], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

entrepreneurs.update = function (entrepreneurId, name, description, dob, city, countryId, amountNeeded, status, teamId, callback) {
  connection.query(
    'UPDATE entrepreneur SET name = ?, description = ?, dob = ?, city = ?, countryId = ?, amountNeeded = ?, status = ?, teamId = ? WHERE entrepreneurId = ?',
    [name, description, dob, city, countryId, amountNeeded, status, teamId, entrepreneurId], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

entrepreneurs.getInvestors = function (entrepreneurId, callback) {
  connection.query(
    'SELECT * FROM investors WHERE entrepreneurId = ?', [entrepreneurId], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

module.exports = entrepreneurs;
