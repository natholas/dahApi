var entrepreneurs = {};

entrepreneurs.getById = function (conn, params, callback) {
  conn.query('SELECT * FROM entrepreneurs WHERE id = ' + params.id, function(error, rows, fields) {
    if (error) console.log(error);
    else callback(rows[0]);
  });
};

entrepreneurs.getAll = function (conn, params, callback) {
  conn.query('SELECT * FROM entrepreneurs', function(error, rows, fields) {
    if (error) console.log(error);
    else callback(rows);
  });
};

module.exports = entrepreneurs;
