var connection = require('./connection');

var ex = {};
var currentId = null;

connection.query('SELECT tokenId FROM tokens ORDER BY -tokenId LIMIT 1', [], function(error, rows, fields) {
  if (error) console.log(error);
  else currentId = rows.length ? rows[0].tokenId : 0;
});

ex.getId = function (type, userId, callback) {
  currentId += 1;
  var id = currentId;
  connection.query('INSERT INTO tokens (tokenId, type, userId) VALUES (?,?,?)', [id, type, userId], function() {
    if (callback) callback(id);
  });
  if (['VISITOR', 'LOGIN'].indexOf(type) < 0)
    connection.query('UPDATE tokens SET blocked = 1 WHERE type = ? AND userId = ? AND tokenId != ?', [type, userId, currentId]);
  if (!callback) return id;
};

ex.check = function (tokenId, callback) {
  currentId += 1;
  connection.query('SELECT * FROM tokens WHERE tokenId = ? AND blocked = 0', [tokenId], function(error, rows, fields) {
    if (error) console.log(error);
    else {
      if (!rows.length) callback(false);
      else callback(true);
    }
  });
};

ex.invalidate = function (tokenId) {
  connection.query('UPDATE tokens SET blocked = 1 WHERE tokenId = ?', [tokenId]);
};

module.exports = ex;
