fs = require('fs');
var ex = {};

var templates = [
  'signup',
  'newemail',
  'entrepreneurfunded',
  'investment'
];

templates.map(function(template) {
  fs.readFile(__dirname + '/templates/' + template + '.html', 'utf8', function (err, data) {
    if (err) console.log(err);
    else {
      ex[template] = data;
    }
  });
});

module.exports = ex;
