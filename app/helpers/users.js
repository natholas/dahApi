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
  connection.query('SELECT password, id FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    callback(!!(!error && rows.length && passwordHash.verify(password, rows[0].password)));
  });
};

users.exists = function (emailAddress, callback) {
  connection.query('SELECT id FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    callback(!!rows.length);
  });
};

module.exports = users;
