var express = require('express');
var bodyParser = require('body-parser');
var request = require('./services');

var app = express();

app.use(bodyParser.json());

app.post('/end/*', function(req, res) {
  request(req, function(response) {
    res.send(response);
  });
});

app.post('/adm/*', function(req, res) {
  request(req, function(response) {
    res.send(response);
  });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log("Express has started");
});
