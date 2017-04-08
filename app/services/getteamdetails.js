var connection = require('../helpers/connection');

var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    teamId: {
      type: 'integer'
    }
  },
  required: ['visitorToken', 'teamId']
};

ex.func = function(params, callback) {
  connection.query('SELECT name, description from teams WHERE teamId = ?', [params.teamId], function(error, rows) {
    if (error) {
      console.log(error);
      callback({error: 'TEAM_NOT_FOUND'});
    }
    else {
      callback({team: {name: rows[0].name, description: rows[0].description}});
    }
  });
};

module.exports = ex;
