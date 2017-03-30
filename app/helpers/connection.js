var mysql = require('mysql');
var configs = require('../configs');

var connection = mysql.createPool({
  connectionLimit: 50,
  host: configs.db.host,
  user: configs.db.user,
  password: configs.db.password,
  database: configs.db.database
});

connection.query = function (query, params, callback) {
  connection.getConnection(function(error, conn) {
    if (error) {
      console.log(error);
      if (conn) conn.release();
    }
    else conn.query(query, params, function(error, rows, fields) {
      if (callback) callback(error, rows, fields);
      conn.release();
    });
  });
};

module.exports = connection;
