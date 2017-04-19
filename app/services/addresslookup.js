var configs = require('../configs');
var https = require('https');
var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    searchString: {
      type: 'string'
    }
  },
  required: ['visitorToken', 'searchString']
};

ex.func = function(params, callback) {

  https.get({
    host: 'maps.googleapis.com',
    path: '/maps/api/place/autocomplete/json?input=' + encodeURIComponent(params.searchString) + '&types=address&language=en&key=AIzaSyBzHLi1gTwe1COdBvxmQokAxrnNja_vN4E'
  }, function(res) {
    if (res.statusCode != '200') {
      callback({error: 'GOT_ERROR_STATUS_' + res.statusCode + '_FROM_GOOGLE'})
    } else {

      var body = '';

      res.on("data", function(chunk) {
        body += chunk;
      });

      res.on('end', function(){
        try {
          var response = JSON.parse(body);
          callback(response)
        }
        catch(err) {
          callback({error: err})
        }
    });

    }
  })
};

module.exports = ex;
