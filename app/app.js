var express = require('express');
var bodyParser = require('body-parser')
var connection = require('./connection');
var validate = require('./json-validation');
var entrepreneurs = require('./entrepreneurs');
var responsify = require('./responsify');
var jwt = require('./jwt');

var app = express();

app.use(bodyParser.json());

app.post('/bootloader', function(req, res) {
  res.send(responsify(1, jwt.create()));
});

app.post('/getentrepreneurbyid', function(req, res) {
  var val = validate('getentrepreneurbyid', req.body);
  if (val !== true) res.send(responsify(0, val));
  else if (!jwt.check(req.body.csrf_token)) res.send(responsify(0, 'CSRF_TOKEN_NOT_VALID'));
  else entrepreneurs.getById(connection, req.body, function(response) {
    res.send(responsify(1, response));
  });
});

app.post('/getentrepreneurs', function(req, res) {
  var val = validate('getentrepreneurs', req.body);
  if (val !== true) res.send(responsify(0, val));
  else {
    jwt.check(req.body.csrf_token, function(response) {
      if (!response) res.send(responsify(0, 'CSRF_TOKEN_NOT_VALID'));
      else entrepreneurs.getAll(connection, req.body, function(response) {
        res.send(responsify(1, response));
      });
    });
  }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log("Express has started");
});
