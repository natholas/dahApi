var passwordHash = require('password-hash');
var connection = require('./connection');

var users = {};

users.create = function(emailAddress, password, callback) {
  var hash = passwordHash.generate(password);
  connection.query('INSERT INTO users (emailAddress, password, role) VALUES (?, ?, "USER")', [emailAddress, hash, 'USER'], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(true);
  });
};

users.login = function (emailAddress, password, callback) {
  connection.query('SELECT userId, password, role FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    if (!error && rows.length && passwordHash.verify(password, rows[0].password)) {
      callback({userId: rows[0].userId, role: rows[0].role});
    } else {
      callback(false);
    }
  });
};

users.exists = function (emailAddress, callback) {
  connection.query('SELECT userId FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    callback(!!rows.length);
  });
};

module.exports = users;
