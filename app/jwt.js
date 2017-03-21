// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var configs = require('./configs')();

var funcs = {};

funcs.check = function (token, cb) {
  jwt.verify(token, configs.key, function(err, decoded) {
    cb(err ? false : true);
  });
}

funcs.create = function (data, expory) {
  return jwt.sign(
    {csrf_token: Math.random().toString(36).substring(7)},
    configs.key,
    {expiresIn: 3600 * 24} // hours
  );
}

module.exports = funcs;
