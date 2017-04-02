var entrepreneurs = require('../helpers/entrepreneurs');
var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    loginToken: {
      type: 'string'
    },
    entrepreneurId: {
      type: 'integer'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    dob: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    countryId: {
      type: 'integer'
    },
    amountNeeded: {
      type: 'float'
    },
    status: {
      type: 'string',
      enum: ['DRAFT', 'LIVE', 'FUNDED']
    },
    teamId: {
      type: 'integer'
    }
  },
  required: ['visitorToken', 'loginToken', 'name', 'description', 'dob', 'city', 'countryId', 'amountNeeded', 'status', 'teamId']
};

ex.func = function(params, callback) {
  entrepreneurs.update(params.entrepreneurId, params.name, params.description, params.dob, params.city, params.countryId, params.amountNeeded, params.status, params.teamId, function(response) {
    if (!response || !response.affectedRows) callback({error: 'FAILED_TO_UPDATE'});
    else callback({status: 1});
  });
};

module.exports = ex;
