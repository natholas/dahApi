var connection = require('./connection');
var functions = require('./functions');
var fs = require('fs');
var images = {};

images.add = function (type, id, image, callback) {
  var path = 'images/' + type.substring(0, type.length -2) + '_' + functions.randomString(32) + '.jpg';
  fs.writeFile(path, image, 'base64', function(error) {
    if (error) console.log(error);
  });
  connection.query('INSERT INTO images ('+ type +', path) VALUES (?,?) ON DUPLICATE KEY UPDATE path = ?', [id, path, path], function(error, rows, fields) {
    if (error) {
      console.log(error);
      callback(false);
    }
    else callback(path);
  });
}

module.exports = images;
