var express = require('express');
var bodyParser = require('body-parser');
var request = require('./services');
var path = require('path');
var https = require('https');
var fs = require('fs');
var paymentComplete = require('./paymentcomplete');
var paymentFailed = require('./paymentfailed');

var app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use('../images', express.static(__dirname));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

if (__dirname == 'C:\\Users\\Nathan\\Documents\\dah\\api\\app') {
  // Dev
  app.listen(3000, function () {
    console.log('-------------------');
    console.log();
    console.log('DEVELOPMENT SERVER RUNNING.');
    console.log('IF YOU ARE SEEING THIS IN PRODUCTION, YOU HAVE A PROBLEM.');
    console.log();
    console.log('-------------------');
  });
}
else {
  // Production

  // Force https
  app.use(function requireHTTPS(req, res, next) {
    if (!req.secure) return res.redirect('https://' + req.get('host') + req.originalUrl);
    next();
  });

  var ports = [80, 443];

  var server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/dignity-hope.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dignity-hope.org/fullchain.pem')
  }, app);

  server.listen(ports[1]);
  app.listen(ports[0]);
}

app.get('/', function(req, res) {
  return res.redirect('https://dignityhope.org');
});

app.get('/images/*', function(req, res) {
  res.sendFile(path.resolve('images/' + req.originalUrl.substring(8)));
});

app.get('/paymentcomplete*', function(req, res) {
  paymentComplete(req, function(response) {
    res.redirect(response);
  });
});

app.get('/paymentfailed*', function(req, res) {
  paymentFailed(req, function(response) {
    res.redirect(response);
  });
});

app.post('/*', function(req, res) {
  request(req, function(response) {
    res.send(response);
  });
});
