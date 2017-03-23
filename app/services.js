var jwt = require('jsonwebtoken');
var Validator = require('jsonschema').Validator;
var configs = require('./configs');

var services = {
  bootloader: require('./services/bootloader'),
  signup: require('./services/signup'),
  login: require('./services/login'),
  getentrepreneurs: require('./services/getentrepreneurs'),
  getentrepreneur: require('./services/getentrepreneur')
};


var v = new Validator();

module.exports = function(req, callback) {

  var service = req.originalUrl.substring(1);
  var params = req.body;

  var response = {};

  // Checking if the service exists
  if (!services[service]) response.error = 'SERVICE_NOT_FOUND';

  // Checking if the JSON is valid
  if (!response.error) {
    var errors = v.validate(params, services[service].validation).errors;
    if (errors.length) {
      response.error = 'JSON_SCHEMA_VIOLATION';
      response.data = errors;
    }
  }

  // Checking if there should be a visitorToken and if it is valid
  if (!response.error) {
    if (services[service].validation.properties && services[service].validation.properties.visitorToken && params.visitorToken) {

      // Visitor token is needed and present. Checking if it is valid
      try {
        var decoded = jwt.verify(params.visitorToken, configs.key);
        if (!decoded.visitorToken) response.error = 'VISITOR_TOKEN_NOT_VALID';
      } catch (err) {
        response.error = 'VISITOR_TOKEN_NOT_VALID';
      }
    }
  }

  // Checking if there should be a login token and if it is valid
  if (!response.error) {
    if (services[service].validation.properties && services[service].validation.properties.loginToken && params.loginToken) {

      // login token is needed and present. Checking if it is valid
      try {
        var decoded = jwt.verify(params.loginToken, configs.key);
        if (!decoded.loginToken) response.error = 'LOGIN_TOKEN_NOT_VALID';
      } catch (err) {
        response.error = 'LOGIN_TOKEN_NOT_VALID';
      }
    }
  }

  // Running the service function
  if (!response.error) {
    response.data = services[service].func(params, function(resp) {
      if (resp.error) {
        response.error = resp.error;
      } else response.data = resp;
      callback(response);
    });
  } else {
    callback(response);
  }

};
