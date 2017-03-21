var Validator = require('jsonschema').Validator;
var v = new Validator();
var instance = 4;

var schemas = {
  "getentrepreneurbyid": {
    "type": "object",
    "properties": {
      "csrf_token": {"type": "string"},
      "id": {"type": "integer"}
    }
  },
  "getentrepreneurs": {
    "type": "object",
    "properties": {
      "csrf_token": {"type": "string"}
    }
  }
}

module.exports = function (name, data) {
  var errors = v.validate(data, schemas[name]).errors;
  return errors.length ? errors : true;
}
