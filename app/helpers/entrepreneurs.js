var connection = require('./connection');
var users = require('./users.js');
var email = require('./email.js');
var templates = require('./templates.js');
var functions = require('./functions.js');
var entrepreneurs = {};

entrepreneurs.getAllByStatus = function (status, callback) {
  var sql = 'SELECT * FROM entrepreneur WHERE status = ? AND type = "MAIN"';
  if (status == 'ALL') sql = 'SELECT * FROM entrepreneur AND type = "MAIN"';
  connection.query(sql, [status], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

entrepreneurs.getById = function (id, callback) {
  connection.query('SELECT * FROM entrepreneur WHERE entrepreneurId = ?', [id], function (error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else callback(rows);
  });
};

entrepreneurs.getChildren = function (parentId, callback) {
  connection.query('SELECT status, entrepreneurId FROM entrepreneurs WHERE parentId = ?', [parentId], function (error, rows, fields) {
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

entrepreneurs.getInvestorMessages = function (entrepreneurId, callback) {
  connection.query(
    'SELECT * FROM messages WHERE entrepreneurId = ?', [entrepreneurId], function(error, rows, fields) {
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
          else {
            entrepreneurs.sendEntrepreneurFundedEmail(entrepreneurId);
          }
        });
      }
    }
  });
};

entrepreneurs.sendOrderConfirmationEmail = function (orderId) {
  connection.query('SELECT orders.*, entrepreneurs.name FROM orders JOIN entrepreneurs ON entrepreneurs.entrepreneurId = orders.entrepreneurId WHERE orders.orderId = ?', [orderId], function(error, rows) {
    var order = rows[0];
    connection.query('SELECT emailAddress from users WHERE userId = ?', [order.userId], function(error, rows) {
      if (error) console.log(error);
      else {
        var subject = 'Thank you for your investment';
        var body = templates.investment;
        body = body.split('@name@').join(order.name);
        body = body.split('@orderId@').join(functions.paddNumber(order.orderId, 8));
        body = body.split('@entrepreneurId@').join(order.entrepreneurId);
        body = body.split('@amount@').join(order.amount);
        body = body.split('@donationAmount@').join(order.donationAmount);
        body = body.split('@total@').join(order.amount + order.donationAmount);

        email([rows[0].emailAddress], subject, body);
      }
    });
  });
};

entrepreneurs.sendEntrepreneurFundedEmail = function (entrepreneurId) {
  connection.query('SELECT * FROM entrepreneurs WHERE entrepreneurId = ?', [entrepreneurId], function(error, rows) {
    var entrepreneur = rows[0];
    connection.query('SELECT users.emailAddress, users.nickname FROM users JOIN orders ON orders.userId = users.userId WHERE orders.status = "DONE" AND orders.entrepreneurId = ?', [entrepreneurId], function(error, rows) {
      if (error) console.log(error);
      else {
        var subject = entrepreneur.name + ' has been fully funded!';
        var body = templates.entrepreneurfunded;
        body = body.split('@id@').join(entrepreneurId);
        body = body.split('@name@').join(entrepreneur.name);

        for (var i in rows) {
          email([rows[i].emailAddress], subject, body);
        }
      }
    });
  });
};

module.exports = entrepreneurs;
