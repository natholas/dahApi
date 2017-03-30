var express = require('express');
var bodyParser = require('body-parser');
var request = require('./services');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use('../images', express.static(__dirname));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.set('port', 443);

// app.listen(app.get('port'), function() {
//   console.log("Express has started");
// });

var privateKey = fs.readFileSync( '/etc/letsencrypt/keys/0000_key-certbot.pem', 'utf8' );
var certificate = fs.readFileSync( '/etc/letsencrypt/csr/0000_csr-certbot.pem', 'utf8' );

console.log(privateKey);
console.log();
console.log();
console.log();
console.log();
console.log(certificate);
console.log();
console.log();
console.log();
console.log();
https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(app.get('port'));




app.get('/', function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
});

app.get('/images/*', function(req,res) {
  res.sendFile(path.resolve('images/' + req.originalUrl.substring(8)));
});

app.post('/*', function(req, res) {
  request(req, function(response) {
    res.send(response);
  });
});
