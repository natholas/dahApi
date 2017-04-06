var connection = require('../helpers/connection');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    countryId: {
      type: 'integer'
    }
  },
  required: ['visitorToken', 'countryId']
};

ex.func = function(params, callback) {
  connection.query('SELECT countryName, countryDescription from countries WHERE countryId = ?', [params.countryId], function(error, rows) {
    if (error) {
      console.log(error);
      callback({error: 'COUNTRY_NOT_FOUND'});
    }
    else {
      callback({country: {name: rows[0].countryName, description: rows[0].countryDescription}});
    }
  });
};

module.exports = ex;
