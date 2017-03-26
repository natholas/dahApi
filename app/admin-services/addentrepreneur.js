var entrepreneurs = require('../helpers/entrepreneurs');
var images = require('../helpers/images');
var ex = {};
fs = require('fs');

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    loginToken: {
      type: 'string'
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
      enum: ['DRAFT', 'LIVE']
    },
    teamId: {
      type: 'integer'
    },
    images: {
      type: 'array'
    }
  },
  required: ['visitorToken', 'loginToken', 'name', 'description', 'dob', 'city', 'countryId', 'amountNeeded', 'status', 'teamId', 'images']
};

ex.func = function(params, callback) {
  entrepreneurs.add(params.name, params.description, params.dob, params.city, params.countryId, params.amountNeeded, params.status, params.teamId, function(response) {
    if (!response) callback({error: 'FAILED_TO_INSERT'});
    else {
      images.add('entrepreneurId', response.insertId, params.images);
      callback({entrepreneurId: response.insertId});
    }
  });
};

module.exports = ex;
