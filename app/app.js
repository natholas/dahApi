var express = require('express');
var bodyParser = require('body-parser');
var request = require('./services');
var path = require('path');

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

app.get('/images/*', function(req,res) {
  res.sendFile(path.resolve('images/' + req.originalUrl.substring(8)));
})

app.post('/*', function(req, res) {
  request(req, function(response) {
    res.send(response);
  });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log("Express has started");
});
