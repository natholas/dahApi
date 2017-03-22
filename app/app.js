var express = require('express');
var bodyParser = require('body-parser');
var request = require('./services');

var app = express();

app.use(bodyParser.json());

app.post('/*', function(req, res) {
  request(req, function(response) {
    res.send(response);
  });
});

// app.post('/bootloader', function(req, res) {
//   res.send(responsify(1, jwt.create({csrf_token: Math.random().toString(36).substring(7)})));
// });
//
// app.post('/signup', function(req, res) {
//   var val = validate('signup', req.body);
//   if (val !== true) res.send(responsify(0, val));
//   else {
//     jwt.check(req.body.csrf_token, function(response) {
//       if (!response) res.send(responsify(0, 'CSRF_TOKEN_NOT_VALID'));
//       else account.createAccount(connection, req.body.emailAddress, req.body.password, 'USER', function(response) {
//         res.send(responsify(1, response));
//       });
//     });
//   }
// });
//
// app.post('/login', function(req, res) {
//   var val = validate('login', req.body);
//   if (val !== true) res.send(responsify(0, val));
//   else {
//     var tokens = jwt.check(req.body.csrf_token);
//     if (!tokens) res.send(responsify(0, 'CSRF_TOKEN_NOT_VALID'));
//     else account.login(connection, req.body.emailAddress, req.body.password, function(response) {
//       if (response) res.send(responsify(1, response));
//       else res.send(responsify(0, 'USERNAME_OR_PASSWORD_INCORRECT'));
//     });
//   }
// });
//
// app.post('/getentrepreneurbyid', function(req, res) {
//   var val = validate('getentrepreneurbyid', req.body);
//   if (val !== true) res.send(responsify(0, val));
//   else {
//     var tokens = jwt.check([req.body.csrf_token, req.body.login_token]);
//     if (!tokens) res.send(responsify(0, 'CSRF_TOKEN_NOT_VALID'));
//     else entrepreneurs.getById(connection, req.body, function(response) {
//       res.send(responsify(1, response));
//     });
//   }
// });
//
// app.post('/getentrepreneurs', function(req, res) {
//   var val = validate('getentrepreneurs', req.body);
//   if (val !== true) res.send(responsify(0, val));
//   else {
//     jwt.check(req.body.csrf_token, function(response) {
//       if (!response) res.send(responsify(0, 'CSRF_TOKEN_NOT_VALID'));
//       else entrepreneurs.getAll(connection, req.body, function(response) {
//         res.send(responsify(1, response));
//       });
//     });
//   }
// });

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log("Express has started");
});
