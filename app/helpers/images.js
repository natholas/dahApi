var connection = require('./connection');
var functions = require('./functions');
var images = {};

images.add = function (type, id, images) {
  for (var i in images) {
    var path = 'images/' + type.substring(0, type.length -2) + '_' + functions.randomString(32) + '.jpg';
    fs.writeFile(path, images[i], 'base64', function(error) {
      if (error) console.log(error);
    });
    connection.query('INSERT INTO images ('+ type +', path) VALUES (?,?)', [id, path], function(error, rows, fields) {
      if (error) console.log(error);
    })
  }
}

module.exports = images;
