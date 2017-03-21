var mysql = require('mysql');

var connection = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeDah'
});

connection.query = function (query, callback) {
  connection.getConnection(function(error, conn) {
    if (error) {
      console.log(error);
      conn.release();
    }
    else conn.query(query, function(error, rows, fields) {
      callback(error, rows, fields);
      conn.release();
    });
  });
}

module.exports = connection;
