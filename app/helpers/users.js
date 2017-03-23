var passwordHash = require('password-hash');
var connection = require('./connection');

var users = {};

users.create = function(emailAddress, nickname, password, publicStatus, callback) {
  var hash = passwordHash.generate(password);
  connection.query('INSERT INTO users (emailAddress, nickname, password, publicStatus, role) VALUES (?, ?, ?, ?, "USER")', [emailAddress, nickname, hash, publicStatus, 'USER'], function(error, rows, fields) {
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

users.update = function (userId, changes, callback) {
  var string = "";
  var variables = [];

  for (var i in changes) {
    string += i + ' = ?, ';
    variables.push(changes[i]);
  }
  string = string.substring(0, string.length - 2);
  variables.push(userId);
  connection.query('UPDATE users SET ' + string + ' WHERE userId = ?', variables, function(error, rows, fields) {
    if (error) console.log(error);
    callback({status: !error});
  });
};

users.exists = function (emailAddress, callback) {
  connection.query('SELECT userId FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    if (error) console.log(error);
    callback(!!rows.length);
  });
};

module.exports = users;
