var jwt = require('jsonwebtoken');
var Validator = require('jsonschema').Validator;
var configs = require('./configs');

var services = {
  bootloader: require('./services/bootloader'),
  signup: require('./services/signup'),
  login: require('./services/login'),
  confirmemail: require('./services/confirmemail'),
  sendpasswordreset: require('./services/sendpasswordreset'),
  resetpassword: require('./services/resetpassword'),
  updateprofile: require('./services/updateprofile'),
  getentrepreneurs: require('./services/getentrepreneurs'),
  getentrepreneur: require('./services/getentrepreneur'),
  getinvestors: require('./services/getinvestors'),
  getinvestments: require('./services/getinvestments'),
  ordercomplete: require('./services/ordercomplete')
};

var adminServices = {
  addentrepreneur: require('./admin-services/addentrepreneur'),
  updateentrepreneur: require('./admin-services/updateentrepreneur')
};

var superAdminServices = {
  updateuser: require('./super-admin-services/updateuser')
};

var v = new Validator();

module.exports = function(req, callback) {

  var service = req.originalUrl.substring(5);
  var params = req.body;
  var mode, srvs;

  switch(req.originalUrl.substring(1,4)) {
    case 'adm':
      mode = 'ADMIN';
      srvs = adminServices;
      break;
    case 'sdm':
      mode = 'SUPER';
      srvs = superAdminServices;
      break;
    default:
      mode = 'CLIENT';
      srvs = services;
  }

  var response = {};

  // Checking if the service exists
  if (!srvs[service]) response.error = 'SERVICE_NOT_FOUND';

  // Checking if the JSON is valid
  if (!response.error) {
    var errors = v.validate(params, srvs[service].validation).errors;
    if (errors.length) {
      response.error = 'JSON_SCHEMA_VIOLATION';
      response.data = errors;
    }
  }

  // Checking if there should be a visitorToken and if it is valid
  if (!response.error) {
    if (srvs[service].validation.properties && srvs[service].validation.properties.visitorToken && params.visitorToken) {

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
    if (srvs[service].validation.properties && srvs[service].validation.properties.loginToken && params.loginToken) {

      // login token is needed and present. Checking if it is valid
      try {
        var decoded = jwt.verify(params.loginToken, configs.key);
        if (!decoded.loginToken) response.error = 'LOGIN_TOKEN_NOT_VALID';
        if (mode == 'ADMIN' && decoded.role != 'ADMIN' && decoded.role != 'SUPER') response.error = 'PERMISION_DENIED';
        else if (mode == 'SUPER' && decoded.role != 'SUPER') response.error = 'PERMISION_DENIED';
      } catch (err) {
        response.error = 'LOGIN_TOKEN_NOT_VALID';
      }
    }
  }

  // Running the service function
  if (!response.error) {
    response.data = srvs[service].func(params, function(resp) {
      if (resp.error) {
        response.error = resp.error;
      } else response.data = resp;
      callback(response);
    });
  } else {
    callback(response);
  }

};
