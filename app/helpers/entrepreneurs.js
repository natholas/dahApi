var connection = require('./connection');
var entrepreneurs = {};

entrepreneurs.getAllByStatus = function (status, callback) {
  var sql = 'SELECT * FROM entrepreneur WHERE status = ?';
  if (status == 'ALL') sql = 'SELECT * FROM entrepreneur';
  connection.query(sql, [status], function(error, rows, fields) {
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
    'UPDATE entrepreneurs SET name = ?, description = ?, dob = ?, city = ?, countryId = ?, amountNeeded = ?, status = ?, teamId = ? WHERE entrepreneurId = ?',
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

entrepreneurs.checkIfCompleted = function (entrepreneurId) {
  connection.query('SELECT * FROM entrepreneur WHERE entrepreneurId = ?', [entrepreneurId], function(error, rows, fields) {
    if (error || !rows.length) console.log(error);
    else {
      var entrepreneur = rows[0];
      if (entrepreneur.totalInvested >= entrepreneur.amountNeeded) {
        connection.query('UPDATE entrepreneurs SET status = "FUNDED", fundedTime = CURRENT_TIMESTAMP WHERE entrepreneurId = ?', [entrepreneurId], function(error) {
          if (error) console.log(error);
        });
      }
    }
  });
};

module.exports = entrepreneurs;
