var mysql = require('mysql');

var connection = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeDah'
});

connection.query = function (query, params, callback) {
  connection.getConnection(function(error, conn) {
    if (error) {
      console.log(error);
      if (conn) conn.release();
    }
    else conn.query(query, params, function(error, rows, fields) {
      callback(error, rows, fields);
      conn.release();
    });
  });
};

module.exports = connection;
