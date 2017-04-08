var jwt = require('jsonwebtoken');
var configs = require('../configs');
var email = require('../helpers/email');
var functions = require('../helpers/functions');
var passwordHash = require('password-hash');
var connection = require('./connection');
var tokens = require('./tokens');
var templates = require('./templates');

var users = {};

users.create = function(emailAddress, nickname, password, publicStatus, callback) {
  var hash = passwordHash.generate(password);
  connection.query('INSERT INTO users (emailAddress, nickname, password, publicStatus, role) VALUES (?, ?, ?, ?, "USER")', [emailAddress, nickname, hash, publicStatus, 'USER'], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows.insertId);
  });
};

users.login = function (emailAddress, password, callback) {
  connection.query('SELECT * FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    if (error || !rows.length || !passwordHash.verify(password, rows[0].password)) {
      callback(false);
      return;
    }
    var user = rows[0];
    if (user.status != 'ACTIVE') {
      callback(false);
      return;
    }
    connection.query('UPDATE users SET lastLoginTime = CURRENT_TIMESTAMP WHERE userId = ?', [user.userId]);
    callback({
      userId: user.userId,
      role: user.role,
      userDetails: {
        emailAddress: user.emailAddress,
        emailVerified: user.emailVerified,
        nickname: user.nickname,
        publicStatus: user.publicStatus
      }
    });

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
    callback(!error);
  });
};

users.exists = function (emailAddress, callback) {
  connection.query('SELECT userId FROM users WHERE emailAddress = ?', [emailAddress], function(error, rows, fields) {
    if (error) console.log(error);
    callback(rows.length ? rows[0].userId : false);
  });
};

users.sendEmailConfirmation = function (userId, emailAddress, callback, signup) {
  var token = jwt.sign({
    tokenId: tokens.getId('EMAIL_CONFIRMATION', userId),
    emailToConfirm: emailAddress,
    userId: userId
  }, configs.key);

  var url = configs.frontendUrl + 'confirmemail?emailConfirmToken=' + token;
  var emailContent = templates.newemail;
  if (signup) emailContent = templates.signup;
  emailContent = emailContent.split('@url@').join(url);
  var subject = 'Verify your account';
  if (signup) subject = 'Account created';

  email([emailAddress], subject, emailContent, function(response) {
    callback(response);
  });
};

users.doChanges = function (params, changes, reverifyEmail, callback) {
  if (!functions.objSize(changes)) callback({error: 'NOTHING_TO_CHANGE'});
  else {
    var userId = jwt.verify(params.loginToken, configs.key).userId;
    users.update(userId, changes, function(response) {
      if (!response) callback({error: 'UPDATE_FAILED'});
      else {
        if (changes.emailAddress && reverifyEmail) {
          users.sendEmailConfirmation(userId, changes.emailAddress, function(response) {
            if (response) callback({status: true});
            else callback({error: 'UPDATED_BUT_EMAIL_FAILED_TO_SEND'});
          }, false);
        }
        else callback(response);
      }
    });
  }
};

users.sendResetEmail = function (userId, emailAddress, callback) {
  var token = jwt.sign({
    tokenId: tokens.getId('RESET', userId),
    passwordResetEmail: emailAddress,
    userId: userId
  }, configs.key);
  email([emailAddress], 'Reset your password', '<h2>You requested a password reset.</h2><a href="' + configs.frontendUrl + 'resetpassword?resetToken=' + token +'">Reset password</a>', function(response) {
    callback(response);
  });
};

users.getOrders = function (userId, callback) {
  connection.query('SELECT * FROM orders WHERE userId = ? AND status = "DONE"', [userId], function(error, rows, fields) {
    callback(error ? false : rows);
  });
};

module.exports = users;
